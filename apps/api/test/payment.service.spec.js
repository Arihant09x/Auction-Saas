const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { PaymentService } = require("../dist/modules/payment/payment.service.js");

// Mock Config & Prisma
function createMockPrisma() {
  const auctions = new Map();

  return {
    prisma: {
      auction: {
        findUnique: async ({ where }) => {
          const a = auctions.get(where.id);
          return a ? { ...a } : null;
        },
        update: async ({ where, data }) => {
          const current = auctions.get(where.id);
          if (!current) throw new Error("Auction not found");
          const updated = { ...current, ...data };
          auctions.set(where.id, updated);
          return updated;
        },
      },
      $transaction: async (cb) => {
        return cb({
          auction: {
            findUnique: async ({ where }) => {
              const a = auctions.get(where.id);
              return a ? { ...a } : null;
            },
            update: async ({ where, data }) => {
              const current = auctions.get(where.id);
              if (!current) throw new Error("Auction not found");
              const updated = { ...current, ...data };
              auctions.set(where.id, updated);
              return updated;
            },
          },
        });
      },
    },
    _setAuction: (id, data) => auctions.set(id, data),
    _getAuction: (id) => auctions.get(id),
  };
}

const mockConfigService = {
  get: (key) => {
    if (key === "razorpay.key_secret") return "test_secret_123";
    return null;
  },
};

