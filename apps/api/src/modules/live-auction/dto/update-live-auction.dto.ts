import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveAuctionDto } from './create-live-auction.dto';

export class UpdateLiveAuctionDto extends PartialType(CreateLiveAuctionDto) {}
