import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { LiveAuctionService } from "./live-auction.service";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "../../prisma/prisma.service";
import { validateAuctionAccess } from "../../common/helpers/ownership.helper";

@Controller("live-auction")
@UseGuards(AuthGuard("firebase-jwt"))
export class LiveAuctionController {
  constructor(
    private readonly liveAuctionService: LiveAuctionService,
    private readonly prisma: PrismaService,
  ) {}

  // GET /live-auction/:auctionId
  // Used to get the full snapshot of the auction (Current Player, Bids, Status)
  @Get(":id")
  async getLiveState(@Param("id") auctionId: string, @Request() req: any) {
    await validateAuctionAccess(
      this.prisma,
      auctionId,
      req.user.id,
      req.user.role,
    );
    return this.liveAuctionService.getCurrentState(auctionId);
  }
}

/**
 * Public live-auction controller — zero auth required.
 * Exposes lightweight read-only views for Viewer and Overlay pages (SSR + Polling).
 * Data is served directly from Redis cache without database overhead.
 */
@Controller("live-auction")
export class LiveAuctionPublicController {
  constructor(private readonly liveAuctionService: LiveAuctionService) {}

  // GET /live-auction/:id/view — public read-only live auction state
  @Get(":id/view")
  getReadOnlyView(@Param("id") auctionId: string) {
    return this.liveAuctionService.getReadOnlyLiveView(auctionId);
  }
}

