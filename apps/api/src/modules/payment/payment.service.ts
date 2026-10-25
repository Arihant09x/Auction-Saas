import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import Razorpay from "razorpay";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import * as crypto from "crypto";
import { PLAN_LIMITS } from "../../common/constants/plan-limits";
import { PlanTier } from "@repo/database_postgres";
import { config } from "dotenv";
import { validateAuctionOwnership } from "../../common/helpers/ownership.helper";

config();

export function cleanCredential(val?: string | null): string {
  if (!val) return "";
  let clean = String(val).trim();
  while (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
}

@Injectable()
export class PaymentService {
  private razorpay: any;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    const keyId = cleanCredential(
      process.env.RAZORPAY_KEY_ID ||
      this.configService.get<string>("razorpay.key_id")
    );
    const keySecret = cleanCredential(
      process.env.RAZORPAY_KEY_SECRET ||
      this.configService.get<string>("razorpay.key_secret")
    );

    if (!keyId || !keySecret) {
      this.logger.warn("Razorpay credentials are missing from environment");
    }

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      this.logger.log(
        `Razorpay SDK initialized (Key ID prefix: ${keyId.substring(0, 8)}..., length: ${keyId.length}, Secret length: ${keySecret.length})`,
      );
    }
  }

  // 1. Create Order with Authorization and Server-side Price Verification
  async createOrder(
    userId: string,
    userRole: string,
    auctionId: string,
    targetPlan: keyof typeof PLAN_LIMITS
  ) {
    // 🔒 Verify ownership before creating order for this auction
    const auction = await validateAuctionOwnership(
      this.prisma,
      auctionId,
      userId,
      userRole
    );

    const currentPlan = auction.planTier as keyof typeof PLAN_LIMITS;
    const currentPrice = PLAN_LIMITS[currentPlan]?.price || 0;
    const targetPrice = PLAN_LIMITS[targetPlan]?.price || 0;

    // Validation
    if (targetPrice === 0) {
      throw new BadRequestException("Cannot pay for Free plan");
    }

    if (auction.isPaid && targetPlan === currentPlan) {
      throw new BadRequestException("Plan already active");
    }

    // Prorated calculation strictly derived from trusted server constants
    let amountToPay = targetPrice;

    if (auction.isPaid && targetPrice > currentPrice) {
      amountToPay = targetPrice - currentPrice;
    } else if (targetPrice <= currentPrice && auction.isPaid) {
      throw new BadRequestException(
        "You cannot downgrade or pay for a cheaper plan via this endpoint."
      );
    }

    if (!this.razorpay) {
      throw new BadRequestException("Payment provider is not configured");
    }

    const options = {
      amount: amountToPay, // Amount in Paise
      currency: "INR",
      receipt: `upg_${auctionId.substring(0, 8)}_${Date.now().toString().slice(-4)}`,
      notes: { auctionId, userId, targetPlan, type: "UPGRADE" },
    };

    const keyId = cleanCredential(
      process.env.RAZORPAY_KEY_ID ||
      this.configService.get<string>("razorpay.key_id")
    );

    try {
      const order = await this.razorpay.orders.create(options);
      this.logger.log(`Razorpay order created: orderId=${order.id} for auctionId=${auctionId}`);
      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
        plan: targetPlan,
      };
    } catch (error: any) {
      const statusCode = error?.statusCode || error?.status || "UNKNOWN";
      const errorCode = error?.error?.code || error?.code || "ORDER_CREATION_FAILED";
      const errorDescription = error?.error?.description || error?.message || "Unknown error";
      this.logger.error(
        `Razorpay order creation failed for auctionId=${auctionId}: HTTP ${statusCode}, Code: ${errorCode}, Description: ${errorDescription}`
      );
      throw new BadRequestException(`Razorpay Order Creation Failed: ${errorCode}`);
    }
  }

  // 2. Verify Payment with Authorization, Idempotency, and Signature Checking
  async verifyPayment(
    userId: string,
    userRole: string,
    dto: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      auctionId: string;
      targetPlan: PlanTier;
    }
  ) {
    if (!dto.razorpayOrderId || !dto.razorpayPaymentId || !dto.razorpaySignature || !dto.auctionId || !dto.targetPlan) {
      throw new BadRequestException("Missing required payment verification fields");
    }

    // 🔒 Verify ownership before updating payment state
    await validateAuctionOwnership(
      this.prisma,
      dto.auctionId,
      userId,
      userRole
    );

    const secret = cleanCredential(
      process.env.RAZORPAY_KEY_SECRET ||
      this.configService.get<string>("razorpay.key_secret")
    );

    if (!secret) {
      this.logger.error("Payment configuration secret missing for signature verification");
      throw new BadRequestException("Payment configuration secret missing");
    }

    // Timing-safe HMAC SHA256 Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature);
    const providedBuf = Buffer.from(dto.razorpaySignature);

    const isValidSignature =
      expectedBuf.length === providedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, providedBuf);

    if (!isValidSignature) {
      this.logger.warn(`Invalid payment signature attempt for auctionId=${dto.auctionId}`);
      throw new BadRequestException("Invalid payment signature");
    }

    // Optional Provider-level verification check if Razorpay client is available
    if (this.razorpay?.payments?.fetch) {
      try {
        const payment = await this.razorpay.payments.fetch(dto.razorpayPaymentId);
        if (payment) {
          if (payment.status !== "captured" && payment.status !== "authorized") {
            throw new BadRequestException(`Payment status is ${payment.status}, expected captured`);
          }
          if (payment.order_id && payment.order_id !== dto.razorpayOrderId) {
            throw new BadRequestException("Payment does not match the generated order ID");
          }
          if (payment.currency && payment.currency !== "INR") {
            throw new BadRequestException("Invalid payment currency");
          }
        }
      } catch (err: any) {
        if (err instanceof BadRequestException || err?.name === "BadRequestException" || err?.status === 400) {
          throw err;
        }
        this.logger.warn(`Razorpay provider API lookup skipped/failed: ${err?.message}`);
      }
    }

    // 🔒 ATOMIC TRANSACTION WITH IDEMPOTENCY
    return this.prisma.prisma.$transaction(async (tx: any) => {
      const auction = await tx.auction.findUnique({
        where: { id: dto.auctionId },
      });

      if (!auction) throw new BadRequestException("Auction not found");

      // IDEMPOTENT HANDLING: If already processed with this payment ID and plan, return success
      if (
        auction.isPaid &&
        auction.planTier === dto.targetPlan &&
        auction.razorpayPaymentId === dto.razorpayPaymentId
      ) {
        this.logger.log(`Idempotent verify payment hit for auctionId=${dto.auctionId}`);
        return {
          success: true,
          message: "Payment already processed",
          alreadyProcessed: true,
          previousPlan: auction.planTier,
          currentPlan: auction.planTier,
          paidAmount: 0,
        };
      }

      const currentPlan = auction.planTier as PlanTier;
      const currentPrice = PLAN_LIMITS[currentPlan]?.price || 0;
      const targetPrice = PLAN_LIMITS[dto.targetPlan]?.price || 0;

      if (targetPrice <= currentPrice && auction.isPaid) {
        throw new BadRequestException("Plan downgrade not allowed");
      }

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

      this.logger.log(`Payment successfully verified and upgraded: auctionId=${dto.auctionId}, plan=${dto.targetPlan}`);

      return {
        success: true,
        message: "Payment verified & plan upgraded",
        previousPlan: currentPlan,
        currentPlan: dto.targetPlan,
        paidAmount: targetPrice - currentPrice,
      };
    });
  }

  // 3. Webhook Processing with Signature Verification & Idempotency
  async handleWebhook(signature: string, rawBody: string | Buffer, payload: any) {
    const webhookSecret = cleanCredential(
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      this.configService.get<string>("razorpay.key_secret") ||
      ""
    );

    if (!webhookSecret) {
      this.logger.warn("Webhook secret not configured, skipping webhook processing");
      throw new BadRequestException("Webhook configuration missing");
    }

    const bodyString = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(bodyString)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature);
    const providedBuf = Buffer.from(signature || "");

    const isMatch =
      expectedBuf.length === providedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, providedBuf);

    if (!isMatch) {
      this.logger.warn("Invalid webhook signature received");
      throw new BadRequestException("Invalid webhook signature");
    }

    const event = payload?.event;
    this.logger.log(`Processing Razorpay webhook event: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload?.payload?.payment?.entity;
      const orderEntity = payload?.payload?.order?.entity;

      const notes = paymentEntity?.notes || orderEntity?.notes || {};
      const auctionId = notes.auctionId;
      const targetPlan = notes.targetPlan as PlanTier;
      const paymentId = paymentEntity?.id;
      const orderId = paymentEntity?.order_id || orderEntity?.id;

      if (auctionId && targetPlan && paymentId) {
        return this.prisma.prisma.$transaction(async (tx: any) => {
          const auction = await tx.auction.findUnique({
            where: { id: auctionId },
          });

          if (!auction) {
            this.logger.warn(`Auction not found for webhook: ${auctionId}`);
            return { status: "ignored_not_found" };
          }

          // Idempotency: if already upgraded to targetPlan, acknowledge safely
          if (auction.isPaid && auction.planTier === targetPlan) {
            return { status: "already_processed" };
          }

          await tx.auction.update({
            where: { id: auctionId },
            data: {
              isPaid: true,
              planTier: targetPlan,
              razorpayOrderId: orderId || auction.razorpayOrderId,
              razorpayPaymentId: paymentId,
            },
          });

          this.logger.log(`Webhook successfully fulfilled upgrade: auctionId=${auctionId}, plan=${targetPlan}`);
          return { status: "success" };
        });
      }
    }

    return { status: "ignored" };
  }
}
