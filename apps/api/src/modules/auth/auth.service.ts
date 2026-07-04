import { Injectable, ConflictException, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  async validateUser(
    userPayload: any,
    extraData?: { name?: string; city?: string; mobile?: string; email?: string; profileUrl?: string; password?: string; }
  ) {
    // SCENARIO 1: The Strategy already found the user in Postgres
    // (The payload has an 'id' and 'firebaseUid')
    if (userPayload.id && userPayload.firebaseUid) {
      // If the user sent new data (City/Mobile/Profile Picture), update the profile
      if (extraData?.city || extraData?.mobile || extraData?.name || extraData?.profileUrl) {
        try {
          return await this.prisma.prisma.user.update({
            where: { id: userPayload.id },
            data: {
              city: extraData.city || userPayload.city,
              mobile: extraData.mobile || userPayload.mobile,
              name: extraData.name || userPayload.name,
              profileUrl: extraData.profileUrl || userPayload.profileUrl,
            },
          });
        } catch (err: any) {
          this.handlePrismaError(err);
        }
      }
      return userPayload;
    }

    // SCENARIO 2: New User (Strategy couldn't find them in DB)
    const { uid, email, picture, name: googleName } = userPayload;

    try {
      this.logger.log(`Attempting to create user in DB: ${extraData?.email || email}`);
      const newUser = await this.prisma.prisma.user.create({
        data: {
          firebaseUid: uid,
          email: extraData?.email || email || "",
          name: extraData?.name || googleName || "User",
          profileUrl: extraData?.profileUrl || picture || null,
          city: extraData?.city || null,
          mobile: extraData?.mobile || null,
          password: extraData?.password || null, // Optional for Firebase email auth
          role: "USER" // Force role to USER for security
        },
      });
      this.logger.log(`User created successfully: ${newUser.id}`);
      return newUser;
    } catch (err: any) {
      this.logger.warn(`Prisma error during user creation: ${err.code} - ${err.message}`);
      this.handlePrismaError(err);
    }
  }

  private handlePrismaError(err: any) {
    if (err.code === "P2002") {
      const target = err.meta?.target || [];
      const field = Array.isArray(target) ? target[0] : "field";
      this.logger.warn(`Unique constraint violation on field: ${field}`);
      
      const message = field === "mobile" 
        ? "This mobile number is already registered with another account."
        : field === "email" 
          ? "This email address is already in use." 
          : `This ${field} is already in use.`;
      
      throw new ConflictException(message);
    }
    throw err;
  }
}
