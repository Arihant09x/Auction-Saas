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
