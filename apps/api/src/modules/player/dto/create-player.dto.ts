import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
} from "class-validator";
import { PlayerRole } from "../../../../../../packages/database/dist/generated";

export class CreatePlayerDto {
  @IsUUID()
  @IsNotEmpty()
  auctionId!: string; // Required: Which auction is this player for?

  @IsUUID()
  @IsOptional()
  categoryId?: string; // OPTIONAL: Can be assigned later

  // --- Excel Columns ---
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  fatherName?: string;

  @IsNumber()
  @IsOptional()
  age!: number;

  @IsString()
  @IsOptional()
  tshirtSize?: string;

  @IsString()
  @IsOptional()
  trouserSize?: string;

  @IsEnum(PlayerRole)
  @IsNotEmpty()
  role!: PlayerRole; // BATSMAN, BOWLER, ALL_ROUNDER, etc.

  @IsString()
  @IsOptional()
  battingStyle?: string; // "Right Hand Bat"

  @IsString()
  @IsOptional()
  bowlingStyle?: string; // "Right Arm Fast"

  // --- Auction Defaults ---
  @IsNumber()
  @IsOptional()
  basePrice?: number; // If not set, takes Auction default
}
