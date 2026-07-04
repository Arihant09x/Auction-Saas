import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Patch,
  Query,
} from "@nestjs/common";
import { AuctionService } from "./auction.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { AuthGuard } from "@nestjs/passport";
import { UpdateAuctionDto } from "./dto/update-auction.dto";

/**
 * Public controller — NO authentication required.
 * Only hosts read-only informational endpoints.
 */
@Controller("auction")
export class AuctionPublicController {
  constructor(private readonly auctionService: AuctionService) { }

  /** GET /auction/schedule — zero auth, callable from browser/Postman without token */
  @Get("schedule")
  getSchedule() {
    return this.auctionService.getSchedule();
  }

  @Get("today")
  getTodayAuctions(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNumber = parseInt(page || "1", 10);
    const limitNumber = parseInt(limit || "10", 10);
    return this.auctionService.getTodayAuctions(pageNumber, limitNumber);
  }

  @Get("upcoming")
  getUpcomingAuctions(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNumber = parseInt(page || "1", 10);
    const limitNumber = parseInt(limit || "10", 10);
    return this.auctionService.getUpcomingAuctions(pageNumber, limitNumber);
  }
}

/**
 * Protected controller — Firebase JWT required for every route.
 */
@Controller("auction")
@UseGuards(AuthGuard("firebase-jwt"))
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) { }

  @Post()
  create(@Request() req: any, @Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.create(req.user.id, createAuctionDto);
  }

  @Post("join")
  joinAuction(@Request() req: any, @Body("code") code: string) {
    return this.auctionService.joinAuction(req.user.id, code);
  }

  @Get("joined")
  findJoined(@Request() req: any) {
    return this.auctionService.findJoined(req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.auctionService.findAllByUser(req.user.id, req.user.role);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.auctionService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: any) {
    return this.auctionService.remove(id, req.user.id, req.user.role);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
    @Request() req: any,
  ) {
    return this.auctionService.update(id, req.user.id, req.user.role, updateAuctionDto);
  }
}
