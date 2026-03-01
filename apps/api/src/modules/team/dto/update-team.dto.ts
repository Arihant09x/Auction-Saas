import { PartialType } from "@nestjs/mapped-types";
import { CreateTeamDto } from "./create-team.dto";
import { OmitType } from "@nestjs/mapped-types";

// When updating, we DON'T allow changing the auctionId
export class UpdateTeamDto extends PartialType(
  OmitType(CreateTeamDto, ["auctionId"] as const)
) {}
