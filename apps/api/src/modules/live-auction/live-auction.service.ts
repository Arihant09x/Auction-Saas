import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { LiveAuctionRedisService } from "./live-auction.redis.service";
import * as firebase from "firebase-admin"; // 1. Import Firebase
import { Auction } from "../../common/constants/plan-limits";

@Injectable()
export class LiveAuctionService {
  constructor(
    private prisma: PrismaService,
    private redisService: LiveAuctionRedisService,
  ) {}

  // ============================================
  // 🔐 SECURITY: Verify Token & Get User
  // ============================================
  async verifySocketToken(token: string) {
    try {
      // A. Verify with Firebase
      const decodedToken = await firebase.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      // B. Fetch User from DB (To get Role & ID)
      const user = await this.prisma.prisma.user.findUnique({
        where: { firebaseUid: uid },
        select: { id: true, name: true, role: true },
      });

      if (!user) return null;

      // C. Return User Info
      // We check if they are the ORGANIZER later in the Gateway
      return user;
    } catch (error: any) {
      console.error("Socket Token Verification Failed:", error.message);
      return null;
    }
  }

  // ============================================
  // 🏁 INIT AUCTION (Organizer Only)
  // ============================================
  async initAuction(auctionId: string) {
    // 1. Fetch from Postgres
    const auction = await this.prisma.prisma.auction.findUnique({
      // Fixed typo: this.prisma.auction
      where: { id: auctionId },
      include: {
        categories: true,
      },
    });
    if (!auction) throw new NotFoundException("Auction not found");

    const teams = await this.prisma.prisma.team.findMany({
      where: { auctionId },
    });

    const players = await this.prisma.prisma.player.findMany({
      where: {
        auctionId,
        status: "UPCOMING",
      },
      orderBy: { name: "asc" },

      select: {
        id: true,
        name: true,
        profilePic: true,
        role: true,
        battingStyle: true,
        bowlingStyle: true,
        basePrice: true,

        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    });

    // 2. Prepare Settings
    const settings = {
      minBid: Number(auction.minBid),
      bidIncrease: Number(auction.bidIncrease),
      bidRules: auction.bidRules,
      minPlayerPerTeam: auction.minPlayersPerTeam,
      maxPlayersPerTeam: auction.maxPlayersPerTeam,
      budgetPerTeam: Number(auction.budgetPerTeam),
      isBoosterEnabled: auction.isBoosterEnabled,
      boosterAmount: Number(auction.boosterAmount),
      boosterTrigger: Number(auction.boosterTriggerPlayerCount),
    };
    // ===========================
    // BUILD DASHBOARD SNAPSHOT
    // ===========================
    const soldPlayers = await this.prisma.prisma.player.findMany({
      where: { auctionId, status: "SOLD" },
      include: { category: true, team: true },
    });

    const unsoldPlayers = await this.prisma.prisma.player.findMany({
      where: { auctionId, status: "UNSOLD" },
      include: { category: true },
    });

    const mapPlayer = (p: any) => ({
      id: p.id,
      auctionId: p.auctionId,
      name: p.name,
      age: p.age,
      profilePic: p.profilePic,
      role: p.role,
      battingStyle: p.battingStyle,
      bowlingStyle: p.bowlingStyle,
      basePrice: Number(p.basePrice),
      soldPrice: p.soldPrice || null,
      status: p.status,
      teamName: p.team?.name || null,
    });

    const mapTeam = (t: any) => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      logo: t.logo,
      playersCount: t.playersCount,
      purseSpent: t.purseSpent,
    });

