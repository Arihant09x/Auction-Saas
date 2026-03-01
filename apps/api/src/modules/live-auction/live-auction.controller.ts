import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { LiveAuctionService } from "./live-auction.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("live-auction")
@UseGuards(AuthGuard("firebase-jwt"))
export class LiveAuctionController {
  constructor(private readonly liveAuctionService: LiveAuctionService) {}

  // GET /live-auction/:auctionId
  // Used to get the full snapshot of the auction (Current Player, Bids, Status)
  @Get(":id")
  async getLiveState(@Param("id") auctionId: string) {
    return this.liveAuctionService.getCurrentState(auctionId);
  }
}
