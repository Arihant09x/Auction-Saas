import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Patch,
} from "@nestjs/common";
import { PlayerService } from "./player.service";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { AuthGuard } from "@nestjs/passport";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import {
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("player")
@UseGuards(AuthGuard("firebase-jwt"))
export class PlayerController {
  constructor(private readonly playerService: PlayerService) { }

  @Post()
  create(@Request() req: any, @Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(req.user.id, req.user.role, createPlayerDto);
  }

  @Post("upload/preview")
  @UseInterceptors(FileInterceptor("file"))
  async previewUpload(
    @Request() req: any,
    @Body("auctionId") auctionId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
        fileIsRequired: true,
      })
    )
    file: Express.Multer.File
  ) {
    return this.playerService.previewBulkUpload(req.user.id, req.user.role, auctionId, file);
  }

  @Post("upload/confirm")
  async confirmUpload(
    @Request() req: any,
    @Body() body: { auctionId: string; players: any[] }
  ) {
    return this.playerService.confirmBulkUpload(
      req.user.id,
      req.user.role,
      body.auctionId,
      body.players
    );
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadPlayers(
    @Request() req: any,
    @Body("auctionId") auctionId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
        ],
        fileIsRequired: true,
      })
    )
    file: Express.Multer.File
  ) {
    return this.playerService.bulkUpload(req.user.id, req.user.role, auctionId, file);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query("auctionId") auctionId: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 20;

    return this.playerService.findAll(auctionId, req.user.id, req.user.role, pageNumber, limitNumber);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Request() req: any
  ) {
    return this.playerService.update(id, req.user.id, req.user.role, updatePlayerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: any) {
    return this.playerService.remove(id, req.user.id, req.user.role);
  }
}
