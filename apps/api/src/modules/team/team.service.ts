import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  // --- HELPERS to define limits ---
  private getTeamLimit(tier: string): number {
    switch (tier) {
      case "FREE":
        return 2;
      case "BASIC":
        return 4;
      case "STANDARD":
        return 7;
      case "PREMIUM":
        return 12;
      case "ELITE":
        return 16;
      case "ULTIMATE":
        return 22;
      default:
        return 2;
    }
  }

  // 1. CREATE TEAM
  async create(userId: string, dto: CreateTeamDto) {
    // A. Verify Auction Exists & Belongs to User
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: dto.auctionId },
      include: { teams: true }, // Load existing teams to count them
    });

    if (!auction) throw new NotFoundException("Auction not found");
    if (auction.organizerId !== userId) {
      throw new ForbiddenException("You do not own this auction");
    }

    // B. Check Team Limit based on Plan Tier
    const limit = this.getTeamLimit(auction.planTier);
    if (auction.teams.length >= limit) {
      throw new ForbiddenException(
        `Plan Limit Reached: ${auction.planTier} plan allows only ${limit} teams. Upgrade the Plan to add more.`
      );
    }

    // C. Create Team (Inherit Budget from Auction)
    return this.prisma.prisma.team.create({
      data: {
        auctionId: dto.auctionId,
        name: dto.name,
        shortName: dto.shortName.toUpperCase(),
        shortcutKey: dto.shortcutKey?.toUpperCase() ?? null,
        logo: dto.logo ?? null,

        // AUTOMATIC FIELDS
        originalPurse: auction.budgetPerTeam, // <--- Crucial!
        purseSpent: 0,
        playersCount: 0,
      },
    });
  }

  // 2. GET ALL TEAMS (For a specific auction)
  async findAllByAuction(auctionId: string) {
    return this.prisma.prisma.team.findMany({
      where: { auctionId },
      orderBy: { name: "asc" },
    });
  }

  // 3. UPDATE TEAM
  async update(id: string, userId: string, dto: UpdateTeamDto) {
    // Check ownership first
    const team = await this.prisma.prisma.team.findUnique({
      where: { id },
      include: { auction: true },
    });

    if (!team) throw new NotFoundException("Team not found");
    if (team.auction.organizerId !== userId) {
      throw new ForbiddenException("You do not own this team");
    }

    return this.prisma.prisma.team.update({
      where: { id },
      data: {
        name: dto.name!,
        shortName: dto.shortName?.toUpperCase()!,
        shortcutKey: dto.shortcutKey?.toUpperCase()!,
        logo: dto.logo!,
      },
    });
  }

  async importTeams(
    userId: string,
    currentAuctionId: string,
    sourceAuctionId: string
  ) {
    // 1. Validation
    const currentAuction = await this.prisma.prisma.auction.findUnique({
      where: { id: currentAuctionId },
    });
    const sourceAuction = await this.prisma.prisma.auction.findUnique({
      where: { id: sourceAuctionId },
    });

    if (!currentAuction || !sourceAuction)
      throw new NotFoundException("Auction not found");

    // Security: Ensure User owns BOTH auctions
    if (
      currentAuction.organizerId !== userId ||
      sourceAuction.organizerId !== userId
    ) {
      throw new ForbiddenException(
        "You can only import teams from your own auctions"
      );
    }

    // 2. Fetch Old Teams
    const oldTeams = await this.prisma.prisma.team.findMany({
      where: { auctionId: sourceAuctionId },
    });

    if (oldTeams.length === 0)
      throw new BadRequestException("Source auction has no teams");

    // 3. Prepare New Teams (Reset budget and stats)
    const newTeamsData = oldTeams.map((team: any) => ({
      auctionId: currentAuctionId,
      name: team.name,
      shortName: team.shortName,
      logo: team.logo,
      shortcutKey: team.shortcutKey, // Copy settings

      // RESET Financials
      originalPurse: currentAuction.budgetPerTeam, // Use NEW budget
      purseSpent: 0,
      playersCount: 0,
      boostersUsed: 0,
    }));

    // 4. Bulk Insert
    return this.prisma.prisma.team.createMany({
      data: newTeamsData,
    });
  }

  // 4. DELETE TEAM
  async remove(id: string, userId: string) {
    const team = await this.prisma.prisma.team.findUnique({
      where: { id },
      include: { auction: true },
    });

    if (!team) throw new NotFoundException("Team not found");
    if (team.auction.organizerId !== userId) {
      throw new ForbiddenException("You do not own this team");
    }

    return this.prisma.prisma.team.delete({ where: { id } });
  }
}
