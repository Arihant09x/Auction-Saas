import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuctionModule } from "./modules/auction/auction.module";
import { TeamModule } from "./modules/team/team.module";
import { CategoryModule } from "./modules/category/category.module";
import { PlayerModule } from "./modules/player/player.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { AdminModule } from "./modules/admin/admin.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuditModule } from "./modules/audit/audit.module";
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";
import { LiveAuctionModule } from "./modules/live-auction/live-auction.module";
import { RedisModule } from "./redis/redis.module";
import { FeedbackModule } from "./modules/feedback/feedback.module";
import { HealthModule } from "./common/health/health.module";
import { MonitoringModule } from "./common/monitoring/monitoring.module";
import { ContactModule } from "./modules/contact/contact.module";
import { BlogsModule } from "./modules/blogs/blogs.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // Max 100 requests per IP
      },
    ]),

    RedisModule,
    PrismaModule,
    AuthModule,
    AuctionModule,
    TeamModule,
    CategoryModule,
    PlayerModule,
    PaymentModule,
    AdminModule,
    AuditModule,
    LiveAuctionModule,
    FeedbackModule,
    MonitoringModule,
    HealthModule,
    ContactModule,
    BlogsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule { }
