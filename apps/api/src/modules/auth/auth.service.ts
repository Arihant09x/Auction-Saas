import { Injectable, ConflictException, Logger, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import * as firebase from "firebase-admin";

export function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const cleaned = phone.trim();
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  if (/^\d{11,15}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return cleaned;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) { }

  async validateUser(
    userPayload: any,
    extraData?: { name?: string; city?: string; mobile?: string; email?: string; profileUrl?: string; password?: string; }
  ) {
    const decodedToken = userPayload.decodedToken || userPayload;
    const tokenPhoneNumber = normalizePhoneNumber(decodedToken.phone_number);
    const tokenEmailVerified = Boolean(decodedToken.email_verified);
    const signInProvider = decodedToken.firebase?.sign_in_provider || "email";

    // SCENARIO 1: The Strategy already found the user in Postgres
    if (userPayload.id && userPayload.firebaseUid) {
      if (extraData?.password && userPayload.password) {
        const isMatch = await bcrypt.compare(extraData.password, userPayload.password);
        if (!isMatch) {
          throw new UnauthorizedException('Invalid credentials');
        }
      }

      try {
        const updateData: any = {
          lastLoginAt: new Date(),
        };

        if (tokenEmailVerified && !userPayload.emailVerified) {
          updateData.emailVerified = true;
        }

        if (tokenPhoneNumber && !userPayload.phoneVerified) {
          updateData.phoneVerified = true;
          updateData.mobile = tokenPhoneNumber;
        }

        if (signInProvider && userPayload.authProvider !== signInProvider) {
          updateData.authProvider = signInProvider;
        }

        if (extraData?.city) updateData.city = extraData.city;
        if (extraData?.mobile && !userPayload.mobile) updateData.mobile = normalizePhoneNumber(extraData.mobile);
        if (extraData?.name) updateData.name = extraData.name;
        if (extraData?.profileUrl) updateData.profileUrl = extraData.profileUrl;

        const updatedUser = await this.prisma.prisma.user.update({
          where: { id: userPayload.id },
          data: updateData,
        });

        const userObj = { ...updatedUser };
        delete (userObj as any).password;
        return userObj;
      } catch (err: any) {
        this.handlePrismaError(err);
      }

      const userObj = { ...userPayload };
      delete userObj.password;
      delete userObj.decodedToken;
      return userObj;
    }

    // SCENARIO 2: New User (Strategy couldn't find them in DB)
    const uid = decodedToken.uid;
    const email = decodedToken.email || extraData?.email || "";
    const googleName = decodedToken.name;
    const picture = decodedToken.picture;

    if (!uid) {
      throw new UnauthorizedException("Invalid Firebase ID token");
    }

    try {
      this.logger.log(`Attempting to create user in DB for Firebase UID: ${uid}`);
      let hashedPassword = null;
      if (extraData?.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(extraData.password, salt);
      }

      const newUser = await this.prisma.prisma.user.create({
        data: {
          firebaseUid: uid,
          email: email,
          name: extraData?.name || googleName || (email ? email.split('@')[0] : "User"),
          profileUrl: extraData?.profileUrl || picture || null,
          city: extraData?.city || null,
          mobile: normalizePhoneNumber(extraData?.mobile) || tokenPhoneNumber || null,
          phoneVerified: Boolean(tokenPhoneNumber),
          emailVerified: tokenEmailVerified,
          authProvider: signInProvider,
          lastLoginAt: new Date(),
          password: hashedPassword,
          role: "USER" // Force role to USER for security
        },
      });

      this.logger.log(`User created successfully: ${newUser.id}`);
      const userObj = { ...newUser };
      delete (userObj as any).password;
      return userObj;
    } catch (err: any) {
      this.logger.warn(`Prisma error during user creation: ${err.code} - ${err.message}`);
      this.handlePrismaError(err);
    }
  }

  async verifyEmail(userPayload: any) {
    const decodedToken = userPayload.decodedToken || userPayload;
    const uid = decodedToken.uid || userPayload.firebaseUid;

    if (!uid) {
      throw new UnauthorizedException("Invalid authentication token");
    }

    let isEmailVerified = Boolean(decodedToken.email_verified);

    // Double check with Firebase Admin SDK if claims haven't refreshed yet
    if (!isEmailVerified) {
      try {
        const fbUser = await firebase.auth().getUser(uid);
        isEmailVerified = Boolean(fbUser.emailVerified);
      } catch (err) {
        this.logger.warn(`Firebase Admin lookup failed during email verification: ${err}`);
      }
    }

    if (!isEmailVerified) {
      throw new BadRequestException("Email has not been verified yet with Firebase. Please click the link sent to your email.");
    }

    const user = await this.prisma.prisma.user.findUnique({
      where: { firebaseUid: uid }
    });

    if (!user) {
      throw new NotFoundException("User account not found in database.");
    }

    const updated = await this.prisma.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        lastLoginAt: new Date(),
      }
    });

    const result = { ...updated };
    delete (result as any).password;
    return result;
  }

  async setPasswordForLoggedInUser(userPayload: any, newPassword: string) {
    const decodedToken = userPayload.decodedToken || userPayload;
    const uid = decodedToken.uid || userPayload.firebaseUid;

    if (!uid) {
      throw new UnauthorizedException("Invalid authentication token");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException("Password must be at least 6 characters long.");
    }

    const user = await this.prisma.prisma.user.findUnique({
      where: { firebaseUid: uid }
    });

    if (!user) {
      throw new NotFoundException("User account not found.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updated = await this.prisma.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        authProvider: user.authProvider === 'google.com' ? 'google+email' : user.authProvider || 'email',
      }
    });

    const result = { ...updated };
    delete (result as any).password;
    return result;
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
