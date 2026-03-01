import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(
    userPayload: any,
    extraData?: { name?: string; city?: string; mobile?: string }
  ) {
    console.log("🔍 Service received payload:", userPayload);

    // SCENARIO 1: The Strategy already found the user in Postgres
    // (The payload has an 'id' and 'firebaseUid')
    if (userPayload.id && userPayload.firebaseUid) {
      console.log("✅ User exists in DB. Checking for updates...");

      // If the user sent new data (City/Mobile), update the profile
      if (extraData?.city || extraData?.mobile || extraData?.name) {
        return this.prisma.prisma.user.update({
          where: { id: userPayload.id },
          data: {
            city: extraData.city || userPayload.city,
            mobile: extraData.mobile || userPayload.mobile,
            name: extraData.name || userPayload.name,
          },
        });
      }
      return userPayload;
    }

    // SCENARIO 2: New User (Strategy couldn't find them in DB)
    // (The payload is raw Firebase data with 'uid')
    console.log("🆕 New User detected. Registering...");

    const { uid, email, picture, name: googleName } = userPayload;

    return this.prisma.prisma.user.create({
      data: {
        firebaseUid: uid, // Use 'uid' from Firebase
        email: email || "",
        name: extraData?.name || googleName || "User", // Prefer typed name, then Google name
        profileUrl: picture || null,
        city: extraData?.city || null,
        mobile: extraData?.mobile || null,
      },
    });
  }
}
