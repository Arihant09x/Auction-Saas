import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { AuthGuard } from "@nestjs/passport";
import { PlanTier } from "../../../../../packages/database/dist/generated";

@Controller("payment")
@UseGuards(AuthGuard("firebase-jwt"))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Step 1: Frontend calls this when user clicks "Pay 5000"
  @Post("create-order")
  createOrder(
    @Request() req: any,
    @Body() body: { auctionId: string; planTier: string }
  ) {
    return this.paymentService.createOrder(
      req.user.id,
      body.auctionId,
      body.planTier as PlanTier
    );
  }

  // Step 2: Frontend calls this AFTER Razorpay Popup closes successfully
  @Post("verify")
  verifyPayment(
    @Body()
    body: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      auctionId: string;
      planTier: string;
    }
  ) {
    return this.paymentService.verifyPayment(body as any);
  }
}
