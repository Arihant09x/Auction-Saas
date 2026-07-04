import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuctionService } from "./auction.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { AuthGuard } from "@nestjs/passport";
import { Patch } from "@nestjs/common";
import { UpdateAuctionDto } from "./dto/update-auction.dto";

@Controller("auction")
@UseGuards(AuthGuard("firebase-jwt")) // 🔒 Secure all routes
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) { }

  @Post()
  create(@Request() req: any, @Body() createAuctionDto: CreateAuctionDto) {
    // We use req.user.id (Postgres ID) not req.user.uid (Firebase ID)
    return this.auctionService.create(req.user.id, createAuctionDto);
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
    // Owner or ADMIN can delete
    return this.auctionService.remove(id, req.user.id, req.user.role);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
    @Request() req: any
  ) {
    // Pass user ID and role — ADMIN or owner can edit
    return this.auctionService.update(id, req.user.id, req.user.role, updateAuctionDto);
  }
}
