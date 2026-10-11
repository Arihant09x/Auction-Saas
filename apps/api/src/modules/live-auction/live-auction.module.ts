import { Module } from "@nestjs/common";
import { LiveAuctionService } from "./live-auction.service";
import { LiveAuctionController, LiveAuctionPublicController } from "./live-auction.controller";
import { PrismaModule } from "../../prisma/prisma.module";
import { LiveAuctionGateway } from "./live-auction.gateway";
import { LiveAuctionRedisService } from "./live-auction.redis.service";

@Module({
  imports: [PrismaModule],
  controllers: [LiveAuctionController, LiveAuctionPublicController],
  providers: [LiveAuctionService, LiveAuctionGateway, LiveAuctionRedisService],
})
export class LiveAuctionModule {}
