import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController, AuctionPublicController } from './auction.controller';

@Module({
  controllers: [AuctionPublicController, AuctionController],
  providers: [AuctionService],
})
export class AuctionModule { }
