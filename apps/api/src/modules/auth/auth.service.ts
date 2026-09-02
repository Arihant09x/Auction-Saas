import { Injectable, ConflictException, Logger, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) { }

  async validateUser(
    userPayload: any,
    extraData?: { name?: string; city?: string; mobile?: string; email?: string; profileUrl?: string; password?: string; }
  ) {
    // SCENARIO 1: The Strategy already found the user in Postgres
    // (The payload has an 'id' and 'firebaseUid')
    if (userPayload.id && userPayload.firebaseUid) {
      if (extraData?.password && userPayload.password) {
        const isMatch = await bcrypt.compare(extraData.password, userPayload.password);
        if (!isMatch) {
          throw new UnauthorizedException('Invalid credentials');
        }
      }

      // If the user sent new data (City/Mobile/Profile Picture), update the profile
      if (extraData?.city || extraData?.mobile || extraData?.name || extraData?.profileUrl) {
        try {
          const updatedUser = await this.prisma.prisma.user.update({
            where: { id: userPayload.id },
            data: {
              city: extraData.city || userPayload.city,
              mobile: extraData.mobile || userPayload.mobile,
              name: extraData.name || userPayload.name,
              profileUrl: extraData.profileUrl || userPayload.profileUrl,
            },
          });
          delete (updatedUser as any).password;
          return updatedUser;
        } catch (err: any) {
          this.handlePrismaError(err);
        }
      }
      delete userPayload.password;
      return userPayload;
    }

    // SCENARIO 2: New User (Strategy couldn't find them in DB)
    const { uid, email, picture, name: googleName } = userPayload;

    try {
      this.logger.log(`Attempting to create user in DB: ${extraData?.email || email}`);
      let hashedPassword = null;
      if (extraData?.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(extraData.password, salt);
      }

      const newUser = await this.prisma.prisma.user.create({
        data: {
          firebaseUid: uid,
          email: extraData?.email || email || "",
          name: extraData?.name || googleName || "User",
          profileUrl: extraData?.profileUrl || picture || null,
          city: extraData?.city || null,
          mobile: extraData?.mobile || null,
          password: hashedPassword, // Optional for Firebase email auth
          role: "USER" // Force role to USER for security
        },
      });
      this.logger.log(`User created successfully: ${newUser.id}`);
      delete (newUser as any).password;
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
  // New methods for email/password registration and login
  async registerWithPassword(email: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.prisma.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0] || "User",
        firebaseUid: "local_" + Date.now().toString(),
        role: 'USER',
      },
    });
    delete (user as any).password;
    return user;
  }

  async loginWithPassword(email: string, password: string) {
    const user = await this.prisma.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
