import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import Redis from "ioredis";
import { REDIS_CLIENT } from "../../redis/redis.provider";

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async create(userId: string, dto: CreateCategoryDto) {
    // 1. Validate Auction Ownership
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: dto.auctionId },
    });

    if (!auction) throw new NotFoundException("Auction not found");
    if (auction.organizerId !== userId) {
      throw new ForbiddenException("You do not own this auction");
    }

    // 2. Create Category
    const newCategory = await this.prisma.prisma.category.create({
      data: {
        auctionId: dto.auctionId!,
        name: dto.name!,
        color: dto.color ?? null,
        baseBid: dto.baseBid ?? null,
        minIncrement: dto.minIncrement ?? null,
        maxPlayersPerTeam: dto.maxPlayersPerTeam ?? null,
      },
    });

    await this.redis.del(`auction:${dto.auctionId}:settings`, `auction:${dto.auctionId}:snapshot`);
    return newCategory;
  }

  async findAllByAuction(auctionId: string) {
    return this.prisma.prisma.category.findMany({
      where: { auctionId },
      orderBy: { name: "asc" },
      include: { _count: { select: { players: true } } }, // Show how many players in this category
    });
  }
  async update(id: string, userId: string, dto: UpdateCategoryDto) {
    // 1. Fetch category with auction (ownership check)
    const category = await this.prisma.prisma.category.findUnique({
      where: { id },
      include: { auction: true },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (category.auction.organizerId !== userId) {
      throw new ForbiddenException("You do not own this category");
    }

    // 2. Build update object dynamically
    const updateData: any = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.color !== undefined) updateData.color = dto.color;
    if (dto.baseBid !== undefined) updateData.baseBid = dto.baseBid;
    if (dto.minIncrement !== undefined)
      updateData.minIncrement = dto.minIncrement;
    if (dto.maxPlayersPerTeam !== undefined)
      updateData.maxPlayersPerTeam = dto.maxPlayersPerTeam;

    // 3. Update category
    const updated = await this.prisma.prisma.category.update({
      where: { id },
      data: updateData,
    });

    await this.redis.del(`auction:${category.auctionId}:settings`, `auction:${category.auctionId}:snapshot`);
    return updated;
  }

  async remove(id: string, userId: string) {
    const category = await this.prisma.prisma.category.findUnique({
      where: { id },
      include: { auction: true },
    });

    if (!category) throw new NotFoundException("Category not found");
    if (category.auction.organizerId !== userId) {
      throw new ForbiddenException("You do not own this category");
    }

    const deleted = await this.prisma.prisma.category.delete({ where: { id } });
    await this.redis.del(`auction:${category.auctionId}:settings`, `auction:${category.auctionId}:snapshot`);
    return deleted;
  }
}
