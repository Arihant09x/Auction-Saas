import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from "class-validator";

export class CreateTeamDto {
  @IsUUID()
  @IsNotEmpty()
  auctionId!: string; // REQUIRED: Which auction does this team belong to?

  @IsString()
  @IsNotEmpty()
  name!: string; // e.g. "Chennai Super Kings"

  @IsString()
  @IsNotEmpty()
  @Length(2, 4)
  shortName!: string; // e.g. "CSK" (Max 4 chars)

  @IsString()
  @IsOptional()
  shortcutKey?: string; // e.g. "C" (For keyboard bidding)

  @IsString()
  @IsOptional()
  logo?: string; // URL to image
}
