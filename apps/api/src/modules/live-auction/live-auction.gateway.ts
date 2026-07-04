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
// import { UseGuards } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { LiveAuctionRedisService } from "./live-auction.redis.service";

// Note: WebSocket Guards need a different implementation,
// for now we'll validate Token inside handleConnection manually.

@WebSocketGateway({ cors: { origin: "*" }, namespace: "/live-auction" }) // Allow all origins for dev
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
    if (client.data.user.role === 'ADMIN') {
      throw new Error("ADMIN_READ_ONLY: Admin can monitor live auctions but cannot perform organizer actions");
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
  private async pushSnapshot(auctionId: string) {
    const snap = await this.redisService.getDashboardSnapshot(auctionId);

    if (!snap) return;

    this.server.to(`auction:${auctionId}`).emit("dashboard_snapshot", snap);
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
    // 1. Security Check (Organizer Only)
    // if (!client.data.user.isOrganizer) return; // Uncomment in prod

    try {
      await this.requireOrganizer(client, data.auctionId);
      console.log("✅ Organizer verified. Selecting next player...");
      const status = await this.redisService.getAuctionStatus(data.auctionId);

      if (status === "BIDDING") {
        client.emit(
          "error",
          "Finish current player (Sell or Unsold) before selecting next",
        );
        return;
      }

      if (status === "SOLD_PENDING") {
        client.emit("error", "Confirm or reopen previous player first");
        return;
      }
      const auction = await this.prisma.prisma.auction.findUnique({
        where: { id: data.auctionId },
      });
      if (!auction) {
        client.emit("error", "Auction not found");
        return;
      }
      // 2. Find the Player
      const player = await this.liveAuctionService.selectPlayer(
        data.auctionId,
        data.mode,
        data.categoryId,
        data.playerNo,
      );

      if (!player) {
        client.emit("error", "No player found matching criteria");
        return;
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
    } catch (e: any) {
      client.emit("error", e.message);
      return;
    }
  }
  // 2. ORGANIZER: HAMMER DOWN (Soft Sold)
  // ==================================================
  @SubscribeMessage("mark_sold")
  async handleMarkSold(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // This DOES NOT write to Postgres. It just pauses bidding.
    try {
      await this.requireOrganizer(client, data.auctionId);
    } catch (e: any) {
      client.emit("error", e.message);
      return;
    }
    await this.redisService.setAuctionStatus(data.auctionId, "SOLD_PENDING");

    this.server.to(`auction:${data.auctionId}`).emit("player_sold_pending", {
      message: "SOLD! (Waiting for Confirmation...)",
    });
  }

  @SubscribeMessage("mark_unsold")
  async handleUnsold(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.requireOrganizer(client, data.auctionId);

    const player = await this.redisService.getCurrentPlayer(data.auctionId);

    if (!player) {
      client.emit("error", "No active player");
      return;
    }

    // Return player to unsold queue
    // ⭐ Move to UNSOLD POOL (NEW LOGIC)
    await this.redisService.addToUnsoldPool(data.auctionId, player);
    await this.liveAuctionService.patchSnapshot(data.auctionId, {
      type: "PLAYER_UNSOLD",
      payload: player,
    });

    await this.redisService.setAuctionStatus(data.auctionId, "WAITING");
    await this.redisService.setCurrentPlayer(data.auctionId, null);
    this.server
      .to(`auction:${data.auctionId}`)
      .emit("player_unsold_patch", player);

    // Refresh state UI
    const state = await this.liveAuctionService.getCurrentState(data.auctionId);

    this.server
      .to(`auction:${data.auctionId}`)
      .emit("auction_state_update", state);
  }

  // 3. ORGANIZER: RE-OPEN (Oops, someone bid late!)
  // ==================================================
  @SubscribeMessage("reopen_bidding")
  async handleReopen(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Revert status to BIDDING. Keep the last bid intact.
    try {
      await this.requireOrganizer(client, data.auctionId);
    } catch (e: any) {
      client.emit("error", e.message);
      return;
    }
    await this.redisService.setAuctionStatus(data.auctionId, "BIDDING");

    this.server.to(`auction:${data.auctionId}`).emit("bidding_resumed", {
      message: "Bidding Re-opened! Continue from last bid.",
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
    try {
      // Security (Organizer only)
      await this.requireOrganizer(client, data.auctionId);

      const result = await this.liveAuctionService.confirmSale(data.auctionId);

      if ((result as any)?.error) {
        client.emit("error", (result as any).error);
        return;
      }

      const auctionId = data.auctionId;

      // =========================
      // 1. BROADCAST SOLD EVENT
      // =========================
      this.server.to(`auction:${auctionId}`).emit("player_sold_confirmed", {
        teamName: result.teamName,
        playerName: result.playerName,
        category: result.category,
        soldTo: result.teamName,
        amount: result.amount,
        remainingPurse: result.remainingPurse,
        boosterApplied: result.boosterApplied,
      });

      // =========================
      // 2. PUSH FULL STATE UPDATE
      // =========================
      const fullState =
        await this.liveAuctionService.getCurrentState(auctionId);
      const player = await this.redisService.getCurrentPlayer(auctionId);
      // if(player){
      //   fullState.currentPlayer=player;
      // }
      // await this.liveAuctionService.updateSnapshotAfterSale(auctionId);
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
      });
    } catch (e: any) {
      client.emit("error", e.message || "Confirm failed");
    }
  }

  // 5. CONNECTION HANDLER
  async handleConnection(client: Socket) {
    try {
      // Extract Token from query: ws://localhost:3000?token=xyz
      const auctionId =
        (client.handshake.query.auctionId as string) ||
        (client.handshake.auth.auctionId as string);

      if (!auctionId) {
        client.disconnect();
        throw new Error("invalid_connection");
      }

      // Join the specific Auction Room

      client.join(`auction:${auctionId}`);
      if (client.data.viewer) {
        console.log(`Viewer ${client.id} joined Auction ${auctionId}`);
        let snap = await this.redisService.getDashboardSnapshot(auctionId);
        if (!snap) {
          snap =
            await this.liveAuctionService.buildDashboardSnapshot(auctionId);
          await this.redisService.setDashboardSnapshot(auctionId, snap);
        }
        client.emit("snapshot_sync", snap);
      } else {
        console.log(`User ${client.data.user.id} joined Auction ${auctionId}`);
      }
      const currentPlayer = await this.redisService.getCurrentPlayer(auctionId);
      const lastBid = await this.redisService.getLastBid(auctionId);
      const bidHistory = await this.redisService.getBidHistory(auctionId);
      const state = await this.liveAuctionService.getCurrentState(auctionId); // Fetch current state
      const snap = await this.redisService.getDashboardSnapshot(auctionId);
      if (state.status === "COMPLETED") {
        const result = await this.liveAuctionService.endAuction(
          auctionId,
          client.data.user?.id || 'system',
          client.data.user?.role || 'USER',
          true,
        );
        this.server.to(`auction:${auctionId}`).emit("auction_ended", result);
      }
      if (snap) {
        client.emit("dashboard_snapshot", snap);
      }

      if (state.status === "BIDDING" && state.currentPlayer) {
        await this.redisService.setAuctionStatus(auctionId, "BIDDING");
      }
      client.emit("auction_state_update", state); // Send current state to the connected client
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
  //
  //   const auction = await this.prisma.auction.findUnique({
  //   where: { id: auctionId },
  //   select: { status: true },
  // });

  // if (auction?.status === "COMPLETED") {
  //   const insight = await this.prisma.auctionInsight.findUnique({
  //     where: { auctionId },
  //   });

  //   if (insight) {
  //     client.emit("auction_insight_ready", insight.data);
  //     return;
  //   }
  // }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // 6. ORGANIZER: INIT AUCTION
  // Triggered when Organizer opens the "Live Dashboard"
  @SubscribeMessage("init_auction")
  async handleInitAuction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // 1. Basic Validation
      if (!client.data?.user) {
        console.log("data", client.data);
        console.log("❌ No User Data in Socket");
        client.emit("error", "Not authenticated");
        return;
      }
      // 2. Ensure they are initializing the auction they connected to
      if (client.data.auctionId !== data.auctionId) {
        client.emit("error", "Auction ID mismatch");
        return;
      }
      // if (client.data.user.role !== "ADMIN") {
      //   client.emit("error", "Only organizer can perform this action");
      //   return;
      // }

      const userdata = await this.requireOrganizer(client, data.auctionId);
      if (!userdata) {
        client.emit("error", "Unauthorized");
        return;
      }
      console.log("✅ Organizer verified. Initializing auction...");

      // A. Check if user is actually the Organizer of THIS auction
      const auction = await this.prisma.prisma.auction.findUnique({
        where: { id: data.auctionId },
        select: { organizerId: true },
      });
      if (!auction) {
        client.emit("error", "You are not the organizer of this auction");
        return;
      }

      // This loads DB data into Redis
      console.log("✅ Ownership Verified. Initializing Redis...");
      const existingStatus = await this.redisService.getAuctionStatus(
        data.auctionId,
      );

      const settings = await this.redisService.getSettings(data.auctionId);

      if (settings) {
        // Redis already initialized → just sync state
        client.emit(
          "auction_state_update",
          await this.liveAuctionService.getCurrentState(data.auctionId),
        );
        return;
      }
      console.log("🆕 First time init → loading from DB");
      const state = await this.liveAuctionService.initAuction(data.auctionId);
      await this.pushSnapshot(data.auctionId);
      // Send the current state back to the Organizer
      this.server
        .to(`auction:${data.auctionId}`)
        .emit("auction_state_update", state);
    } catch (e: any) {
      client.emit("error", e.message);
    }
  }

  //7. BIDDER: PLACE BID
  @SubscribeMessage("place_bid")
  async handleBid(
    @MessageBody() data: { auctionId: string; teamId: string; amount: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { auctionId, teamId, amount } = data;

      if (!client.data?.user) {
        client.emit("error", "Not authenticated");
        return;
      }
      if (client.data.auctionId !== auctionId) {
        client.emit("error", "Auction ID mismatch");
        return;
      }
      if (!teamId) throw new Error("Unauthorized");
      const budget = await this.redisService.getTeamBudget(auctionId, teamId);
      const teamMeta = await this.redisService.getTeamMeta(auctionId, teamId);

      console.log("Team Budget:", budget, "Team Meta:", teamMeta);

      if (!teamMeta) {
        throw new Error("TEAM_NOT_FOUND");
      }

      // // 2. Organizer-only bidding (recommended)
      // if (client.data.user.role !== "ADMIN") {
      //   throw new Error("Only organizer can place bids");
      // }

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
    } catch (e: any) {
      console.error("❌ Bid Failed:", e.message);

      // If the service threw the raw object, print it:
      if (e.message.includes("BELOW_BASE_PRICE")) {
        console.error(
          "Reason: The Gateway sent an empty or 0 Amount to the Service.",
        );
      }

      client.emit("error", e.message);
    }
  }

  @SubscribeMessage("reauction_unsold")
  async handleReauction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Verify Organizer
    // ... check code ...
    await this.requireOrganizer(client, data.auctionId);

    const result = await this.liveAuctionService.reauctionUnsold(
      data.auctionId,
    );
    const ids = result.players?.map((p) => p.id) || [];

    await this.liveAuctionService.patchSnapshot(data.auctionId, {
      type: "PLAYER_REAUCTION",
      payload: { ids },
    });
    await this.pushSnapshot(data.auctionId);

    // Notify Organizer
    client.emit("notification", { message: result.message });

    // Optionally refresh state for everyone
    const state = await this.liveAuctionService.getCurrentState(data.auctionId);
    this.server
      .to(`auction:${data.auctionId}`)
      .emit("auction_state_update", state);
    this.server
      .to(`auction:${data.auctionId}`)
      .emit("players_reauctioned_patch", { ids });
  }

  @SubscribeMessage("end_auction")
  async handleEndAuction(
    client: Socket,
    payload: { auctionId: string; force?: boolean },
  ) {
    const user = client.data.user;

    const result = await this.liveAuctionService.endAuction(
      payload.auctionId,
      user.id,
      user.role,
      payload.force || false,
    );

    this.server.to(payload.auctionId).emit("auction_ended", result);
    return result;
  }

  @SubscribeMessage("undo_bid")
  async handleUndoBid(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.requireOrganizer(client, data.auctionId);

    const result = await this.redisService.undoLastBid(data.auctionId);

    const auction = await this.prisma.auction.findUnique({
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

    let nextBid = Number(auction?.minBid || 500);

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
  }
}
