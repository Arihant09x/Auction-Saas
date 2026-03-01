import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class CreateCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  auctionId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string; // "Batsman", "Wicket Keeper"

  @IsString()
  @IsOptional()
  color?: string; // Hex Code "#FF0000" for UI tags

  @IsNumber()
  @IsOptional()
  @Min(0)
  baseBid?: number; // Optional override (e.g., Marquee set starts at 2Cr)

  @IsNumber()
  @IsOptional()
  @Min(0)
  minIncrement?: number;

  @IsNumber()
  @IsOptional()
  minPlayersPerTeam?: number;

  @IsNumber()
  @IsOptional()
  maxPlayersPerTeam?: number; // e.g., Max 2 Foreign players
}
