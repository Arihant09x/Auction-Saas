import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("feedback")
export class FeedbackController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(AuthGuard("firebase-jwt"))
  async submitFeedback(
    @Request() req: any,
    @Body() body: { rating: number; message: string },
  ) {
    const userId = req.user.id;

    // Check if already exists
    const existing = await this.prisma.prisma.feedback.findUnique({
      where: { userId },
    });
    if (existing) return { message: "Feedback already submitted" };

    return this.prisma.prisma.feedback.create({
      data: {
        userId,
        rating: body.rating,
        message: body.message,
      },
    });
  }

  // Check if user needs to give feedback
  @Get("check")
  @UseGuards(AuthGuard("firebase-jwt"))
  async checkFeedbackStatus(@Request() req: any) {
    const existing = await this.prisma.prisma.feedback.findUnique({
      where: { userId: req.user.id },
    });
    return { hasSubmitted: !!existing };
  }
}
