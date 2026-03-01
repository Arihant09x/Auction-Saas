//Database, Redis, Stripe keys
import "dotenv/config";
export default () => ({
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  },
  razorpay: {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  },
});