test("Payment Hardening Test Suite", async (t) => {
  process.env.RAZORPAY_KEY_ID = "rzp_test_123";
  process.env.RAZORPAY_KEY_SECRET = "test_secret_123";
  process.env.RAZORPAY_WEBHOOK_SECRET = "test_webhook_secret_123";

  await t.test("1. Successful order creation with prorated server-side pricing", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-1", {
      id: "auc-1",
      organizerId: "user-1",
      planTier: "BASIC",
      isPaid: true,
    });

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = {
      orders: {
        create: async (opts) => ({
          id: "order_test_999",
          amount: opts.amount,
          currency: opts.currency,
        }),
      },
    };

    const order = await service.createOrder("user-1", "USER", "auc-1", "PREMIUM");
    assert.equal(order.orderId, "order_test_999");
    assert.equal(order.currency, "INR");
    assert.ok(order.amount > 0);
  });

  await t.test("2. Rejects unauthorized / wrong ownership order creation", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-1", {
      id: "auc-1",
      organizerId: "user-real-owner",
      planTier: "FREE",
      isPaid: false,
    });

    const service = new PaymentService(mockConfigService, mockPrisma);

    await assert.rejects(
      async () => {
        await service.createOrder("user-attacker", "USER", "auc-1", "STANDARD");
      },
      { name: "ForbiddenException" }
    );
  });

  await t.test("3. Rejects downgrade or paying for Free plan", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-1", {
      id: "auc-1",
      organizerId: "user-1",
      planTier: "PREMIUM",
      isPaid: true,
    });

    const service = new PaymentService(mockConfigService, mockPrisma);

    await assert.rejects(
      async () => {
        await service.createOrder("user-1", "USER", "auc-1", "FREE");
      },
      { name: "BadRequestException" }
    );

    await assert.rejects(
      async () => {
        await service.createOrder("user-1", "USER", "auc-1", "BASIC");
      },
      { name: "BadRequestException" }
    );
  });

  await t.test("4. Rejects invalid payment signature", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-1", {
      id: "auc-1",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    const service = new PaymentService(mockConfigService, mockPrisma);

    await assert.rejects(
      async () => {
        await service.verifyPayment("user-1", "USER", {
          auctionId: "auc-1",
          razorpayOrderId: "order_1",
          razorpayPaymentId: "pay_1",
          razorpaySignature: "invalid_tampered_signature_hex",
          targetPlan: "STANDARD",
        });
      },
      { name: "BadRequestException" }
    );
  });

  await t.test("5. Mismatched order/payment rejected when verified against provider", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-1", {
      id: "auc-1",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    const secret = "test_secret_123";
    const orderId = "order_abc";
    const paymentId = "pay_xyz";
    const validSig = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = {
      payments: {
        fetch: async () => ({
          status: "captured",
          order_id: "order_different_mismatch",
          currency: "INR",
        }),
      },
    };

    await assert.rejects(
      async () => {
        await service.verifyPayment("user-1", "USER", {
          auctionId: "auc-1",
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: validSig,
          targetPlan: "STANDARD",
        });
      },
      { name: "BadRequestException" }
    );
  });

  await t.test("6. Duplicate verification is idempotent and does not fail", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-1", {
      id: "auc-1",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    const secret = "test_secret_123";
    const orderId = "order_100";
    const paymentId = "pay_100";
    const validSig = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = {
      payments: {
        fetch: async () => ({
          status: "captured",
          order_id: orderId,
          currency: "INR",
        }),
      },
    };

    // First call: upgrades
    const firstRes = await service.verifyPayment("user-1", "USER", {
      auctionId: "auc-1",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: validSig,
      targetPlan: "STANDARD",
    });
    assert.equal(firstRes.success, true);
    assert.equal(firstRes.currentPlan, "STANDARD");

    // Second call: idempotent success
    const secondRes = await service.verifyPayment("user-1", "USER", {
      auctionId: "auc-1",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: validSig,
      targetPlan: "STANDARD",
    });
    assert.equal(secondRes.success, true);
    assert.equal(secondRes.alreadyProcessed, true);
  });

  await t.test("7. Webhook verification & repeated delivery idempotency", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-wh-1", {
      id: "auc-wh-1",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    const service = new PaymentService(mockConfigService, mockPrisma);
    const webhookSecret = "test_webhook_secret_123";

    const payload = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_wh_123",
            order_id: "order_wh_123",
            notes: {
              auctionId: "auc-wh-1",
              targetPlan: "PREMIUM",
            },
          },
        },
      },
    };

    const rawBody = JSON.stringify(payload);
    const validWebhookSig = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

    // First webhook delivery
    const res1 = await service.handleWebhook(validWebhookSig, rawBody, payload);
    assert.equal(res1.status, "success");
    const updated = mockPrisma._getAuction("auc-wh-1");
    assert.equal(updated.isPaid, true);
    assert.equal(updated.planTier, "PREMIUM");

    // Repeated webhook delivery
    const res2 = await service.handleWebhook(validWebhookSig, rawBody, payload);
    assert.equal(res2.status, "already_processed");
  });

  await t.test("8. Webhook rejects invalid signature", async () => {
    const mockPrisma = createMockPrisma();
    const service = new PaymentService(mockConfigService, mockPrisma);

    await assert.rejects(
      async () => {
        await service.handleWebhook("bad_signature", "{}", {});
      },
      { name: "BadRequestException" }
    );
  });

  await t.test("9. Pending or failed payment status rejected", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-fail", {
      id: "auc-fail",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    const secret = "test_secret_123";
    const orderId = "order_fail";
    const paymentId = "pay_fail";
    const validSig = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = {
      payments: {
        fetch: async () => ({
          status: "failed",
          order_id: orderId,
        }),
      },
    };

    await assert.rejects(
      async () => {
        await service.verifyPayment("user-1", "USER", {
          auctionId: "auc-fail",
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: validSig,
          targetPlan: "STANDARD",
        });
      },
      { name: "BadRequestException" }
    );
  });

  await t.test("10. Provider API timeout resilience (HMAC fallback works)", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-timeout", {
      id: "auc-timeout",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    const secret = "test_secret_123";
    const orderId = "order_to";
    const paymentId = "pay_to";
    const validSig = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = {
      payments: {
        fetch: async () => {
          throw new Error("Provider Gateway Timeout");
        },
      },
    };

    // Should succeed via timing-safe HMAC fallback
    const res = await service.verifyPayment("user-1", "USER", {
      auctionId: "auc-timeout",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: validSig,
      targetPlan: "STANDARD",
    });
    assert.equal(res.success, true);
    assert.equal(res.currentPlan, "STANDARD");
  });

  await t.test("11. Database transaction rollback on failure", async () => {
    const mockPrisma = {
      prisma: {
        auction: {
          findUnique: async () => ({ id: "auc-err", organizerId: "user-1", planTier: "FREE", isPaid: false }),
        },
        $transaction: async () => {
          throw new Error("Database deadlocked or connection lost");
        },
      },
    };

    const secret = "test_secret_123";
    const orderId = "order_err";
    const paymentId = "pay_err";
    const validSig = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = null;

    await assert.rejects(
      async () => {
        await service.verifyPayment("user-1", "ADMIN", {
          auctionId: "auc-err",
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: validSig,
          targetPlan: "STANDARD",
        });
      },
      { message: "Database deadlocked or connection lost" }
    );
  });

  await t.test("12. Whitespace trimming in credentials handles trailing spaces cleanly", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-ws-1", {
      id: "auc-ws-1",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    // Simulate environment variables with accidental trailing whitespace (as found in production)
    process.env.RAZORPAY_KEY_ID = "rzp_test_TkbOvMnnEzPIq3   ";
    process.env.RAZORPAY_KEY_SECRET = "cP5VZVRDLlpTN76D5wUPUScK  ";

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = {
      orders: {
        create: async (opts) => ({
          id: "order_ws_123",
          amount: opts.amount,
          currency: opts.currency,
        }),
      },
    };

    const order = await service.createOrder("user-1", "USER", "auc-ws-1", "STANDARD");
    assert.equal(order.key_id, "rzp_test_TkbOvMnnEzPIq3", "key_id should be trimmed of trailing spaces");

    // Also verify signature calculation with trimmed secret
    const orderId = "order_ws_123";
    const paymentId = "pay_ws_456";
    // Clean secret
    const validSig = crypto.createHmac("sha256", "cP5VZVRDLlpTN76D5wUPUScK").update(`${orderId}|${paymentId}`).digest("hex");

    const res = await service.verifyPayment("user-1", "USER", {
      auctionId: "auc-ws-1",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: validSig,
      targetPlan: "STANDARD",
    });
    assert.equal(res.success, true);
  });

  await t.test("13. Failed order creation logs safe provider diagnostic details and throws formatted exception", async () => {
    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-err-1", {
      id: "auc-err-1",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = {
      orders: {
        create: async () => {
          const err = new Error("Authentication failed");
          err.statusCode = 401;
          err.error = { code: "BAD_REQUEST_ERROR", description: "The key_id or key_secret provided is invalid" };
          throw err;
        },
      },
    };

    await assert.rejects(
      async () => {
        await service.createOrder("user-1", "USER", "auc-err-1", "STANDARD");
      },
      (err) => {
        assert.equal(err.name, "BadRequestException");
        assert.ok(err.message.includes("BAD_REQUEST_ERROR"), `Expected error to contain code, got: ${err.message}`);
        return true;
      }
    );
  });

  await t.test("14. cleanCredential strips Docker-injected quotes and handles surrounding quotes cleanly", async () => {
    const { cleanCredential } = require("../dist/modules/payment/payment.service.js");
    assert.equal(cleanCredential('"rzp_test_TkbOvMnnEzPIq3"'), "rzp_test_TkbOvMnnEzPIq3");
    assert.equal(cleanCredential("'cP5VZVRDLlpTN76D5wUPUScK'"), "cP5VZVRDLlpTN76D5wUPUScK");
    assert.equal(cleanCredential('  "rzp_test_123"  '), "rzp_test_123");
    assert.equal(cleanCredential('""double_quoted""'), "double_quoted");
    assert.equal(cleanCredential(undefined), "");
    assert.equal(cleanCredential(null), "");

    const mockPrisma = createMockPrisma();
    mockPrisma._setAuction("auc-quote-1", {
      id: "auc-quote-1",
      organizerId: "user-1",
      planTier: "FREE",
      isPaid: false,
    });

    // Simulate Docker --env-file preserving quotes literally
    process.env.RAZORPAY_KEY_ID = '"rzp_test_TkbOvMnnEzPIq3"';
    process.env.RAZORPAY_KEY_SECRET = '"cP5VZVRDLlpTN76D5wUPUScK"';

    const service = new PaymentService(mockConfigService, mockPrisma);
    service.razorpay = {
      orders: {
        create: async (opts) => ({
          id: "order_quote_123",
          amount: opts.amount,
          currency: opts.currency,
        }),
      },
    };

    const order = await service.createOrder("user-1", "USER", "auc-quote-1", "STANDARD");
    assert.equal(order.key_id, "rzp_test_TkbOvMnnEzPIq3", "key_id must not contain literal quotes");
  });
});

