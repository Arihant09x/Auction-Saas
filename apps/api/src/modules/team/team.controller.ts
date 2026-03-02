import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { TeamService } from "./team.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("team")
@UseGuards(AuthGuard("firebase-jwt"))
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post()
  create(@Request() req: any, @Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(req.user.id, req.user.role, createTeamDto);
  }

  // GET /team?auctionId=id
  @Get()
  findAll(@Query("auctionId") auctionId: string) {
    return this.teamService.findAllByAuction(auctionId);
  }

  //PATCH /team?auctionID=id
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Request() req: any,
    @Body() updateTeamDto: UpdateTeamDto
  ) {
    return this.teamService.update(id, req.user.id, req.user.role, updateTeamDto);
  }

  @Post("import")
  importTeams(
    @Request() req: any,
    @Body() body: { currentAuctionId: string; sourceAuctionId: string }
  ) {
    return this.teamService.importTeams(
      req.user.id,
      req.user.role,
      body.currentAuctionId,
      body.sourceAuctionId
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: any) {
    return this.teamService.remove(id, req.user.id, req.user.role);
  }
}
