import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "../../redis/redis.provider";

const AUCTION_TTL_SECONDS = 60 * 60 * 6; // 6 hours
@Injectable()
export class LiveAuctionRedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}
  // private auctionKey(id: string) {
  //   return `auction:${id}`;
  // }

  // ==========================================
  // 1. INITIALIZATION (Load DB -> Redis)
  // ==========================================
  // INITIALIZATION (SETTINGS, TEAMS, PLAYERS)
  // ==========================================
  async initializeAuctionState(
    auctionId: string,
    settings: any,
    teams: any[],
    players: any[],
    categories: any[],
  ) {
    const pipeline = this.redis.pipeline();
    const pong = await this.redis.ping();
    console.log("🧠 Redis PING from Nest:", pong);
    const baseKey = `auction:${auctionId}`;

    // A. Clean Old State
    pipeline.del(
      `${baseKey}:settings`,
      `${baseKey}:teams`,
      `${baseKey}:unsold`,
      `${baseKey}:bids`,
      `${baseKey}:current_player`,
      `${baseKey}:last_bid`,
      `${baseKey}:status`,
    );
    console.log("🧹 Resetting Redis for auction:", auctionId);

    // B. Save Settings
    pipeline.set(`${baseKey}:settings`, JSON.stringify(settings));
    pipeline.expire(`${baseKey}:settings`, AUCTION_TTL_SECONDS);

    // C. Save Team Budgets
    if (teams.length > 0) {
      const teamBudgets: Record<string, number> = {};
      const teamMeta: Record<string, string> = {};

      const minPlayers = Number(settings.minPlayersPerTeam || 11);
      const baseBid = Number(settings.minBid || 1000);

      for (const team of teams) {
        const purse = Number(team.originalPurse) - Number(team.purseSpent || 0);
        const playersBought = Number(team.playersCount || 0);

        // RESERVE LOGIC (minPlayers - 1 rule)
        const reservableSlots = Math.max(minPlayers - playersBought - 1, 0);
        const reserved = reservableSlots * baseBid;
        const maxAllowedBid = purse - reserved;

        pipeline.hset(
          `${baseKey}:teams`,
          team.id,
          JSON.stringify({
            id: team.id,
            name: team.name,
            shortName: team.shortName,
            logo: team.logo,

            // LIVE VALUES
            purse,
            playersBought,

            // AUCTION RULES (CACHED)
            minPlayers,
            baseBid,

            // CALCULATED
            reserved,
            maxAllowedBid,

            boostersUsed: 0,
          }),
        );

        console.log(
          "📥 Team Loaded:",
          team.name,
          "Purse:",
          purse,
          "Players:",
          playersBought,
          "Reserved:",
          reserved,
          "MaxBid:",
          maxAllowedBid,
          "Settings:",
          settings,
        );
      }

      pipeline.hmset(`${baseKey}:teams:budget`, teamBudgets);
      pipeline.hmset(`${baseKey}:teams:meta`, teamMeta);

      pipeline.expire(`${baseKey}:teams:budget`, AUCTION_TTL_SECONDS);
      pipeline.expire(`${baseKey}:teams:meta`, AUCTION_TTL_SECONDS);

      console.log("💰 Loaded teams into Redis:", teamBudgets);
    }

    if (Array.isArray(categories) && categories.length > 0) {
      const catKey = `${baseKey}:categories`;

      pipeline.del(catKey);

      for (const cat of categories) {
        pipeline.hset(
          catKey,
          cat.id,
          JSON.stringify({
            id: cat.id,
            name: cat.name,
            color: cat.color,
          }),
        );
      }

      pipeline.expire(catKey, AUCTION_TTL_SECONDS);
    }

    // D. Save UNSOLD Players (Minimal Payload Only)
    if (players.length > 0) {
      const playerStrings = players.map((p) =>
        JSON.stringify({
          id: p.id,
          name: p.name,
          profilePic: p.profilePic,
          role: p.role,
          battingStyle: p.battingStyle,
          bowlingStyle: p.bowlingStyle,
          basePrice: Number(p.basePrice || 0),
          status: p.status || "NULL",
          category: p.category
            ? {
                name: p.category.name,
                color: p.category.color,
              }
            : {
                name: "UNCATEGORIZED",
                color: "#999",
              },
        }),
      );

      pipeline.rpush(`${baseKey}:unsold`, ...playerStrings);
      pipeline.expire(`${baseKey}:unsold`, AUCTION_TTL_SECONDS);
    }

    // E. Set Auction Status
    pipeline.set(`${baseKey}:status`, "WAITING");
    pipeline.expire(`${baseKey}:status`, AUCTION_TTL_SECONDS);

    await pipeline.exec();
  }

  // ==========================================
  // 2. PLAYER MANAGEMENT
  // ==========================================
  async setCurrentPlayer(auctionId: string, player: any) {
    const key = auctionId ? `auction:${auctionId}` : auctionId;
    const settings = await this.getSettings(auctionId);
    const duration = Number(90000);
    // Save full player object as JSON string;
    // Reset Bid History for this new player
    if (!player) {
      await this.redis.del(
        key + ":current_player",
        key + ":bids",
        key + ":last_bid",
        key + ":bid_start_time",
        key + ":bid_duration",
      );
      return;
    }
    await this.redis
      .multi()
      .set(`${key}:current_player`, JSON.stringify(player))
      .del(`${key}:bids`)
      .del(`${key}:last_bid`)
      .set(`${key}:bid_start_time`, Date.now())
      .set(`${key}:bid_duration`, duration)
      .set(`${key}:status`, "BIDDING")
      .set(key, JSON.stringify(player), "EX", AUCTION_TTL_SECONDS) // Optional: Cache current player for quick access
      .exec();
  }
  async getBidTimer(auctionId: string) {
    const baseKey = `auction:${auctionId}`;
    const [startRaw, durationRaw] = await this.redis.mget(
      `${baseKey}:bid_start_time`,
      `${baseKey}:bid_duration`,
    );
    return {
      startTime: startRaw ? Number(startRaw) : null,
      duration: durationRaw ? Number(durationRaw) : null,
    };
  }

  // 5. SMART PLAYER SELECTION
  // ==========================================
  async getNextPlayer(
    auctionId: string,
    mode: "SEQUENCE" | "RANDOM" | "MANUAL",
    categoryId?: string,
    playerNo?: number,
  ) {
    // 1. Fetch ALL unsold players (We store them as a list/set in Redis on Init)
    // Assuming 'auction:{id}:unsold' is a list of JSON strings
    const rawPlayers = await this.redis.lrange(
      `auction:${auctionId}:unsold`,
      0,
      -1,
    );
    let players = rawPlayers.map((p) => JSON.parse(p));
    console.log("🔎 Redis unsold count:", rawPlayers.length);

    // 2. Filter by Category (if provided)
    if (categoryId && categoryId !== "ALL") {
      players = players.filter((p) => p.category?.name === categoryId);
    }

    if (players.length === 0) return null;

    let selectedPlayer = null;

    // 3. Apply Selection Mode
    if (mode === "MANUAL" && playerNo) {
      selectedPlayer = players.find((p) => p.rowNumber === playerNo); // 'rowNumber' from Excel
    } else if (mode === "RANDOM") {
      const randomIndex = Math.floor(Math.random() * players.length);
      selectedPlayer = players[randomIndex];
    } else {
      // SEQUENCE (Default): Take the first one in the list
      selectedPlayer = players[0];
    }
    // console.log("🔎 First Redis Player Sample:", players[0]);
    await this.redis.lrem(
      `auction:${auctionId}:unsold`,
      1,
      JSON.stringify(selectedPlayer),
    );

    return selectedPlayer;
  }

  async removePlayerFromUnsold(auctionId: string, playerId: string) {
    // Find and remove the specific player from the Redis List
    // In a real app with 2000 players, we use Redis Lists (LREM) efficiently.
    // For now, we read-filter-write (OK for <5000 items).
    const key = `auction:${auctionId}:unsold`;
    const raw = await this.redis.lrange(key, 0, -1);

    const updated = raw.filter((p) => JSON.parse(p).id !== playerId);

    await this.redis.del(key);
    if (updated.length > 0) {
      await this.redis.rpush(key, ...updated);
      await this.redis.expire(key, AUCTION_TTL_SECONDS);
    }
  }

  // ==========================================
  // 6. STATUS MANAGEMENT (Soft Sold)
  // ==========================================
  async setAuctionStatus(
    auctionId: string,
    status: "WAITING" | "BIDDING" | "SOLD_PENDING" | "PAUSED" | "COMPLETED",
  ) {
    await this.redis.set(`auction:${auctionId}:status`, status);
  }

  async getCurrentPlayer(auctionId: string) {
    const data = await this.redis.get(`auction:${auctionId}:current_player`);
    return data ? JSON.parse(data) : null;
  }

  // ==========================================
  // 3. BIDDING MANAGEMENT (The Undo Feature)
  // ==========================================
  async addBid(auctionId: string, bidData: any) {
    // Push to a List (Stack) so we can pop it for UNDO
    // bidData = { teamId: "...", amount: 5000, timestamp: ... }
    await this.redis.rpush(
      `auction:${auctionId}:bids`,
      JSON.stringify(bidData),
    );
  }

  async getLastBid(auctionId: string) {
    // Get the last item from the list
    const list = await this.redis.lrange(`auction:${auctionId}:bids`, -1, -1);
    return list[0] ? JSON.parse(list[0]) : null;
  }
  async placeBid(auctionId: string, bid: any) {
    const pipeline = this.redis.pipeline();

    pipeline.set(
      `auction:${auctionId}:last_bid`,
      JSON.stringify(bid),
      "EX",
      AUCTION_TTL_SECONDS,
    );

    pipeline.rpush(`auction:${auctionId}:bids`, JSON.stringify(bid));
    pipeline.expire(`auction:${auctionId}:bids`, AUCTION_TTL_SECONDS);

    await pipeline.exec();
  }

  async undoLastBid(auctionId: string) {
    const baseKey = `auction:${auctionId}`;

    // Remove last bid
    await this.redis.rpop(`${baseKey}:bids`);

    // Get new top bid
    const newLastRaw = await this.redis.lindex(`${baseKey}:bids`, -1);

    if (!newLastRaw) {
      // No bids left — reset state
      await this.redis.del(`${baseKey}:last_bid`);
      return { lastBid: null };
    }

    // Set new last bid
    await this.redis.set(`${baseKey}:last_bid`, newLastRaw);

    return {
      lastBid: JSON.parse(newLastRaw),
    };
  }

  // ==========================================
  // 4. TEAM BUDGETS (Fast Validation)
  // ==========================================
  async getTeamBudget(
    auctionId: string,
    teamId: string,
  ): Promise<number | null> {
    const raw = await this.redis.hget(`auction:${auctionId}:teams`, teamId);
    if (!raw) return null;

    const team = JSON.parse(raw);
    return Number(team.purse);
  }

  async getTeamMeta(auctionId: string, teamId: string) {
    const raw = await this.redis.hget(`auction:${auctionId}:teams`, teamId);
    return raw ? JSON.parse(raw) : null;
  }

  async deductBudget(auctionId: string, teamId: string, amount: number) {
    const key = `auction:${auctionId}:teams`;

    // 1. Get the current Team JSON
    const rawTeam = await this.redis.hget(key, teamId);
    if (!rawTeam) return;

    const team = JSON.parse(rawTeam);

    // 2. Perform the math manually
    // Ensure we handle strings/numbers safely
    const currentPurse = Number(team.purse);
    const newPurse = currentPurse - Number(amount);

    team.purse = newPurse; // Update the object

    // 3. Save the JSON back
    await this.redis.hset(key, teamId, JSON.stringify(team));

    // 4. ALSO update the 'budget' key if you are using it for validation
    // (You had a separate :teams:budget key in your init function)
    const budgetKey = `auction:${auctionId}:teams:budget`;
    await this.redis.hincrby(budgetKey, teamId, -Number(amount));
  }
  //6. Get Auction Status
  async getAuctionStatus(
    auctionId: string,
  ): Promise<"WAITING" | "BIDDING" | "SOLD_PENDING" | "PAUSED" | "COMPLETED"> {
    const status = await this.redis.get(`auction:${auctionId}:status`);
    return (status as any) || "WAITING";
  }

  //7.Settings & status
  async getSettings(auctionId: string) {
    const data = await this.redis.get(`auction:${auctionId}:settings`);
    return data ? JSON.parse(data) : null;
  }

  //8. settings & status
  async setSettings(auctionId: string, settings: any) {
    await this.redis.set(
      `auction:${auctionId}:settings`,
      JSON.stringify(settings),
    );
  }
  async getTeam(auctionId: string, teamId: string) {
    const raw = await this.redis.hget(`auction:${auctionId}:teams`, teamId);
    return raw ? JSON.parse(raw) : null;
  }
  async setTeam(auctionId: string, teamId: string, data: any) {
    await this.redis.hset(
      `auction:${auctionId}:teams`,
      teamId,
      JSON.stringify(data),
    );
  }

  //9 Get Bid History
  async getBidHistory(auctionId: string) {
    const list = await this.redis.lrange(`auction:${auctionId}:bids`, 0, -1);
    return list.map((b) => JSON.parse(b));
  }
  async addPlayersToQueue(auctionId: string, players: any[]) {
    if (players.length === 0) return;

    const playerStrings = players.map((p) => JSON.stringify(p));
    // RPUSH adds them to the end of the list
    await this.redis.rpush(`auction:${auctionId}:unsold`, ...playerStrings);
  }

  async getUnsoldCount(auctionId: string): Promise<number> {
    const key = `auction:${auctionId}:unsold`;
    return this.redis.llen(key);
  }
  async getUnsoldPool(auctionId: string) {
    const list = await this.redis.lrange(
      `auction:${auctionId}:unsold_pool`,
      0,
      -1,
    );

    return list.map((p) => JSON.parse(p));
  }

  async setDashboardSnapshot(auctionId: string, data: any) {
    await this.redis.set(
      `auction:${auctionId}:snapshot`,
      JSON.stringify(data),
      "EX",
      AUCTION_TTL_SECONDS,
    );
  }

  async getDashboardSnapshot(auctionId: string) {
    const raw = await this.redis.get(`auction:${auctionId}:snapshot`);
    return raw ? JSON.parse(raw) : null;
  }

  async addToUnsoldPool(auctionId: string, player: any) {
    await this.redis.rpush(
      `auction:${auctionId}:unsold_pool`,
      JSON.stringify(player),
    );
  }
  async clearUnsoldPool(auctionId: string) {
    await this.redis.del(`auction:${auctionId}:unsold_pool`);
  }

  async finalizeAuction(auctionId: string) {
    const baseKey = `auction:${auctionId}`;

    await this.redis
      .multi()
      .set(`${baseKey}:status`, "COMPLETED")
      .del(
        `${baseKey}:current_player`,
        `${baseKey}:last_bid`,
        `${baseKey}:bids`,
        `${baseKey}:unsold`,
      )
      .expire(`${baseKey}:teams`, 60 * 10)
      .expire(`${baseKey}:settings`, 60 * 10)
      .exec();
  }
  async getAllTeams(auctionId: string) {
    const raw = await this.redis.hgetall(`auction:${auctionId}:teams`);

    return Object.values(raw).map((val) => {
      const t = JSON.parse(val);
      return {
        id: t.id,
        name: t.name,
        purse: Number(t.purse),
        playersCount: Number(t.playersBought || 0),
        reserved: Number(t.reserved || 0),
        maxAllowedBid: Number(t.maxAllowedBid || 0),
        boostersUsed: Number(t.boostersUsed || 0),
      };
    });
  }

  getNextIncrement(amount: number, defaultIncrement: any, bidRules: any) {
    let increment = Number(defaultIncrement || 500);

    try {
      const rules =
        typeof bidRules === "string" ? JSON.parse(bidRules) : bidRules;

      if (Array.isArray(rules)) {
        for (const rule of rules) {
          if (amount >= Number(rule.threshold)) {
            increment = Number(rule.increment);
          }
        }
      }
    } catch (e) {
      console.warn("⚠️ Invalid bidRules JSON, using default increment");
    }

    return increment;
  }
  // ==========================================
  // PLAYERS BOUGHT TRACKER
  // ==========================================
  async incrementPlayersBought(auctionId: string, teamId: string) {
    const key = `auction:${auctionId}:teams`;
    const raw = await this.redis.hget(key, teamId);
    if (!raw) return;

    const team = JSON.parse(raw);

    const minPlayers = Number(team.minPlayers);
    const baseBid = Number(team.baseBid);

    const newCount = Number(team.playersBought || 0) + 1;
    const reservableSlots = Math.max(minPlayers - newCount - 1, 0);

    const reserved = reservableSlots * baseBid;
    const maxAllowedBid = Number(team.purse) - reserved;

    team.playersBought = newCount;
    team.reserved = reserved;
    team.maxAllowedBid = maxAllowedBid;

    await this.redis.hset(key, teamId, JSON.stringify(team));

    console.log(
      "🔄 Team Updated:",
      team.name,
      "Players:",
      newCount,
      "Reserved:",
      reserved,
      "MaxBid:",
      maxAllowedBid,
    );
  }

  async getCategories(auctionId: string) {
    const raw = await this.redis.hgetall(`auction:${auctionId}:categories`);

    return Object.values(raw).map((c) => JSON.parse(c));
  }

  private readonly bidScript = `
-- =====================
-- KEYS
-- =====================
-- 1 = auction status
-- 2 = last bid
-- 3 = teams hash
-- 4 = bids list
-- 5 = current player

-- =====================
-- ARGV
-- =====================
-- 1 = teamId
-- 2 = bidAmount
-- 3 = timestamp

local status = redis.call("GET", KEYS[1])
if status ~= "BIDDING" then
  return {err="BIDDING_CLOSED"}
end

local teamRaw = redis.call("HGET", KEYS[3], ARGV[1])
local lastBidRaw = redis.call("GET", KEYS[2])
local playerRaw = redis.call("GET", KEYS[5])

if not teamRaw then
  return {err="TEAM_NOT_FOUND"}
end

if not playerRaw then
  return {err="NO_PLAYER_DATA"}
end

local team = cjson.decode(teamRaw)
local player = cjson.decode(playerRaw)

local bidAmount = tonumber(ARGV[2])
local teamId = ARGV[1]

-- =====================
-- READ AUCTION RULES FROM TEAM META
-- =====================
local minPlayers = tonumber(team.minPlayers)
local minBid = tonumber(team.baseBid)
local playersBought = tonumber(team.playersBought or 0)
local teamBudget = tonumber(team.purse)

if not minPlayers or not minBid then
  return {err="TEAM_RULES_MISSING"}
end

local basePrice = tonumber(player.basePrice or minBid)

-- =====================
-- FIRST / NEXT BID CHECK
-- =====================
if not lastBidRaw then
  if bidAmount < basePrice then
    return {err="BELOW_BASE_PRICE"}
  end
else
  local lastBid = cjson.decode(lastBidRaw)

  if lastBid.teamId == teamId then
    return {err="SELF_BIDDING"}
  end

  if bidAmount <= tonumber(lastBid.amount) then
    return {err="LOW_BID"}
  end
end

-- =====================
-- RESERVE CALC
-- Rule: (minPlayers - playersBought - 1) * minBid
-- =====================
local reservableSlots = minPlayers - playersBought - 1
if reservableSlots < 0 then
  reservableSlots = 0
end

local reserved = reservableSlots * minBid
local maxAllowed = teamBudget - reserved

if bidAmount > maxAllowed then
  return {
    err="MAX_BID_EXCEEDED",
    reserved=reserved,
    maxAllowed=maxAllowed
  }
end

-- =====================
-- SAVE BID
-- =====================
local bid = cjson.encode({
  teamId = teamId,
  amount = bidAmount,
  timestamp = ARGV[3]
})

redis.call("SET", KEYS[2], bid)
redis.call("RPUSH", KEYS[4], bid)

-- =====================
-- UPDATE TEAM META
-- =====================
team.maxAllowedBid = maxAllowed
team.reserved = reserved

redis.call("HSET", KEYS[3], teamId, cjson.encode(team))

return {
  ok="SUCCESS",
  reserved=reserved,
  maxAllowed=maxAllowed,
  remainingBudget=teamBudget - bidAmount
}
`;

  // Update the function call to pass the 5th Key (Player Data)
  async atomicPlaceBid(auctionId: string, teamId: string, amount: number) {
    const statusKey = `auction:${auctionId}:status`;
    const lastBidKey = `auction:${auctionId}:last_bid`;
    const teamKey = `auction:${auctionId}:teams`;
    const bidsKey = `auction:${auctionId}:bids`;
    const playerKey = `auction:${auctionId}:current_player`;

    return this.redis.eval(
      this.bidScript,
      5,
      statusKey,
      lastBidKey,
      teamKey,
      bidsKey,
      playerKey,
      teamId,
      String(amount),
      String(Date.now()),
    );
  }
}
