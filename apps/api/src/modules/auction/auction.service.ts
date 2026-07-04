import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { ForbiddenException } from "@nestjs/common";
import { ACTIVE_AUCTION_LIMITS } from "../../common/constants/plan-limits";
import { isAdminOrOwner } from "../../common/helpers/ownership.helper";
import { REDIS_CLIENT } from "../../redis/redis.provider";
import Redis from "ioredis";
import {
  AuctionStatus,
  PlanTier,
} from "../../../../../packages/database/dist/generated/index";

@Injectable()
export class AuctionService {
  constructor(
    private prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) { }

  private async generateShortCode(): Promise<string> {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars like 0, O, 1, I
    let isUnique = false;
    let code = "";

    while (!isUnique) {
      code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await this.prisma.prisma.auction.findUnique({
        where: { auctionCode: code },
      });

      if (!existing) isUnique = true;
    }

    return code;
  }

  // 1. Create Auction
  async create(userId: string, dto: CreateAuctionDto) {
    // 1. CHECK LIMIT: Count existing auctions for this user
    const activeAuctions = await this.prisma.prisma.auction.findMany({
      where: {
        organizerId: userId,
        status: {
          in: [AuctionStatus.DRAFT, AuctionStatus.UPCOMING, AuctionStatus.LIVE],
        },
      },
      select: { planTier: true },
    });

    // 2️⃣ Check if ANY paid auction exists
    const hasPaidAuction = activeAuctions.some(
      (a: any) => a.planTier !== PlanTier.FREE
    );

    // 3️⃣ Decide limit
    const limit = hasPaidAuction ? 5 : 2;

    if (activeAuctions.length >= limit) {
      throw new ForbiddenException(
        hasPaidAuction
          ? `You can have only 5 active auctions at a time. Please archive or complete an auction.`
          : `Free plan allows only 2 active auctions. Upgrade any auction to unlock up to 5.`
      );
    }
    const sport = (dto.sportsType || "Cricket").toUpperCase();

    return this.prisma.prisma.$transaction(async (tx: any) => {
      // Step A: Create the Auction
      const auctionCode = await this.generateShortCode();

      const auction = await tx.auction.create({
        data: {
          organizerId: userId,
          auctionCode,
          name: dto.name,
          location: dto.location,
          logo: dto.logo,
          season: dto.season,
          sportsType: dto.sportsType || "Cricket", // Keep original casing for display
          auctionDate: new Date(dto.auctionDate),
          auctionStartTime: dto.auctionStartTime,
          budgetPerTeam: dto.budgetPerTeam,
          minBid: dto.minBid,
          bidIncrease: dto.bidIncrease,
          minPlayersPerTeam: dto.minPlayersPerTeam,
          maxPlayersPerTeam: dto.maxPlayersPerTeam,
          planTier: "FREE",
          status: AuctionStatus.DRAFT,
        },
      });

      // Step B: Define Categories based on Sport
      let categories: { auctionId: string; name: string; color: string }[] = [];

      switch (sport) {
        case "FOOTBALL":
          categories = [
            { auctionId: auction.id, name: "Forward", color: "#e74c3c" }, // Red
            { auctionId: auction.id, name: "Midfielder", color: "#3498db" }, // Blue
            { auctionId: auction.id, name: "Defender", color: "#f1c40f" }, // Yellow
            { auctionId: auction.id, name: "Goalkeeper", color: "#2ecc71" }, // Green
          ];
          break;

        case "KABADDI":
          categories = [
            { auctionId: auction.id, name: "Raider", color: "#e74c3c" },
            { auctionId: auction.id, name: "Defender", color: "#3498db" },
            { auctionId: auction.id, name: "All Rounder", color: "#9b59b6" },
          ];
          break;

        case "CRICKET":
        default: // Default to Cricket if unknown
          categories = [
            { auctionId: auction.id, name: "Batsman", color: "#3498db" },
            { auctionId: auction.id, name: "Bowler", color: "#e74c3c" },
            { auctionId: auction.id, name: "All Rounder", color: "#9b59b6" },
            { auctionId: auction.id, name: "Wicket Keeper", color: "#f1c40f" },
          ];
          break;
      }

      // Step C: Bulk Insert
      if (categories.length > 0) {
        await tx.category.createMany({ data: categories });
      }

      return auction;
    });
  }

  async update(id: string, userId: string, userRole: string, updateAuctionDto: UpdateAuctionDto) {
    // 1. Check if auction exists
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) throw new NotFoundException("Auction not found");

