import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
  HttpCode,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { AuthGuard } from "@nestjs/passport";
import { PlanTier } from "@repo/database_postgres";
import { Throttle } from "@nestjs/throttler";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Step 1: Frontend calls this when user clicks "Pay"
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("create-order")
  @UseGuards(AuthGuard("firebase-jwt"))
  createOrder(
    @Request() req: any,
    @Body() body: { auctionId: string; planTier: string }
  ) {
    return this.paymentService.createOrder(
      req.user.id,
      req.user.role,
      body.auctionId,
      body.planTier as PlanTier
    );
  }

  // Step 2: Frontend calls this AFTER Razorpay Popup closes successfully
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("verify")
  @UseGuards(AuthGuard("firebase-jwt"))
  verifyPayment(
    @Request() req: any,
    @Body()
    body: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      auctionId: string;
      targetPlan: string;
    }
  ) {
    return this.paymentService.verifyPayment(
      req.user.id,
      req.user.role,
      body as any
    );
  }

  // Step 3: Razorpay Webhook endpoint (verified via HMAC signature)
  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  handleWebhook(
    @Headers("x-razorpay-signature") signature: string,
    @Req() req: any,
    @Body() body: any
  ) {
    const rawBody = req.rawBody || JSON.stringify(body);
    return this.paymentService.handleWebhook(signature, rawBody, body);
  }
}
