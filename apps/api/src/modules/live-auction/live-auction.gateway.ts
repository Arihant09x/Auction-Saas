import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { LiveAuctionService } from "./live-auction.service"; // We will update this next
import { UseFilters } from "@nestjs/common";
import { WsExceptionFilter } from "../../common/filters/ws-exception.filter";
import { PrismaService } from "../../prisma/prisma.service";
import { LiveAuctionRedisService } from "./live-auction.redis.service";
import { performance } from "perf_hooks";
import { captureError } from "../../common/monitoring/sentry";

// Note: WebSocket Guards need a different implementation,
// for now we'll validate Token inside handleConnection manually.

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "/live-auction",
  perMessageDeflate: {
    threshold: 1024, // Compress packets larger than 1KB
  },
})
@UseFilters(WsExceptionFilter)
export class LiveAuctionGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly liveAuctionService: LiveAuctionService,
    private readonly redisService: LiveAuctionRedisService,
    private readonly prisma: PrismaService, // Inject Prisma for ownership check
  ) { }
  private async requireOrganizer(client: Socket, auctionId: string) {
    if (!client.data?.user) {
      throw new Error("Not authenticated");
    }

    if (client.data.auctionId !== auctionId) {
      throw new Error("Socket not joined to this auction");
    }

    // ADMIN is read-only: they can observe but cannot perform mutations
    if (client.data.user.role === "ADMIN") {
      throw new Error(
        "ADMIN_READ_ONLY: Admin can monitor live auctions but cannot perform organizer actions",
      );
    }

    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
      select: { organizerId: true },
    });

    if (!auction) {
      throw new Error("Auction not found");
    }

    if (auction.organizerId !== client.data.user.id) {
      throw new Error("Only auction organizer can perform this action");
    }

    return client.data.user;
  }
  private snapshotTimers = new Map<string, NodeJS.Timeout>();

  private async pushSnapshot(auctionId: string) {
    if (this.snapshotTimers.has(auctionId)) {
      return; // Snapshot push already scheduled
    }
    const timer = setTimeout(async () => {
      this.snapshotTimers.delete(auctionId);
      try {
        const snap = await this.redisService.getDashboardSnapshot(auctionId);
        if (snap) {
          this.server.to(`auction:${auctionId}`).emit("dashboard_snapshot", snap);
        }
      } catch (err) {
        console.error("Error debouncing pushSnapshot:", err);
      }
    }, 300); // 300ms debounce
    this.snapshotTimers.set(auctionId, timer);
  }

  private async executeWithLogging<T>(
    eventName: string,
    client: Socket,
    action: () => Promise<T>,
  ): Promise<any> {
    const start = performance.now();

    const runAction = async () => {
      try {
        const result = await action();
        const duration = performance.now() - start;
        if (duration > 50) {
          console.warn(
            `⚠️ [WS WARN] Event "${eventName}" took ${duration.toFixed(2)}ms to process (Client: ${client.id})`,
          );
        } else {
          console.log(
            `⏱️ [WS LOG] Event "${eventName}" processed in ${duration.toFixed(2)}ms (Client: ${client.id})`,
          );
        }
        return { success: true, data: result };
      } catch (err: any) {
        const duration = performance.now() - start;
        console.error(
          `❌ [WS ERROR] Event "${eventName}" failed in ${duration.toFixed(2)}ms (Client: ${client.id}). Error: ${err.message}`,
        );
        captureError(err, { eventName, socketId: client.id });
        client.emit("error", err.message);
        return { success: false, error: err.message };
      }
    };

    try {
      const nr = require('newrelic');
      return await nr.startWebTransaction(`websocket:${eventName}`, runAction);
    } catch {
      return await runAction();
    }
  }

  //middleware to verify organizer
  afterInit(server: Server) {
    server.use(async (socket, next) => {
      try {
        const token =
          socket.handshake.auth?.token || socket.handshake.query?.token;

        const auctionId =
          socket.handshake.auth?.auctionId || socket.handshake.query?.auctionId;

        if (!token || !auctionId) {
          return next(new Error("Missing auth"));
        }

        // PUBLIC VIEW MODE
        if (token === "VIEWER") {
          socket.data.viewer = true;
          socket.data.auctionId = auctionId;
          return next();
        }

        // VERIFY USER
        const user = await this.liveAuctionService.verifySocketToken(token);
        if (!user) {
          return next(new Error("Unauthorized"));
        }

        // ATTACH TO SOCKET (PERSISTS ACROSS UPGRADE)
        socket.data.user = user;
        socket.data.auctionId = auctionId;

        next();
      } catch (err) {
        next(new Error("Auth failed"));
      }
    });
  }

  // 1. ORGANIZER: SELECT PLAYER
  // ==================================================
  @SubscribeMessage("select_player")
  async handleSelectPlayer(
    @MessageBody()
    data: {
      auctionId: string;
      mode: "SEQUENCE" | "RANDOM" | "MANUAL";
      categoryId?: string;
      playerNo?: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("select_player", client, async () => {
      await this.requireOrganizer(client, data.auctionId);
      ("✅ Organizer verified. Selecting next player...");
      const status = await this.redisService.getAuctionStatus(data.auctionId);

      if (status === "BIDDING") {
        throw new Error("Finish current player (Sell or Unsold) before selecting next");
      }

      if (status === "SOLD_PENDING") {
        throw new Error("Confirm or reopen previous player first");
      }
      const auction = await this.prisma.prisma.auction.findUnique({
        where: { id: data.auctionId },
      });
      if (!auction) {
        throw new Error("Auction not found");
      }
      // 2. Find the Player
      const player = await this.liveAuctionService.selectPlayer(
        data.auctionId,
        data.mode,
        data.categoryId,
        data.playerNo,
      );

      if (!player) {
        throw new Error("No player found matching criteria");
      }
      await this.redisService.setCurrentPlayer(data.auctionId, player);

      const lastBid = await this.redisService.getLastBid(data.auctionId);
      const bidHistory = await this.redisService.getBidHistory(data.auctionId);
      const currentAuctionBid = lastBid
        ? Number(lastBid.amount)
        : Number(auction.minBid);

      // 3. Broadcast to EVERYONE (Organizer + Bidders)
      this.server.to(`auction:${data.auctionId}`).emit("new_player_revealed", {
        player: {
          id: player.id,
          name: player.name,
          role: player.role,
          category: player.category,
          profilePic: player.profilePic,
          battingStyle: player.battingStyle,
          bowlingStyle: player.bowlingStyle,
          age: player.age,
          basePrice: player.basePrice,
          details: player.details,
          status: player.status || "NULL",
        },
        status: "BIDDING", // Auto-start bidding? Or wait for START_TIMER?
        currentBid: currentAuctionBid,
        bidHistory,
      });

      // Emit delta state update
      const state = await this.liveAuctionService.getCurrentState(data.auctionId, false);
      this.server.to(`auction:${data.auctionId}`).emit("auction_state_update", state);

      return { player, currentBid: currentAuctionBid };
    });
  }

  // 2. ORGANIZER: HAMMER DOWN (Soft Sold)
  // ==================================================
  @SubscribeMessage("mark_sold")
  async handleMarkSold(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("mark_sold", client, async () => {
      await this.requireOrganizer(client, data.auctionId);
      await this.redisService.setAuctionStatus(data.auctionId, "SOLD_PENDING");

      this.server.to(`auction:${data.auctionId}`).emit("player_sold_pending", {
        message: "SOLD! (Waiting for Confirmation...)",
      });

      const state = await this.liveAuctionService.getCurrentState(data.auctionId, false);
      this.server.to(`auction:${data.auctionId}`).emit("auction_state_update", state);

      return { status: "SOLD_PENDING" };
    });
  }

  @SubscribeMessage("mark_unsold")
  async handleUnsold(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("mark_unsold", client, async () => {
      await this.requireOrganizer(client, data.auctionId);

      const player = await this.redisService.getCurrentPlayer(data.auctionId);

      if (!player) {
        throw new Error("No active player");
      }

      // Return player to unsold queue
      // ⭐ Move to UNSOLD POOL (NEW LOGIC)
      await this.redisService.addToUnsoldPool(data.auctionId, player);
      await this.liveAuctionService.patchSnapshot(data.auctionId, {
        type: "PLAYER_UNSOLD",
        payload: player,
      });

      player.status = "UNSOLD";
      await this.redisService.setCurrentPlayer(data.auctionId, player);
      await this.redisService.setAuctionStatus(data.auctionId, "WAITING");

      // Update Redis stats (upcoming -> unsold)
      await this.redisService.adjustStats(data.auctionId, { unsold: 1, upcoming: -1 });

      this.server
        .to(`auction:${data.auctionId}`)
        .emit("player_unsold_patch", player);

      this.server
        .to(`auction:${data.auctionId}`)
        .emit("player_unsold_confirmed", {
          playerId: player.id,
          playerName: player.name,
        });

      // Refresh state UI (delta update)
      const state = await this.liveAuctionService.getCurrentState(data.auctionId, false);
      this.server
        .to(`auction:${data.auctionId}`)
        .emit("auction_state_update", state);

      return { player };
    });
  }

  @SubscribeMessage("apply_booster")
  async handleApplyBooster(
    @MessageBody() data: { auctionId: string; teamId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("apply_booster", client, async () => {
      await this.requireOrganizer(client, data.auctionId);
      const result = await this.liveAuctionService.applyBooster(
        data.auctionId,
        data.teamId,
      );

      const state = await this.liveAuctionService.getCurrentState(data.auctionId, false);
      this.server.to(`auction:${data.auctionId}`).emit("auction_state_update", state);
      this.server.to(`auction:${data.auctionId}`).emit("notification", {
        message: `Booster applied to team ${result.teamName}!`,
      });

      return result;
    });
  }

  @SubscribeMessage("assign_unsold_to_team")
  async handleAssignUnsoldToTeam(
    @MessageBody() data: { auctionId: string; playerId: string; teamId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("assign_unsold_to_team", client, async () => {
      await this.requireOrganizer(client, data.auctionId);
      const result = await this.liveAuctionService.assignUnsoldToTeam(
        data.auctionId,
        data.playerId,
        data.teamId,
      );

      if ((result as any).error) {
        throw new Error((result as any).error);
      }

      this.server.to(`auction:${data.auctionId}`).emit("player_sold_confirmed", {
        teamName: result.teamName,
        playerName: result.playerName,
        category: result.category,
        soldTo: result.teamName,
        amount: result.amount,
        remainingPurse: result.remainingPurse,
        boosterApplied: false,
      });

      await this.liveAuctionService.patchSnapshot(data.auctionId, {
        type: "PLAYER_SOLD",
        payload: result.soldPlayer,
      });
      await this.liveAuctionService.patchSnapshot(data.auctionId, {
        type: "TEAM_UPDATE",
        payload: {
          id: data.teamId,
          playersCount: result.playersBought,
          purseSpent: result.team.purseSpent,
          purse: result.remainingPurse,
        },
      });

      this.server.to(`auction:${data.auctionId}`).emit("player_sold_patch", result.soldPlayer);
      this.server.to(`auction:${data.auctionId}`).emit("team_updated_patch", {
        id: data.teamId,
        purse: result.remainingPurse,
        playersCount: result.playersBought,
        purseSpent: result.team.purseSpent,
      });

      const state = await this.liveAuctionService.getCurrentState(data.auctionId, false);
      this.server.to(`auction:${data.auctionId}`).emit("auction_state_update", state);

      return result;
    });
  }

  // 3. ORGANIZER: RE-OPEN (Oops, someone bid late!)
  // ==================================================
  @SubscribeMessage("reopen_bidding")
  async handleReopen(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("reopen_bidding", client, async () => {
      await this.requireOrganizer(client, data.auctionId);
      await this.redisService.setAuctionStatus(data.auctionId, "BIDDING");

      this.server.to(`auction:${data.auctionId}`).emit("bidding_resumed", {
        message: "Bidding Re-opened! Continue from last bid.",
      });

      const state = await this.liveAuctionService.getCurrentState(data.auctionId, false);
      this.server.to(`auction:${data.auctionId}`).emit("auction_state_update", state);

      return { status: "BIDDING" };
    });
  }

  // ==================================================
  // 4. ORGANIZER: CONFIRM (Hard Sold)
  // ==================================================
  @SubscribeMessage("confirm_sold")
  async handleConfirmSold(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("confirm_sold", client, async () => {
      await this.requireOrganizer(client, data.auctionId);
      const result = await this.liveAuctionService.confirmSale(data.auctionId);

      if ((result as any)?.error) {
        throw new Error((result as any).error);
      }

      const auctionId = data.auctionId;

      this.server.to(`auction:${auctionId}`).emit("player_sold_confirmed", {
        teamName: result.teamName,
        playerName: result.playerName,
        category: result.category,
        soldTo: result.teamName,
        amount: result.amount,
        remainingPurse: result.remainingPurse,
        boosterApplied: result.boosterApplied,
      });

      const player = await this.redisService.getCurrentPlayer(auctionId);
      await this.liveAuctionService.patchSnapshot(auctionId, {
        type: "PLAYER_SOLD",
        payload: {
          id: player.id,
          name: player.name,
          age: player.age,
          profilePic: player.profilePic,
          role: player.role,
          battingStyle: player.battingStyle,
          bowlingStyle: player.bowlingStyle,
          soldPrice: result.amount,
          teamName: result.teamName,
        },
      });
      await this.liveAuctionService.patchSnapshot(auctionId, {
        type: "TEAM_UPDATE",
        payload: {
          id: result.teamId || result.teamName,
          playersCount: result.playersBought,
          purseSpent: result.purseSpent,
          purse: result.remainingPurse,
        },
      });

      const soldPlayer = {
        id: player.id,
        name: player.name,
        age: player.age,
        profilePic: player.profilePic,
        role: player.role,
        battingStyle: player.battingStyle,
        bowlingStyle: player.bowlingStyle,
        soldPrice: result.amount,
        teamName: result.teamName,
        status: "SOLD",
      };

      this.server
        .to(`auction:${auctionId}`)
        .emit("player_sold_patch", soldPlayer);

      this.server.to(`auction:${auctionId}`).emit("team_updated_patch", {
        id: result.teamId,
        purse: result.remainingPurse,
        playersCount: result.playersBought,
        purseSpent: result.purseSpent,
      });

      const state = await this.liveAuctionService.getCurrentState(auctionId, false);
      this.server
        .to(`auction:${auctionId}`)
        .emit("auction_state_update", state);

      return result;
    });
  }

  // 5. CONNECTION HANDLER
  async handleConnection(client: Socket) {
    try {
      const auctionId =
        (client.handshake.query.auctionId as string) ||
        (client.handshake.auth.auctionId as string);

      if (!auctionId) {
        client.disconnect();
        throw new Error("invalid_connection");
      }

      client.join(`auction:${auctionId}`);
      client.data.auctionId = auctionId;

      // Increment active connection count in Redis
      const activeConnections = await this.redisService.incrementConnectionCount(auctionId);
      (`📡 [WS MONITOR] Client connected: ${client.id} (Auction: ${auctionId}). Active connections: ${activeConnections}`);

      // ── Fetch shared snapshot once ─────────────────────────────────────
      let snap = await this.redisService.getDashboardSnapshot(auctionId);

      if (client.data.viewer) {
        (`Viewer ${client.id} joined Auction ${auctionId}`);
        if (!snap) {
          snap =
            await this.liveAuctionService.buildDashboardSnapshot(auctionId);
          await this.redisService.setDashboardSnapshot(auctionId, snap);
        }
        client.emit("snapshot_sync", snap);
      } else {
        (`User ${client.data.user?.id || "unknown"} joined Auction ${auctionId}`);
        if (!snap) {
          snap =
            await this.liveAuctionService.buildDashboardSnapshot(auctionId);
          await this.redisService.setDashboardSnapshot(auctionId, snap);
        }
        client.emit("dashboard_snapshot", snap);
      }

      const currentPlayer = await this.redisService.getCurrentPlayer(auctionId);
      const lastBid = await this.redisService.getLastBid(auctionId);
      const bidHistory = await this.redisService.getBidHistory(auctionId);

      // Request FULL state on initial connection
      const state = await this.liveAuctionService.getCurrentState(auctionId, true);

      if (state.status === "COMPLETED") {
        const result = await this.liveAuctionService.endAuction(
          auctionId,
          client.data.user?.id || "system",
          client.data.user?.role || "USER",
          true,
        );
        this.server.to(`auction:${auctionId}`).emit("auction_ended", result);
      }

      // ── Pre-Auction Viewer Countdown ────────────────────────────────────
      // Meta is cached in Redis during initAuction.
      // If a viewer joins BEFORE init_auction (pre-start lobby), we do a
      // one-time DB fetch and cache it — all subsequent viewers hit Redis.
      if (state.status === "WAITING") {
        try {
          let auctionMeta = await this.redisService.getAuctionMeta(auctionId);

          // Lazy-cache: first viewer before init_auction triggers one DB read
          if (!auctionMeta) {
            const record = await this.prisma.prisma.auction.findUnique({
              where: { id: auctionId },
              select: { name: true, auctionDate: true, auctionStartTime: true, logo: true },
            });
            if (record?.auctionDate) {
              auctionMeta = {
                name: record.name,
                auctionDate: record.auctionDate.toISOString(),
                auctionStartTime: record.auctionStartTime ?? null,
                logo: record.logo ?? null,
              };
              // Cache so the next viewer avoids the DB entirely
              await this.redisService.setAuctionMeta(auctionId, auctionMeta);
            }
          }

          if (auctionMeta?.auctionDate) {
            console.log(`⏱️  Emitting auction_countdown to ${client.id} for auction ${auctionId}`);
            client.emit("auction_countdown", {
              auctionName: auctionMeta.name,
              scheduledDate: auctionMeta.auctionDate,
              scheduledStartTime: auctionMeta.auctionStartTime ?? null,
              logo: auctionMeta.logo ?? null,
              status: "WAITING",
            });
          }
        } catch (e) {
          console.error("Countdown emit error:", e);
        }
      }

      if (snap) {
        client.emit("dashboard_snapshot", snap);
      }

      if (state.status === "BIDDING" && state.currentPlayer) {
        await this.redisService.setAuctionStatus(auctionId, "BIDDING");
      }
      client.emit("auction_state_update", state);

      if (currentPlayer && state.status === "BIDDING") {
        const nextBid =
          await this.liveAuctionService.getNextBidAmount(auctionId);
        const Timer = await this.redisService.getBidTimer(auctionId);

        client.emit("new_player_revealed", {
          player: currentPlayer,
          currentBid: lastBid?.amount || currentPlayer.basePrice,
          lastBid,
          bidHistory,
          nextBid,
          Timer,
          status: "BIDDING",
        });
      }
    } catch (e) {
      console.error("Connection Error:", e);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const auctionId = client.data?.auctionId;
    if (auctionId) {
      const activeConnections = await this.redisService.decrementConnectionCount(auctionId);
      (`❌ Client disconnected: ${client.id} (Auction: ${auctionId}). Active connections: ${activeConnections}`);
    } else {
      (`❌ Client disconnected: ${client.id}`);
    }
  }

  // 6. ORGANIZER: INIT AUCTION
  // Triggered when Organizer opens the "Live Dashboard"
  @SubscribeMessage("init_auction")
  async handleInitAuction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("init_auction", client, async () => {
      // 1. Basic Validation
      if (!client.data?.user) {
        throw new Error("Not authenticated");
      }
      // 2. Ensure they are initializing the auction they connected to
      if (client.data.auctionId !== data.auctionId) {
        throw new Error("Auction ID mismatch");
      }

      const userdata = await this.requireOrganizer(client, data.auctionId);
      if (!userdata) {
        throw new Error("Unauthorized");
      }
      ("✅ Organizer verified. Initializing auction...");

      // A. Check if user is actually the Organizer of THIS auction
      const auction = await this.prisma.prisma.auction.findUnique({
        where: { id: data.auctionId },
        select: { organizerId: true },
      });
      if (!auction) {
        throw new Error("You are not the organizer of this auction");
      }

      ("✅ Ownership Verified. Initializing Redis...");
      const settings = await this.redisService.getSettings(data.auctionId);

      if (settings) {
        // Redis already initialized → just sync state (full state sync)
        const state = await this.liveAuctionService.getCurrentState(data.auctionId, true);
        client.emit("auction_state_update", state);
        return state;
      }
      ("🆕 First time init → loading from DB");
      const state = await this.liveAuctionService.initAuction(data.auctionId);
      await this.pushSnapshot(data.auctionId);
      // Send the current state back to the Organizer
      this.server
        .to(`auction:${data.auctionId}`)
        .emit("auction_state_update", state);
      return state;
    });
  }

  //7. BIDDER: PLACE BID
  @SubscribeMessage("place_bid")
  async handleBid(
    @MessageBody() data: { auctionId: string; teamId: string; amount: number },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("place_bid", client, async () => {
      const { auctionId, teamId, amount } = data;

      if (!client.data?.user) {
        throw new Error("Not authenticated");
      }
      if (client.data.auctionId !== auctionId) {
        throw new Error("Auction ID mismatch");
      }
      if (!teamId) throw new Error("Unauthorized");
      const budget = await this.redisService.getTeamBudget(auctionId, teamId);
      const teamMeta = await this.redisService.getTeamMeta(auctionId, teamId);

      console.log("Team Budget:", budget, "Team Meta:", teamMeta);

      if (!teamMeta) {
        throw new Error("TEAM_NOT_FOUND");
      }

      const result = await this.liveAuctionService.placeBid(
        auctionId,
        teamId,
        amount,
      );
      const remainingBudget = Number(budget) - Number(result.currentBid.amount);
      this.server.to(`auction:${auctionId}`).emit("new_bid_patch", {
        ...result,
        amount: result.currentBid.amount,
        team: teamMeta,
        teamId: teamMeta.id,
        teamName: teamMeta.name,
        remainingBudget,
        nextbid: result.nextBid,
      });

      return {
        ...result,
        remainingBudget,
      };
    });
  }

  @SubscribeMessage("reauction_unsold")
  async handleReauction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("reauction_unsold", client, async () => {
      await this.requireOrganizer(client, data.auctionId);

      const result = await this.liveAuctionService.reauctionUnsold(
        data.auctionId,
      );
      const ids = result.players?.map((p: any) => p.id) || [];

      await this.liveAuctionService.patchSnapshot(data.auctionId, {
        type: "PLAYER_REAUCTION",
        payload: { ids },
      });
      await this.pushSnapshot(data.auctionId);

      // Notify Organizer
      client.emit("notification", { message: result.message });

      // Refresh state for everyone (delta state)
      const state = await this.liveAuctionService.getCurrentState(data.auctionId, false);
      this.server
        .to(`auction:${data.auctionId}`)
        .emit("auction_state_update", state);
      this.server
        .to(`auction:${data.auctionId}`)
        .emit("players_reauctioned_patch", { ids });

      return result;
    });
  }

  @SubscribeMessage("end_auction")
  async handleEndAuction(
    client: Socket,
    payload: { auctionId: string; force?: boolean },
  ) {
    return this.executeWithLogging("end_auction", client, async () => {
      const user = client.data.user;
      if (!user) {
        throw new Error("Not authenticated");
      }

      const result = await this.liveAuctionService.endAuction(
        payload.auctionId,
        user.id,
        user.role,
        payload.force || false,
      );

      // FIX: Emit to correct room prefix "auction:auctionId"
      this.server.to(`auction:${payload.auctionId}`).emit("auction_ended", result);
      return result;
    });
  }

  @SubscribeMessage("undo_bid")
  async handleUndoBid(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    return this.executeWithLogging("undo_bid", client, async () => {
      await this.requireOrganizer(client, data.auctionId);

      // Get current player status before undoing last bid to see if they were SOLD or UNSOLD
      const player = await this.redisService.getCurrentPlayer(data.auctionId);
      if (!player) {
        throw new Error("No current player to undo action for");
      }

      const prevPlayerStatus = player.status;
      const soldPrice = Number(player.soldPrice || 0);
      const winningTeamId = player.teamId;

      const isUndoingAction = prevPlayerStatus === "SOLD" || prevPlayerStatus === "UNSOLD";
      let result: { lastBid: any } = { lastBid: null };

      if (isUndoingAction) {
        // Revert DB & Redis state if they were sold
        if (prevPlayerStatus === "SOLD" && winningTeamId) {
          try {
            const settings = await this.redisService.getSettings(data.auctionId);
            const teamMeta = await this.redisService.getTeam(data.auctionId, winningTeamId);

            let purseRevert = soldPrice;
            let boostersUsedRevert = 0;

            if (teamMeta) {
              const trigger = Number(settings?.boosterTrigger || 0);
              const boosterAmount = Number(settings?.boosterAmount || 0);
              const playersBoughtBeforeUndo = Number(teamMeta.playersBought || 0);

              if (trigger > 0 && boosterAmount > 0 && playersBoughtBeforeUndo % trigger === 0) {
                purseRevert -= boosterAmount;
                boostersUsedRevert = 1;
              }
            }

            let purseSpentDecrement = soldPrice;
            if (boostersUsedRevert > 0) {
              const boosterAmount = Number(settings?.boosterAmount || 0);
              purseSpentDecrement -= boosterAmount;
            }

            let updatedTeam: any = null;
            // 1. Database Updates inside a transaction
            await this.prisma.prisma.$transaction(async (tx: any) => {
              // Revert team spent/count
              updatedTeam = await tx.team.update({
                where: { id: winningTeamId },
                data: {
                  purseSpent: { decrement: purseSpentDecrement },
                  playersCount: { decrement: 1 },
                },
              });

              // Revert player status
              await tx.player.update({
                where: { id: player.id },
                data: {
                  status: "UPCOMING",
                  soldPrice: null,
                  teamId: null,
                },
              });

              // Delete bid history
              await tx.bidHistory.deleteMany({
                where: {
                  auctionId: data.auctionId,
                  playerId: player.id,
                  teamId: winningTeamId,
                  amount: soldPrice,
                },
              });
            });

            // 2. Redis Team Meta Revert
            if (teamMeta) {
              const minPlayers = Number(teamMeta.minPlayers);
              const minBid = Number(teamMeta.baseBid);
              const playersBought = Math.max(Number(teamMeta.playersBought || 0) - 1, 0);
              const purse = Number(teamMeta.purse) + purseRevert;
              const purseSpent = Math.max(Number(teamMeta.purseSpent || 0) - purseSpentDecrement, 0);

              const reservableSlots = Math.max(minPlayers - playersBought - 1, 0);
              const reserved = reservableSlots * minBid;
              const maxAllowedBid = purse - reserved;

              const updatedTeamMeta = {
                ...teamMeta,
                purse,
                playersBought,
                reserved,
                maxAllowedBid,
                purseSpent,
                boostersUsed: Math.max(Number(teamMeta.boostersUsed || 0) - boostersUsedRevert, 0),
              };

              await this.redisService.setTeam(data.auctionId, winningTeamId, updatedTeamMeta);

              // Emit team update patch to clients
              this.server.to(`auction:${data.auctionId}`).emit("team_updated_patch", {
                id: winningTeamId,
                purse,
                playersCount: playersBought,
                purseSpent: updatedTeam?.purseSpent || 0,
              });

              // Patch snapshot for team update (sync team budget and counts)
              await this.liveAuctionService.patchSnapshot(data.auctionId, {
                type: "TEAM_UPDATE",
                payload: {
                  id: winningTeamId,
                  playersCount: playersBought,
                  purse: purse,
                  purseSpent: updatedTeam?.purseSpent || 0,
                },
              });
            }
          } catch (err: any) {
            console.error("Failed to revert database transaction on undo:", err);
          }

          // Revert stats in Redis: decrement sold, increment upcoming
          await this.redisService.adjustStats(data.auctionId, { sold: -1, upcoming: 1 });
        } else if (prevPlayerStatus === "UNSOLD") {
          // Revert unsold pool in Redis
          await this.redisService.removePlayerFromUnsold(data.auctionId, player.id);

          const unsoldPoolKey = `auction:${data.auctionId}:unsold_pool`;
          const rawPool = await this.redisService.redis.lrange(unsoldPoolKey, 0, -1);
          const updatedPool = rawPool.filter((p: string) => JSON.parse(p).id !== player.id);
          await this.redisService.redis.del(unsoldPoolKey);
          if (updatedPool.length > 0) {
            await this.redisService.redis.rpush(unsoldPoolKey, ...updatedPool);
            await this.redisService.redis.expire(unsoldPoolKey, 24 * 3600);
          }

          // Revert stats in Redis: decrement unsold, increment upcoming
          await this.redisService.adjustStats(data.auctionId, { unsold: -1, upcoming: 1 });
        }

        // Reset current player status attributes in Redis to remove stamps
        player.status = "NULL";
        player.soldPrice = null;
        player.teamId = null;
        player.teamName = null;

        // Delete bids from Redis to completely reset bids for this player
        const baseKey = `auction:${data.auctionId}`;
        await this.redisService.redis.del(`${baseKey}:bids`, `${baseKey}:last_bid`);
        await this.redisService.redis.set(`${baseKey}:current_player`, JSON.stringify(player));

        // Set auction status back to BIDDING
        await this.redisService.setAuctionStatus(data.auctionId, "BIDDING");

        // Patch Snapshot in Redis
        await this.liveAuctionService.patchSnapshot(data.auctionId, {
          type: "PLAYER_UNDO",
          payload: player,
        });

        result = { lastBid: null };
      } else {
        // Just pop the last bid from the bid stack (BIDDING phase)
        result = await this.redisService.undoLastBid(data.auctionId);
      }

      const auction = await this.prisma.prisma.auction.findUnique({
        where: { id: data.auctionId },
        select: {
          minBid: true,
          bidIncrease: true,
          bidRules: true,
        },
      });
      if (!auction) {
        throw new Error("Auction not Found");
      }

      let nextBid = Number(player.basePrice || auction?.minBid || 500);

      if (result.lastBid) {
        const inc = this.redisService.getNextIncrement(
          Number(result.lastBid.amount),
          auction.bidIncrease,
          auction.bidRules,
        );
        nextBid = Number(result.lastBid.amount) + inc;
      }

      this.server.to(`auction:${data.auctionId}`).emit("bid_undone", {
        lastBid: result.lastBid,
        nextBid,
      });

      // Broadcast snapshot update to all clients
      await this.pushSnapshot(data.auctionId);

      // Broadcast delta update
      const state = await this.liveAuctionService.getCurrentState(data.auctionId, false);
      this.server.to(`auction:${data.auctionId}`).emit("auction_state_update", state);

      return {
        ...result,
        nextBid,
      };
    });
  }
}