    // 2. ADMIN or owner can update
    if (!isAdminOrOwner(auction.organizerId, userId, userRole)) {
      throw new ForbiddenException("You can only edit your own auctions");
    }

    // 2. Perform Update
    const updateData: any = {};
    if (updateAuctionDto.name !== undefined)
      updateData.name = updateAuctionDto.name;
    if (updateAuctionDto.auctionDate !== undefined)
      updateData.auctionDate = new Date(updateAuctionDto.auctionDate);
    if (updateAuctionDto.auctionStartTime !== undefined)
      updateData.auctionStartTime = updateAuctionDto.auctionStartTime;
    if (updateAuctionDto.budgetPerTeam !== undefined)
      updateData.budgetPerTeam = updateAuctionDto.budgetPerTeam;

    // Newly added fields for mapping
    if (updateAuctionDto.location !== undefined)
      updateData.location = updateAuctionDto.location;
    if (updateAuctionDto.season !== undefined)
      updateData.season = updateAuctionDto.season;
    if (updateAuctionDto.minBid !== undefined)
      updateData.minBid = updateAuctionDto.minBid;
    if (updateAuctionDto.bidIncrease !== undefined)
      updateData.bidIncrease = updateAuctionDto.bidIncrease;
    if (updateAuctionDto.minPlayersPerTeam !== undefined)
      updateData.minPlayersPerTeam = updateAuctionDto.minPlayersPerTeam;
    if (updateAuctionDto.maxPlayersPerTeam !== undefined)
      updateData.maxPlayersPerTeam = updateAuctionDto.maxPlayersPerTeam;
    if (updateAuctionDto.sportsType !== undefined)
      updateData.sportsType = updateAuctionDto.sportsType;
    if (updateAuctionDto.logo !== undefined)
      updateData.logo = updateAuctionDto.logo;
    if (updateAuctionDto.isBoosterEnabled !== undefined)
      updateData.isBoosterEnabled = updateAuctionDto.isBoosterEnabled;
    if (updateAuctionDto.boosterAmount !== undefined)
      updateData.boosterAmount = updateAuctionDto.boosterAmount;
    if (updateAuctionDto.boosterTriggerPlayerCount !== undefined)
      updateData.boosterTriggerPlayerCount = updateAuctionDto.boosterTriggerPlayerCount;
    if (updateAuctionDto.bidRules !== undefined)
      updateData.bidRules = updateAuctionDto.bidRules;
    if (updateAuctionDto.liveTheme !== undefined)
      updateData.liveTheme = updateAuctionDto.liveTheme;
    if (updateAuctionDto.soldEffect !== undefined)
      updateData.soldEffect = updateAuctionDto.soldEffect;
    if (updateAuctionDto.overlayTheme !== undefined)
      updateData.overlayTheme = updateAuctionDto.overlayTheme;
    if (updateAuctionDto.overlayLayout !== undefined)
      updateData.overlayLayout = updateAuctionDto.overlayLayout;

    const updated = await this.prisma.prisma.auction.update({
      where: { id },
      data: updateData,
    });

    // Invalidate cached Redis meta, settings, and snapshot so the WebSocket gateway / controllers fetch fresh properties
    await this.redis.del(
      `auction:${id}:meta`,
      `auction:${id}:settings`,
      `auction:${id}:snapshot`
    );