    const snapshot = {
      players: {
        sold: soldPlayers.map(mapPlayer),
        unsold: unsoldPlayers.map(mapPlayer),
        upcoming: players.map(mapPlayer),
      },
      teams: teams.map(mapTeam),
      categories: auction.categories.map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
      })),
    };

    // 3. Load into Redis
    await this.redisService.setDashboardSnapshot(auctionId, snapshot);
    await this.redisService.initializeAuctionState(
      auctionId,
      settings,
      teams,
      players,
      auction.categories,
    );
    console.log("📦 Players loaded into Redis:", players.length);

    // 4. Return State
    return this.getCurrentState(auctionId);
  }
  async selectPlayer(
    auctionId: string,
    mode: "SEQUENCE" | "RANDOM" | "MANUAL",
    categoryId?: string,
    playerNo?: number,
  ) {
    // 1. Get from Redis
    const player = await this.redisService.getNextPlayer(
      auctionId,
      mode,
      categoryId,
      playerNo,
    );
    if (!player) return null;

    // 2. Set as Current Player in Redis
    await this.redisService.setCurrentPlayer(auctionId, player);
    // await this.redisService.removePlayerFromUnsold(auctionId, player.id);
    await this.redisService.setAuctionStatus(auctionId, "BIDDING");

    // 3. Set Base Bid
    // const startBid = {
    //   teamId: null,
    //   amount: Number(player.basePrice),
    //   timestamp: Date.now(),
    // };
    // await this.redisService.addBid(auctionId, startBid);

    return {
      ...player,
      category: player.category,
    };
  }

  // ==========================================
  // THE FINAL TRANSACTION (Hard Sold)
  // ==========================================
  async confirmSale(auctionId: string) {
    // 1. Get Final State from Redis
    const player = await this.redisService.getCurrentPlayer(auctionId);
    const lastBid = await this.redisService.getLastBid(auctionId);
    const status = await this.redisService.getAuctionStatus(auctionId);
    const bidHistory = await this.redisService.getBidHistory(auctionId);

    if (status !== "SOLD_PENDING") {
      return {
        error: "You must Hit HAMMER (Mark Sold) before confirming",
      };
    }

    if (!player) {
      throw new NotFoundException("No current player to confirm sale for");
    }

    if (!lastBid || !lastBid.teamId) {
      throw new Error("Cannot confirm sale without a valid bid");
    }

    const soldPrice = Number(lastBid.amount);
    const winningTeamId = lastBid.teamId;

    // 2. DB Transaction
    const result = await this.prisma.prisma.$transaction(async (tx) => {
      const team = await tx.team.findUnique({
        where: { id: winningTeamId },
        include: { auction: true },
      });

      if (!team) throw new Error("Winning team not found");

      // Max players validation
      if (team.playersCount >= team.auction.maxPlayersPerTeam) {
        throw new Error(
          `Team ${team.name} already has max players (${team.auction.maxPlayersPerTeam})`,
        );
      }

      // Deduct team money + increment players
      const updatedTeam = await tx.team.update({
        where: { id: winningTeamId },
        data: {
          purseSpent: { increment: soldPrice },
          playersCount: { increment: 1 },
        },
      });

      // Mark player SOLD
      await tx.player.update({
        where: { id: player.id },
        data: {
          status: "SOLD",
          soldPrice,
          teamId: winningTeamId,
        },
      });

      // Save bid history
      await tx.bidHistory.create({
        data: {
          amount: soldPrice,
          timestamp: new Date(),
          auctionId,
          playerId: player.id,
          teamId: winningTeamId,
        },
      });

      return {
        team: updatedTeam,
        auction: team.auction,
      };
    });
    // ========================
    // 3. REDIS META UPDATE
    // ========================
    const teamMeta = await this.redisService.getTeam(auctionId, winningTeamId);

    if (!teamMeta) {
      throw new Error("Redis team meta not found");
    }

    const minPlayers = Number(teamMeta.minPlayers);
    const minBid = Number(teamMeta.baseBid);

    let playersBought = Number(teamMeta.playersBought || 0) + 1;
    let purse = Number(teamMeta.purse); // Lua already deducted bid

    // ========================
    // 4. BOOSTER LOGIC
    // ========================
    const settings = await this.redisService.getSettings(auctionId);

    if (
      settings?.isBoosterEnabled &&
      Number(settings.boosterTriggerPlayerCount) > 0 &&
      Number(settings.boosterAmount) > 0
    ) {
      const trigger = Number(settings.boosterTriggerPlayerCount);

      if (playersBought % trigger === 0) {
        purse += Number(settings.boosterAmount);

        console.log(
          `🚀 BOOSTER APPLIED: Team ${teamMeta.name} +${settings.boosterAmount}`,
        );

        // Sync booster to DB
        await this.prisma.prisma.team.update({
          where: { id: winningTeamId },
          data: {
            purseSpent: {
              decrement: Number(settings.boosterAmount),
            },
          },
        });

        teamMeta.boostersUsed = Number(teamMeta.boostersUsed || 0) + 1;
      }
    }

    // ========================
    // 5. RESERVE + MAX BID
    // ========================
    const reservableSlots = Math.max(minPlayers - playersBought - 1, 0);
    const reserved = reservableSlots * minBid;
    const maxAllowedBid = purse - reserved;

    const updatedTeamMeta = {
      ...teamMeta,
      purse,
      playersBought,
      reserved,
      maxAllowedBid,
    };

    await this.redisService.setTeam(auctionId, winningTeamId, updatedTeamMeta);

    // 3. Cleanup Redis

    await this.redisService.removePlayerFromUnsold(auctionId, player.id);
    await this.redisService.deductBudget(auctionId, winningTeamId, soldPrice);
    await this.redisService.incrementPlayersBought(auctionId, winningTeamId);
    await this.redisService.setAuctionStatus(auctionId, "WAITING");

    return {
      teamName: result.team.name,
      teamId: winningTeamId,
      playerName: player.name,
      category: player.category?.name,
      amount: soldPrice,
      remainingPurse: purse,
      boosterApplied:
        Number(teamMeta.boostersUsed || 0) <
        Number(updatedTeamMeta.boostersUsed || 0),
      playersBought,
      reserved,
      maxAllowedBid,
    };
  }

  async reauctionUnsold(auctionId: string) {
    // 1. Fetch UNSOLD players from DB
    const unsoldPlayers = await this.prisma.player.findMany({
      where: { auctionId, status: "UNSOLD" },
      include: { category: true },
    });

    if (unsoldPlayers.length === 0) {
      return { count: 0, message: "No unsold players found" };
    }

    // 2. Reset Status in DB
    await this.prisma.player.updateMany({
      where: { auctionId, status: "UNSOLD" },
      data: { status: "UPCOMING" },
    });

    // 3. Push to Redis Queue
    // We map them to the same JSON structure as Init
    const redisPlayers = unsoldPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      profilePic: p.profilePic,
      role: p.role,
      basePrice: Number(p.basePrice || 0),
      // ... map other fields same as Init ...
      category: p.category
        ? { name: p.category.name, color: p.category.color }
        : null,
    }));

    // We use a helper in Redis Service to push them
    await this.redisService.addPlayersToQueue(auctionId, redisPlayers);

    return {
      count: unsoldPlayers.length,
      message: `${unsoldPlayers.length} players moved back to Upcoming queue`,
      players: redisPlayers,
    };
  }

  // ============================================
  // 📡 GET CURRENT STATE (For new connections)
  // ============================================
  async getCurrentState(auctionId: string) {
    // =========================
    // LIVE STATE FROM REDIS
    // =========================
    const status = await this.redisService.getAuctionStatus(auctionId);
    const currentPlayer = await this.redisService.getCurrentPlayer(auctionId);
    const lastBid = await this.redisService.getLastBid(auctionId);
    const bidHistory = await this.redisService.getBidHistory(auctionId);
    const categories = await this.redisService.getCategories(auctionId);

    // ---------------------------------------
    // LOAD TEAMS FROM REDIS (NOT DATABASE)
    // ---------------------------------------
    const teams = await this.redisService.getAllTeams(auctionId);

    // =========================
    // PLAYER COUNTS PER TEAM
    // =========================
    const teamPlayerCounts = await this.prisma.prisma.player.groupBy({
      by: ["teamId"],
      where: {
        auctionId,
        status: "SOLD",
        teamId: { not: null },
      },
      _count: {
        teamId: true,
      },
    });

    const teamCountMap = new Map<string, number>();
    for (const row of teamPlayerCounts) {
      teamCountMap.set(row.teamId!, row._count.teamId);
    }

    // =========================
    // GLOBAL PLAYER STATS
    // =========================
    const [totalPlayers, sold, unsold, upcoming] = await Promise.all([
      this.prisma.prisma.player.count({ where: { auctionId } }),
      this.prisma.prisma.player.count({ where: { auctionId, status: "SOLD" } }),
      this.prisma.prisma.player.count({
        where: { auctionId, status: "UNSOLD" },
      }),
      this.prisma.prisma.player.count({
        where: { auctionId, status: "UPCOMING" },
      }),
    ]);

    // =========================
    // RETURN STATE
    // =========================
    return {
      status,
      currentPlayer,
      lastBid,
      categories,
      bidHistory,

      teams: teams.map((t) => ({
        id: t.id,
        name: t.name,
        purse: t.purse,
        playersCount: teamCountMap.get(t.id) || t.playersCount || 0,
        reservedAmount: t.reserved,
        maxAllowedPlayers: t.maxAllowedBid,
        boostersUsed: t.boostersUsed,
      })),

      stats: {
        totalPlayers,
        sold,
        unsold,
        upcoming,
      },
    };
  }

  async buildDashboardSnapshot(auctionId: string) {
    const [players, teams, categories] = await Promise.all([
      this.prisma.prisma.player.findMany({
        where: { auctionId },
        select: {
          id: true,
          auctionId: true,
          name: true,
          age: true,
          profilePic: true,
          role: true,
          battingStyle: true,
          bowlingStyle: true,
          basePrice: true,
          soldPrice: true,
          status: true,
          team: {
            select: { name: true },
          },
        },
      }),

      this.prisma.prisma.team.findMany({
        where: { auctionId },
        select: {
          id: true,
          name: true,
          logo: true,
          shortName: true,
          playersCount: true,
          purseSpent: true,
          originalPurse: true,
        },
      }),

      this.prisma.prisma.category.findMany({
        where: { auctionId },
      }),
    ]);

    const snapshot = {
      auctionId,
      players: {
        sold: players.filter((p) => p.status === "SOLD"),
        unsold: players.filter((p) => p.status === "UNSOLD"),
        upcoming: players.filter((p) => p.status === "UPCOMING"),
      },
      teams,
      categories,
    };

    await this.redisService.setDashboardSnapshot(auctionId, snapshot);

    return snapshot;
  }

  async findUserTeam(auctionId: string, teamId: string) {
    return this.prisma.prisma.team.findFirst({
      where: {
        id: teamId,
        auctionId: auctionId,
      },
    });
  }

  private calculateNextBid(price: number, settings: any) {
    let increment = Number(settings.bidIncrease) || 1000;

    if (Array.isArray(settings.bidRules)) {
      const sorted = [...settings.bidRules].sort(
        (a, b) => b.threshold - a.threshold,
      );

      for (const rule of sorted) {
        if (price >= rule.threshold) {
          increment = rule.increment;
          break;
        }
      }
    }

    return Number(price) + Number(increment);
  }
  async markPlayerUnsoldRedisOnly(auctionId: string) {
    const player = await this.redisService.getCurrentPlayer(auctionId);
    if (!player) throw new Error("No player");

    // Push to unsold pool
    await this.redisService.addToUnsoldPool(auctionId, player);

    // Reset auction state
    await this.redisService.setAuctionStatus(auctionId, "WAITING");

    return player;
  }

  async placeBid(auctionId: string, teamId: string, inputAmount?: number) {
    // inputAmount is optional
    const settings = await this.redisService.getSettings(auctionId);
    const lastBid = await this.redisService.getLastBid(auctionId);
    const team = await this.redisService.getTeamMeta(auctionId, teamId);

    // 1. Fetch Current Player to check Base Price
    const currentPlayer = await this.redisService.getCurrentPlayer(auctionId);
    if (!currentPlayer) throw new Error("No player on auction block");

    if (!team) throw new Error("Team not found in auction cache");

    let amountToBid = 0;

    // 2. LOGIC: Determine the Bid Amount
    if (lastBid) {
      // A. If bidding is ongoing, calculate next increment
      amountToBid = this.calculateNextBid(Number(lastBid.amount), settings);
    } else {
      // B. If this is the FIRST BID, start at Player's Base Price
      // (Or use settings.minBid if basePrice is missing, but prefer Base Price)
      const basePrice =
        Number(currentPlayer.basePrice) || Number(settings.minBid);
      amountToBid = basePrice;
    }

    // 3. Allow manual override (if Organizer typed a specific amount)
    // If frontend sent an amount, use it (provided it's valid)
    if (inputAmount && inputAmount > amountToBid) {
      amountToBid = inputAmount;
    }

    // 4. Send to Redis
    const result: any = await this.redisService.atomicPlaceBid(
      auctionId,
      teamId,
      amountToBid, // <--- Using the corrected variable
    );

    if (result && result.err) {
      if (result.err === "SELF_BIDDING") {
        throw new Error("You already hold the highest bid!");
      }
      if (result.err === "BELOW_BASE_PRICE") {
        console.error("🚨 DEBUGGING BID FAILURE 🚨");
        console.error(`👉 Calculated Bid: ${amountToBid}`);
        console.error(`👉 Redis Has Base: ${result.debugBase}`);
        throw new Error(
          `BELOW_BASE_PRICE: Bid ${amountToBid} < Base ${result.debugBase}`,
        );
      }
      throw new Error(result.err);
    }

    return {
      success: true,
      currentBid: { teamId, amount: amountToBid }, // Return what we actually bid

      nextBid: this.calculateNextBid(amountToBid, settings),
    };
  }

  // ==========================================
  // 🔚 END AUCTION LOGIC (PRODUCTION SAFE)
  // ==========================================
  async endAuction(
    auctionId: string,
    userId: string, // pass from Gateway (organizer socket)
    force: boolean = false,
  ) {
    // ==============================
    // 1. AUTHORIZATION CHECK
    // ==============================
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
      select: {
        id: true,
        organizerId: true,
        status: true,
      },
    });

    if (!auction) {
      throw new NotFoundException("Auction not found");
    }

    if (auction.organizerId !== userId) {
      throw new UnauthorizedException("Only organizer can end auction");
    }

    if (auction.status === "COMPLETED") {
      return {
        status: "ALREADY_COMPLETED",
        message: "Auction is already completed",
      };
    }

    // ==============================
    // 2. SAFETY: BLOCK END DURING SOLD_PENDING
    // ==============================
    const redisStatus = await this.redisService.getAuctionStatus(auctionId);

    if (redisStatus === "SOLD_PENDING" && !force) {
      return {
        status: "BLOCKED",
        message:
          "A player is marked SOLD but not confirmed. Please confirm or undo before ending auction.",
      };
    }

    // ==============================
    // 3. COUNT REMAINING PLAYERS
    // ==============================
    // DB = Source of Truth
    const [upcomingCount, unsoldCount] = await Promise.all([
      this.prisma.prisma.player.count({
        where: { auctionId, status: "UPCOMING" },
      }),
      this.prisma.prisma.player.count({
        where: { auctionId, status: "UNSOLD" },
      }),
    ]);

    // Redis unsold count (live truth)
    const redisUnsold =
      (await this.redisService.getUnsoldCount(auctionId)) || 0;

    // ==============================
    // 4. WARNING MODE (NON-FORCE)
    // ==============================
    if (!force && (upcomingCount > 0 || redisUnsold > 0)) {
      return {
        status: "WARNING",
        message: "Auction still has players remaining. Confirm to force end.",
        stats: {
          upcomingDB: upcomingCount,
          unsoldDB: unsoldCount,
          unsoldRedis: redisUnsold,
        },
      };
    }

    // ==============================
    // 5. FINALIZE AUCTION (TRANSACTION)
    // ==============================
    await this.prisma.prisma.$transaction(async (tx) => {
      // A. Mark auction completed
      await tx.auction.update({
        where: { id: auctionId },
        data: {
          status: "COMPLETED",
          ArchivedAt: new Date(),
        },
      });

      // B. Mark leftover UPCOMING players as UNSOLD
      await tx.player.updateMany({
        where: {
          auctionId,
          status: "UPCOMING",
        },
        data: {
          status: "UNSOLD",
        },
      });

      // C. Audit Log (Optional but SaaS-grade)
      try {
        await tx.auditLog.create({
          data: {
            userId: userId,
            action: "END_AUCTION",
            endpoint: "ws/end_auction",
            details: {
              auctionId,
              force,
              remaining: {
                upcomingDB: upcomingCount,
                unsoldRedis: redisUnsold,
              },
            },
          },
        });
        await this.commitUnsoldToDB(auctionId);
      } catch (e: any) {
        // Don't fail auction for logging errors
        console.warn("⚠️ Audit log failed:", e.message);
      }
    });

    // ==============================
    // 6. REDIS CLEANUP (ANTI-GHOST BIDDING)
    // ==============================
    const baseKey = `auction:${auctionId}`;

    await this.redisService.finalizeAuction(auctionId);

    // ==============================
    // 7. RETURN FINAL SUMMARY
    // ==============================
    const soldCount = await this.prisma.prisma.player.count({
      where: {
        auctionId,
        status: "SOLD",
      },
    });
    const result = await this.generateAuctionInsights(auctionId);

    return {
      status: "COMPLETED",
      message: "Auction successfully ended and archived",
      summary: {
        soldPlayers: soldCount,
        unsoldPlayers: upcomingCount + unsoldCount,
        forced: force,
        result: result,
      },
    };
  }

  async getNextBidAmount(auctionId: string) {
    const lastBid = await this.redisService.getLastBid(auctionId);

    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
      select: { minBid: true, bidIncrease: true, bidRules: true },
    });

    if (!auction) return 0;

    if (!lastBid) return Number(auction.minBid);

    const inc = this.redisService.getNextIncrement(
      Number(lastBid.amount),
      auction.bidIncrease,
      auction.bidRules,
    );

    return Number(lastBid.amount) + inc;
  }

  async commitUnsoldToDB(auctionId: string) {
    const players = await this.redisService.getUnsoldPool(auctionId);

    const ids = players.map((p) => p.id);

    if (ids.length === 0) return;

    await this.prisma.prisma.player.updateMany({
      where: { id: { in: ids } },
      data: { status: "UNSOLD" },
    });

    await this.redisService.clearUnsoldPool(auctionId);
  }

  async patchSnapshot(
    auctionId: string,
    patch: {
      type:
        | "PLAYER_SOLD"
        | "PLAYER_UNSOLD"
        | "PLAYER_REAUCTION"
        | "TEAM_UPDATE";
      payload: any;
    },
  ) {
    const snap = await this.redisService.getDashboardSnapshot(auctionId);
    if (!snap) return;

    const removeFromAllLists = (id: string) => {
      snap.players.sold = snap.players.sold.filter((p: any) => p.id !== id);

      snap.players.unsold = snap.players.unsold.filter((p: any) => p.id !== id);

      snap.players.upcoming = snap.players.upcoming.filter(
        (p: any) => p.id !== id,
      );
    };

    switch (patch.type) {
      // ===============================
      // PLAYER SOLD
      // ===============================
      case "PLAYER_SOLD": {
        const p = patch.payload;

        removeFromAllLists(p.id);

        snap.players.sold.push({
          id: p.id,
          auctionId: auctionId,
          name: p.name,
          age: p.age,
          profilePic: p.profilePic,
          role: p.role,
          battingStyle: p.battingStyle,
          bowlingStyle: p.bowlingStyle,
          soldPrice: p.soldPrice,
          status: "SOLD",
          teamName: p.teamName,
        });

        break;
      }

      // ===============================
      // PLAYER UNSOLD
      // ===============================
      case "PLAYER_UNSOLD": {
        const p = patch.payload;

        removeFromAllLists(p.id);

        snap.players.unsold.push({
          ...p,
          status: "UNSOLD",
        });

        break;
      }

      // ===============================
      // REAUCTION
      // ===============================
      case "PLAYER_REAUCTION": {
        const ids = patch.payload.ids;

        const moving = snap.players.unsold.filter((p: any) =>
          ids.includes(p.id),
        );

        snap.players.unsold = snap.players.unsold.filter(
          (p: any) => !ids.includes(p.id),
        );

        snap.players.upcoming.push(...moving);

        break;
      }

      // ===============================
      // TEAM UPDATE
      // ===============================
      case "TEAM_UPDATE": {
        snap.teams = snap.teams.map((t: any) =>
          t.id === patch.payload.id
            ? {
                ...t,
                playersCount: patch.payload.playersCount ?? t.playersCount,
                purse: patch.payload.purse ?? t.purse,
              }
            : t,
        );
        break;
      }
    }

    await this.redisService.setDashboardSnapshot(auctionId, snap);
  }

  // async updateSnapshotAfterSale(auctionId: string) {
  //   const snap = await this.redisService.getDashboardSnapshot(auctionId);
  //   if (!snap) return;

  //   const player = await this.prisma.prisma.player.findFirst({
  //     where: { auctionId, status: "SOLD" },

  //     include: { category: true, team: true },
  //   });

  //   snap.players.sold.push(player);

  //   await this.redisService.setDashboardSnapshot(auctionId, snap);
  // }

  async generateAuctionInsights(auctionId: string) {
    // ===============================
    // FETCH DATA IN PARALLEL
    // ===============================
    const [players, teams, bids] = await Promise.all([
      this.prisma.player.findMany({
        where: { auctionId },
        include: { team: true, category: true },
      }),

      this.prisma.team.findMany({
        where: { auctionId },
      }),

      this.prisma.bidHistory.findMany({
        where: { auctionId },
      }),
    ]);

    const soldPlayers = players.filter((p) => p.status === "SOLD");

    // ===============================
    // GLOBAL METRICS
    // ===============================
    const totalRevenue = soldPlayers.reduce(
      (sum, p) => sum + Number(p.soldPrice || 0),
      0,
    );

    const mostExpensive =
      soldPlayers.sort(
        (a, b) => Number(b.soldPrice) - Number(a.soldPrice),
      )[0] || null;

    const averagePrice =
      soldPlayers.length > 0 ? totalRevenue / soldPlayers.length : 0;

    // MOST AGGRESSIVE TEAM (most bids)
    const bidCountMap: Record<string, number> = {};
    bids.forEach((b) => {
      bidCountMap[b.teamId] = (bidCountMap[b.teamId] || 0) + 1;
    });

    const mostAggressiveTeamId = Object.keys(bidCountMap).sort(
      (a, b) => (bidCountMap[b] ?? 0) - (bidCountMap[a] ?? 0),
    )[0];

    // ===============================
    // TEAM INSIGHTS
    // ===============================
    const teamInsights = teams.map((team) => {
      const bought = soldPlayers.filter((p) => p.teamId === team.id);

      return {
        teamId: team.id,
        name: team.name,
        spent: Number(team.purseSpent),
        playersBought: team.playersCount,
        highestBuy:
          bought.sort((a, b) => Number(b.soldPrice) - Number(a.soldPrice))[0] ||
          null,
      };
    });

    // ===============================
    // CATEGORY INSIGHTS
    // ===============================
    const categoryMap: Record<string, any[]> = {};

    soldPlayers.forEach((p) => {
      const cat = p.category?.name || "UNCATEGORIZED";

      if (!categoryMap[cat]) categoryMap[cat] = [];

      categoryMap[cat].push(p);
    });

    const categoryInsights = Object.entries(categoryMap).map(
      ([category, list]) => ({
        category,
        highest: list.sort(
          (a: any, b: any) => Number(b.soldPrice) - Number(a.soldPrice),
        )[0],
      }),
    );

    // ===============================
    // FINAL OBJECT
    // ===============================
    const insight = {
      summary: {
        totalRevenue,
        playersSold: soldPlayers.length,
        unsold: players.filter((p) => p.status === "UNSOLD").length,
        averagePrice,
        mostExpensive,
        mostAggressiveTeam: teams.find((t) => t.id === mostAggressiveTeamId),
      },

      teams: teamInsights,
      categories: categoryInsights,
    };

    // ===============================
    // SAVE (UPSERT)
    // ===============================
    await this.prisma.auctionInsight.upsert({
      where: { auctionId },
      update: { data: insight },
      create: {
        auctionId,
        data: insight,
      },
    });

    return insight;
  }
}
