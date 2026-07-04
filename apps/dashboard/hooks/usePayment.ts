import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth.store";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const usePayment = (auctionId: string) => {
  const { firebaseToken } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const createOrder = async (planTier: string) => {
    if (!firebaseToken) {
      toast.error("Please log in to continue with the payment.");
      return null;
    }

    try {
      const res = await fetch(`${apiUrl}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({ auctionId, planTier }),
      });

      const result = await res.json();
      const data = result.data || result;

      if (!res.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      return data;
    } catch (error: any) {
      toast.error("We're having trouble connecting to the payment system. Please try again.", { id: "payment-error" });
      return null;
    }
  };

  const verifyPayment = async (paymentData: RazorpayResponse, targetPlan: string) => {
    if (!firebaseToken) return { success: false, message: "No auth token" };

    try {
      const res = await fetch(`${apiUrl}/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({
          razorpayOrderId: paymentData.razorpay_order_id,
          razorpayPaymentId: paymentData.razorpay_payment_id,
          razorpaySignature: paymentData.razorpay_signature,
          auctionId,
          targetPlan,
        }),
      });

      const result = await res.json();
      const data = result.data || result;

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Payment Verification Error:", error);
      return { success: false, message: error.message };
    }
  };

  return {
    createOrder,
    verifyPayment,
    isProcessing,
    setIsProcessing,
  };
};