    return updated;
  }

  async joinAuction(userId: string, code: string) {
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { auctionCode: code },
    });
    if (!auction) throw new NotFoundException("Invalid Auction Code");

    if (auction.organizerId === userId) {
      throw new ForbiddenException("You cannot join your own auction as a participant.");
    }

    const existing = await this.prisma.prisma.joinedAuction.findUnique({
      where: {
        userId_auctionId: { userId, auctionId: auction.id },
      },
    });

    if (existing) {
      return { success: true, auctionId: auction.id, message: "Already joined" };
    }

    await this.prisma.prisma.joinedAuction.create({
      data: {
        userId,
        auctionId: auction.id,
      },
    });

    return { success: true, auctionId: auction.id };
  }

  async findJoined(userId: string) {
    const joined = await this.prisma.prisma.joinedAuction.findMany({
      where: { userId },
      include: {
        auction: {
          include: {
            organizer: { select: { name: true } },
            _count: { select: { teams: true, players: true } },
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });
    return joined.map((j: any) => j.auction);
  }

  // 2. Get All Auctions for User (Admin gets ALL, organizer gets own)
  async findAllByUser(userId: string, userRole: string) {
    // ADMIN sees all auctions in the entire system
    const where = userRole === 'ADMIN' ? {} : { organizerId: userId };
    const auctions = await this.prisma.prisma.auction.findMany({
      where,
      include: {
        _count: { select: { teams: true, players: true } },
      },
    });

    // 2. CHECK DATE & UPDATE STATUS (The "Lazy" Logic)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time, just check date

    const updatedAuctions = await Promise.all(
      auctions.map(async (auction: any) => {
        // If date is in the past AND status is still UPCOMING
        if (
          new Date(auction.auctionDate) < today &&
          auction.status === "UPCOMING"
        ) {
          return this.prisma.prisma.auction.update({
            where: { id: auction.id },
            data: { status: "COMPLETED" },
            include: { _count: { select: { teams: true, players: true } } },
          });
        }
        return auction;
      })
    );

    return updatedAuctions;
  }

  // 3. Get Single Auction Details
  async findOne(id: string) {
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id },
      include: { teams: true, players: true },
    });

    if (!auction) throw new NotFoundException("Auction not found");
    return auction;
  }

  // 4. Delete Auction — ADMIN or owner only
  async remove(id: string, userId: string, userRole: string) {
    const auction = await this.findOne(id);
    if (!isAdminOrOwner(auction.organizerId, userId, userRole)) {
      throw new ForbiddenException("You can only delete your own auctions");
    }
    return this.prisma.prisma.auction.delete({ where: { id } });
  }

  // 5. Today & Upcoming Schedule — Public (no auth required)
  async getSchedule() {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const [todayAuctions, upcomingAuctions] = await Promise.all([
      // Today's auctions (any status)
      this.prisma.prisma.auction.findMany({
        where: {
          auctionDate: { gte: todayStart, lte: todayEnd },
        },
        orderBy: { auctionDate: 'asc' },
        select: {
          id: true,
          name: true,
          location: true,
          logo: true,
          sportsType: true,
          season: true,
          auctionDate: true,
          auctionStartTime: true,
          status: true,
          planTier: true,
          organizer: { select: { name: true } },
        },
      }),
      // Upcoming auctions (strictly after today)
      this.prisma.prisma.auction.findMany({
        where: {
          auctionDate: { gt: todayEnd },
          status: { not: 'COMPLETED' },
        },
        orderBy: { auctionDate: 'asc' },
        take: 20, // Cap at 20 upcoming
        select: {
          id: true,
          name: true,
          location: true,
          logo: true,
          sportsType: true,
          season: true,
          auctionDate: true,
          auctionStartTime: true,
          status: true,
          planTier: true,
          organizer: { select: { name: true } },
        },
      }),
    ]);

    return {
      today: todayAuctions,
      upcoming: upcomingAuctions,
      generatedAt: now.toISOString(),
    };
  }

  // 6. Paginated Today's Auctions
  async getTodayAuctions(page: number, limit: number) {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const skip = (page - 1) * limit;

    const [auctions, total] = await Promise.all([
      this.prisma.prisma.auction.findMany({
        where: {
          auctionDate: { gte: todayStart, lte: todayEnd },
        },
        orderBy: { auctionDate: 'asc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          location: true,
          logo: true,
          sportsType: true,
          season: true,
          auctionDate: true,
          auctionStartTime: true,
          status: true,
          planTier: true,
          budgetPerTeam: true,
          minPlayersPerTeam: true,
          organizer: { select: { name: true } },
          _count: { select: { teams: true, players: true } }
        },
      }),
      this.prisma.prisma.auction.count({
        where: {
          auctionDate: { gte: todayStart, lte: todayEnd },
        },
      }),
    ]);

    return {
      data: auctions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 7. Paginated Upcoming Auctions
  async getUpcomingAuctions(page: number, limit: number) {
    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const skip = (page - 1) * limit;

    const [auctions, total] = await Promise.all([
      this.prisma.prisma.auction.findMany({
        where: {
          auctionDate: { gt: todayEnd },
          status: { not: 'COMPLETED' },
        },
        orderBy: { auctionDate: 'asc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          location: true,
          logo: true,
          sportsType: true,
          season: true,
          auctionDate: true,
          auctionStartTime: true,
          status: true,
          planTier: true,
          budgetPerTeam: true,
          minPlayersPerTeam: true,
          organizer: { select: { name: true } },
          _count: { select: { teams: true, players: true } }
        },
      }),
      this.prisma.prisma.auction.count({
        where: {
          auctionDate: { gt: todayEnd },
          status: { not: 'COMPLETED' },
        },
      }),
    ]);

    return {
      data: auctions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
