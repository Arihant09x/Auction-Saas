import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { FirebaseStrategy } from "./strategy/firebase.strategy";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: "firebase-jwt" }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy],
  exports: [AuthService], // Exported so other modules can use 'AuthService' to find users
})
export class AuthModule {}
