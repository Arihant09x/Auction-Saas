import { Injectable, BadRequestException } from "@nestjs/common";
import Razorpay from "razorpay";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import * as crypto from "crypto";
import { PLAN_LIMITS } from "../../common/constants/plan-limits";
import { PlanTier } from "../../../../../packages/database/dist/generated";

const PLAN_PRIORITY = {
  BASIC: 1,
  STANDARD: 2,
  PREMIUM: 3,
  ELITE: 4,
  ULTIMATE: 5,
} as const;

@Injectable()
export class PaymentService {
  private razorpay: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    const keyId = "rzp_test_Rucoly3LqinHM4";
    const keySecret = "xmpgeDUW7nIB19lkFoiJ8oNW";

    if (!keyId || !keySecret) {
      throw new Error("Razorpay configuration is missing");
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  // 1. Create Order
  // 1. Create Order
  async createOrder(
    userId: string,
    auctionId: string,
    targetPlan: keyof typeof PLAN_LIMITS
  ) {
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction) throw new BadRequestException("Auction not found");

    const currentPlan = auction.planTier as keyof typeof PLAN_LIMITS; // e.g., 'BASIC'
    const currentPrice = PLAN_LIMITS[currentPlan].price || 0;
    const targetPrice = PLAN_LIMITS[targetPlan]?.price || 0;

    // 2. Validation
    if (targetPrice === 0)
      throw new BadRequestException("Cannot pay for Free plan");

    if (auction.isPaid && targetPlan === currentPlan) {
      throw new BadRequestException("Plan already active");
    }
    // 3. PRORATED CALCULATION (Pay only the difference)
    let amountToPay = targetPrice;

    // If they already paid for a plan, subtract that amount
    if (auction.isPaid && targetPrice > currentPrice) {
      amountToPay = targetPrice - currentPrice;
      console.log(
        `User upgrading from ${currentPlan} to ${targetPlan}. Paying difference: ${amountToPay}`
      );
    } else if (targetPrice <= currentPrice && auction.isPaid) {
      throw new BadRequestException(
        "You cannot downgrade or pay for a cheaper plan via this endpoint."
      );
    }

    // 4. Create Razorpay Order
    const options = {
      amount: amountToPay, // Amount in Paise
      currency: "INR",
      receipt: `upg_${auctionId.substring(0, 8)}`,
      notes: { auctionId, userId, targetPlan, type: "UPGRADE" },
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: "rzp_test_Rucoly3LqinHM4",
        plan: targetPlan,
      };
    } catch (error) {
      console.error("❌ RAZORPAY ERROR DETAILS:", error);
      throw new BadRequestException("Razorpay Order Creation Failed");
    }
  }

  // 2. Verify Payment (Crucial Security Step)
  async verifyPayment(dto: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    auctionId: string;
    targetPlan: PlanTier; // Use Enum type if possible
  }) {
    const secret = this.configService.get("razorpay.key_secret");

    // Formula provided by Razorpay to check signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest("hex");

    if (generated_signature !== dto.razorpaySignature) {
      throw new BadRequestException("Invalid payment signature");
    }

    // 🔒 TRANSACTION START
    return this.prisma.prisma.$transaction(async (tx: any) => {
      // 1️⃣ Lock auction row
      const auction = await tx.auction.findUnique({
        where: { id: dto.auctionId },
      });

      if (!auction) throw new BadRequestException("Auction not found");

      const currentPlan = auction.planTier as PlanTier;
      const currentPrice = PLAN_LIMITS[currentPlan].price;
      const targetPrice = PLAN_LIMITS[dto.targetPlan].price;

      // 2️⃣ Validate plan upgrade
      if (targetPrice <= currentPrice) {
        throw new BadRequestException("Plan downgrade not allowed");
      }

      // 3️⃣ Prevent duplicate payment
      if (auction.razorpayPaymentId === dto.razorpayPaymentId) {
        throw new BadRequestException("Payment already processed");
      }

      // 4️⃣ Apply upgrade
      await tx.auction.update({
        where: { id: dto.auctionId },
        data: {
          isPaid: true,
          planTier: dto.targetPlan,
          razorpayOrderId: dto.razorpayOrderId,
          razorpayPaymentId: dto.razorpayPaymentId,
          razorpaySignature: dto.razorpaySignature,
        },
      });

      return {
        success: true,
        message: "Payment verified & plan upgraded",
        previousPlan: currentPlan,
        currentPlan: dto.targetPlan,
        paidAmount: targetPrice - currentPrice,
      };
    });
  }
}
