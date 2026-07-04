import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from "class-validator";
class BidRuleDto {
  @IsNumber()
  @Min(0)
  threshold!: number; // e.g., 2000 (When bid crosses this)

  @IsNumber()
  @Min(0)
  increment!: number; // e.g., 2000 (New step size)
}
export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  sportsType?: string;

  @IsDateString()
  @IsNotEmpty()
  auctionDate!: string; // Format: "2025-12-25"

  @IsString()
  @IsNotEmpty()
  auctionStartTime!: string; // Format: "10:00 AM"

  @IsNumber()
  @Min(100)
  budgetPerTeam!: number;

  @IsNumber()
  @Min(0)
  minBid!: number;

  @IsNumber()
  @Min(1)
  bidIncrease!: number;

  @IsNumber()
  minPlayersPerTeam!: number;

  @IsNumber()
  maxPlayersPerTeam!: number;

  @IsBoolean()
  @IsOptional()
  isBoosterEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  boosterAmount?: number;

  @IsNumber()
  @IsOptional()
  boosterTriggerPlayerCount?: number;

  // --- NEW BID RULES ---
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BidRuleDto)
  bidRules?: BidRuleDto[];
}
