import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import * as XLSX from "xlsx";
import { Multer } from "multer";

import {
  PLAN_LIMITS,
  REQUIRED_EXCEL_HEADERS,
} from "../../common/constants/plan-limits";
import {
  PlayerRole,
  PlayerStatus,
  PlanTier,
} from "../../../../../packages/database/dist/generated/index";
@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePlayerDto) {
    // 1. Verify Auction Ownership
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: dto.auctionId },
    });

    if (!auction) throw new NotFoundException("Auction not found");
    if (auction.organizerId !== userId) {
      throw new ForbiddenException("You do not own this auction");
    }

    // 2. Determine Base Price Logic
    let finalBasePrice = dto.basePrice;

    // If no specific price given, try to fetch from Category
    if (!finalBasePrice && dto.categoryId) {
      const category = await this.prisma.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (category && category.baseBid) {
        finalBasePrice = Number(category.baseBid);
      }
    }

    // Fallback: Use Auction Minimum Bid
    if (!finalBasePrice) {
      finalBasePrice = Number(auction.minBid);
    }
    const planLimit = PLAN_LIMITS[auction.planTier as PlanTier].totalPlayers;

    const currentCount = await this.prisma.prisma.player.count({
      where: { auctionId: dto.auctionId },
    });

    if (currentCount >= planLimit) {
      throw new BadRequestException(
        `Player limit reached for ${auction.planTier} plan (${planLimit}). Please upgrade.`
      );
    }

    // 3. Create Player
    return this.prisma.prisma.player.create({
      data: {
        auctionId: dto.auctionId,
        categoryId: dto.categoryId || null, // Allow NULL

        name: dto.name!,
        mobile: dto.mobile!,
        fatherName: dto.fatherName ?? null,
        age: dto.age!,
        tshirtSize: dto.tshirtSize ?? null,
        trouserSize: dto.trouserSize ?? null,

        role: dto.role!,
        // We store the style data in the Dynamic JSON field (or specific columns if you kept them)
        // Assuming we use the specific columns from your Schema v2:
        battingStyle: dto.battingStyle ?? null,
        bowlingStyle: dto.bowlingStyle ?? null,

        basePrice: finalBasePrice ?? null,
        status: "UPCOMING",
      },
    });
  }
  async previewBulkUpload(
    userId: string,
    auctionId: string,
    file: Express.Multer.File
  ) {
    // A. Basic Ownership Check
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction || auction.organizerId !== userId)
      throw new ForbiddenException("Invalid Auction");

    // B. Parse File (Supports CSV & Excel)
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new BadRequestException("Excel file has no sheets");
    }

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new BadRequestException("Invalid worksheet");
    }
    const rawData = XLSX.utils.sheet_to_json<any>(worksheet, { defval: "" }); // defval ensures empty cells aren't undefined
    if (rawData.length === 0) throw new BadRequestException("File is empty");

    // We look at the first row's keys to find what the user actually typed
    const actualHeaders = Object.keys(rawData[0]);
    // C. Header Validation
    // Helper to find the actual header key (Case Insensitive + Trimmed)
    // e.g., if we want "Mobile", this finds "mobile ", "MOBILE", "Mobile"
    const findHeader = (required: string) => {
      return actualHeaders.find(
        (h) => h.trim().toLowerCase() === required.toLowerCase()
      );
    };

    // Map your REQUIRED_EXCEL_HEADERS to the actual headers in the file
    // You define this list in your constants file
    // const requiredList = ["Name", "Age", "Mobile", "Specification 1"];

    const missingHeaders: any[] = [];
    const headerMap: Record<string, string> = {}; // Stores { "Age": "age", "Mobile": "MOBILE" }

    REQUIRED_EXCEL_HEADERS.forEach((req) => {
      const found = findHeader(req);
      if (!found) {
        missingHeaders.push(req);
      } else {
        headerMap[req] = found; // Save the mapping
      }
    });
    if (missingHeaders.length > 0) {
      throw new BadRequestException(
        `Missing required columns: ${missingHeaders.join(", ")}`
      );
    }

    // D. Fetch Constraints (Existing Players & Categories)
    const existingPlayers = await this.prisma.prisma.player.findMany({
      where: { auctionId },
      select: { mobile: true, name: true },
    });

    // Create Set for O(1) duplicate checking
    // Format: "NAME|MOBILE"
    const existingSet = new Set(
      existingPlayers.map((p: any) => `${p.name.toLowerCase()}|${p.mobile}`)
    );

    // Check Plan Limits
    const plan = auction.planTier as keyof typeof PLAN_LIMITS;
    const planLimit = PLAN_LIMITS[plan]?.totalPlayers || 100;
    if (existingPlayers.length + rawData.length > planLimit) {
      throw new BadRequestException(
        `Plan Limit Exceeded! Your ${auction.planTier} plan allows only ${planLimit} players. ` +
          `You already have ${existingPlayers.length} players. Cannot add ${rawData.length} more players.`
      );
    }

    // E. Process Rows & Validate
    const validRows: any[] = [];
    const invalidRows: any[] = [];

    // Helper to fetch categories (Optimization: Do this once, not per row)
    const categories = await this.prisma.prisma.category.findMany({
      where: { auctionId },
    });
    const categoryMap = new Map(
      categories.map((c: any) => [c.name.toUpperCase(), c.id])
    );

    rawData.forEach((row: any, index) => {
      const errors = [];

      // 1. Data Cleaning
      const name = row[headerMap["Name"]!]?.toString().trim();
      const mobile = row[headerMap["Mobile"]!]?.toString().trim();
      const roleRaw = row[headerMap["Specification 1"]!]
        ?.toString()
        .trim()
        .toUpperCase();

      // 2. Validation Checks
      if (!name) errors.push("Name is required");
      if (!mobile) errors.push("Mobile is required");

      // 3. Duplicate Check (In DB)
      if (existingSet.has(`${name?.toLowerCase()}|${mobile}`)) {
        errors.push("Duplicate: Player already exists in auction");
      }

      // 4. Duplicate Check (In File - check if duplicates exist within the uploaded file itself)
      const isDuplicateInFile = validRows.find(
        (r) => r.name === name && r.mobile === mobile
      );
      if (isDuplicateInFile)
        errors.push("Duplicate: Listed twice in this file");

      // 5. Category Mapping
      let categoryId = null;
      if (categoryMap.has(roleRaw)) {
        categoryId = categoryMap.get(roleRaw);
      } else {
        // Partial match logic
        for (const [catName, catId] of categoryMap.entries()) {
          if (roleRaw.includes(catName)) {
            categoryId = catId;
            break;
          }
        }
      }

      // 6. Construct Data Object
      const playerObj = {
        rowNumber: index + 2,

        name,
        mobile,

        role: this.mapRoleToEnum(roleRaw, auction.sportsType),
        categoryId,

        basePrice: row[headerMap["Base Value (if different)"]!]
          ? Number(row[headerMap["Base Value (if different)"]!])
          : Number(auction.minBid),

        // Playing styles
        battingStyle: row[headerMap["Specification 2"]!] || null,
        bowlingStyle: row[headerMap["Specification 3"]!] || null,

        // Jersey & clothing (OPTIONAL SAFE MAPPING)
        jerseyNumber: row[headerMap["Jersay No."]!]
          ? Number(row[headerMap["Jersay No."]!])
          : null,
        jerseyName: row[headerMap["Jersay Name"]!] || null,
        tshirtSize: row[headerMap["T-Shirt"]!] || null,
        trouserSize: row[headerMap["Trouser"]!] || null,

        // Personal
        profilePic: row[headerMap["Profile_url"]!] || null,
        age: row[headerMap["Age"]!] ? Number(row[headerMap["Age"]!]) : 18,

        status: PlayerStatus.UPCOMING,
      };

      if (errors.length > 0) {
        invalidRows.push({ ...playerObj, errors });
      } else {
        validRows.push(playerObj);
      }
    });

    return {
      totalRows: rawData.length,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      canProceed: invalidRows.length === 0, // Frontend should only enable "Confirm" if this is true
      previewData: validRows, // Send this back to frontend to show table
      errors: invalidRows, // Show these in red
      plan: auction.planTier,
      planLimit,
      existingPlayers: existingPlayers.length,
    };
  }

  // 2. CONFIRM STAGE (Transactional Insert)
  // ==========================================================
  async confirmBulkUpload(
    userId: string,
    auctionId: string,
    playersData: any[]
  ) {
    // Re-Verify Ownership
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction || auction.organizerId !== userId)
      throw new ForbiddenException("Invalid Auction");

    // Transactional Insert (Rollback if any fail)
    return this.prisma.prisma.$transaction(async (tx: any) => {
      // We use createMany for performance
      // Note: Prisma createMany doesn't support nested relations (like JSON details) well in some DBs,
      // but for Postgres it is fine if structure matches.

      // However, since we have mapped JSON fields, we need to map the array carefully
      const formattedData = playersData.map((p) => ({
        auctionId,
        categoryId: p.categoryId ?? null,

        name: p.name,
        mobile: p.mobile ?? null,
        age: p.age,

        fatherName: p.fatherName ?? null,
        profilePic: p.profilePic ?? null,

        role: p.role,
        battingStyle: p.battingStyle ?? null,
        bowlingStyle: p.bowlingStyle ?? null,

        tshirtSize: p.tshirtSize ?? null,
        trouserSize: p.trouserSize ?? null,
        jerseyName: p.jerseyName ?? null,
        jerseyNumber: p.jerseyNumber ?? null,

        basePrice: Number(p.basePrice),
        status: PlayerStatus.UPCOMING,
      }));

      const result = await tx.player.createMany({
        data: formattedData,
        skipDuplicates: true, // Safety net
      });

      return { success: true, count: result.count, result: result };
    });
  }
  // Helper
  private mapRoleToEnum(roleRaw: string, sportType: string): PlayerRole {
    if (!roleRaw) return PlayerRole.OTHER;

    const role = roleRaw.toUpperCase();

    // 🏏 CRICKET
    if (sportType === "Cricket") {
      if (role.includes("BATSMAN")) return PlayerRole.BATSMAN;
      if (role.includes("BOWLER")) return PlayerRole.BOWLER;
      if (role.includes("KEEPER")) return PlayerRole.WICKET_KEEPER;
      if (role.includes("ALL")) return PlayerRole.ALL_ROUNDER;
      return PlayerRole.OTHER;
    }

    // ⚽ FOOTBALL
    if (sportType === "Football") {
      if (role.includes("GOAL")) return PlayerRole.GOALKEEPER;
      if (role.includes("DEFENDER")) return PlayerRole.DEFENDER;
      if (role.includes("MID")) return PlayerRole.MIDFIELDER;
      if (role.includes("FORWARD") || role.includes("STRIKER"))
        return PlayerRole.FORWARD;
      return PlayerRole.OTHER;
    }

    // 🏐 VOLLEYBALL (Generic roles)
    if (sportType === "Volleyball") {
      return PlayerRole.OTHER; // positions vary widely → keep generic
    }

    return PlayerRole.OTHER;
  }
  async bulkUpload(
    userId: string,
    auctionId: string,
    file: Express.Multer.File
  ) {
    // 1. Verify Ownership
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction || auction.organizerId !== userId)
      throw new ForbiddenException("Invalid Auction");

    // 2. GET EXISTING CATEGORIES (The "Smart" Step)
    // We fetch the categories you auto-created earlier (Batsman, Bowler, etc.)
    const categories = await this.prisma.prisma.category.findMany({
      where: { auctionId },
    });

    // Create a Lookup Dictionary for speed
    // Example: { "BATSMAN": "uuid-123", "BOWLER": "uuid-456" }
    const categoryMap = new Map();
    categories.forEach((cat: any) => {
      // Normalize to UPPERCASE to avoid case-sensitive errors
      categoryMap.set(cat.name.toUpperCase().trim(), cat.id);
    });

    // 3. Parse Excel
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new BadRequestException("Excel file has no sheets");
    }

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new BadRequestException("Invalid worksheet");
    }
    const rawData = XLSX.utils.sheet_to_json<any>(worksheet);

    // 4. Process Every Row
    const playersToCreate = rawData.map((row: any) => {
      // A. EXTRACT ROLE (Specification 1)
      // Excel might have "Batsman", "Right Hand Batsman", "All Rounder"
      const excelRole = row["Specification 1"]
        ? String(row["Specification 1"]).trim()
        : "";
      const excelRoleUpper = excelRole.toUpperCase();

      // B. AUTO-ASSIGN CATEGORY ID
      let matchedCategoryId = null;

      // Logic: Check if Excel Role matches our DB Category Name
      if (categoryMap.has(excelRoleUpper)) {
        matchedCategoryId = categoryMap.get(excelRoleUpper);
      }
      // Fallback: If no exact match, try to find a partial match
      // e.g. Excel: "Opening Batsman" -> DB: "Batsman"
      else {
        for (const [catName, catId] of categoryMap.entries()) {
          if (excelRoleUpper.includes(catName)) {
            matchedCategoryId = catId;
            break;
          }
        }
      }

      // C. MAP ENUM ROLE
      // Your DB needs a strict Enum (BATSMAN, BOWLER). We map the string to the Enum.
      let dbRole: PlayerRole = PlayerRole.ALL_ROUNDER; // Default
      if (excelRoleUpper.includes("BATSMAN")) dbRole = PlayerRole.BATSMAN;
      else if (excelRoleUpper.includes("BOWLER")) dbRole = PlayerRole.BOWLER;
      else if (excelRoleUpper.includes("KEEPER"))
        dbRole = PlayerRole.WICKET_KEEPER;

      // D. RETURN THE PLAYER OBJECT
      return {
        auctionId,
        categoryId: matchedCategoryId, // <--- HERE is the auto-assignment

        name: row["Name"],
        mobile: row["Mobile"] ? String(row["Mobile"]) : null,
        age: row["Age"] ? Number(row["Age"]) : 18,

        // Map the Specifications (from your screenshot)
        role: dbRole,

        // Storing styles in a JSON field (or specific columns if you have them)
        // Specification 2 -> Batting Style (e.g., Right Hand Batsman)
        // Specification 3 -> Bowling Style (e.g., Right Arm Bowler)
        sportSpecificDetails: {
          battingStyle: row["Specification 2"],
          bowlingStyle: row["Specification 3"],
          jerseyNo: row["Jersay No."],
          jerseyName: row["Jersay Name"],
        },

        tshirtSize: row["T-Shirt"],
        trouserSize: row["Trouser"],

        // Base Price logic (Use column, or default to Auction Min Bid)
        basePrice: row["Base Value (if different)"]
          ? Number(row["Base Value (if different)"])
          : Number(auction.minBid),

        status: PlayerStatus.UPCOMING,
      };
    });

    // 5. Bulk Insert into Database
    // Note: We use createMany. If you have "sportSpecificDetails" as a JSON column, this works perfect.
    // If it's separate columns, just map them directly above.
    return this.prisma.prisma.player.createMany({
      data: playersToCreate,
      skipDuplicates: true, // Avoid inserting duplicates based on unique constraints
    });
  }

  // Get Players (Filter by Category is optional)
  async findAll(auctionId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // 1. Get Data
    const players = await this.prisma.prisma.player.findMany({
      where: { auctionId },
      orderBy: { name: "asc" },
      include: { category: true },
      take: limit, // Only take 20
      skip: skip, // Skip the previous pages
    });

    // 2. Get Total Count (For frontend to show "Page 1 of 50")
    const total = await this.prisma.prisma.player.count({
      where: { auctionId },
    });

    return {
      data: players,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async update(id: string, userId: string, dto: UpdatePlayerDto) {
    // 1. Fetch player with auction
    const player = await this.prisma.prisma.player.findUnique({
      where: { id },
      include: { auction: true },
    });

    if (!player) throw new NotFoundException("Player not found");
    if (player.auction.organizerId !== userId) {
      throw new ForbiddenException("You do not own this auction");
    }

    // 2. Prepare update data dynamically
    const updateData: any = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.mobile !== undefined) updateData.mobile = dto.mobile;
    if (dto.fatherName !== undefined) updateData.fatherName = dto.fatherName;
    if (dto.age !== undefined) updateData.age = dto.age;

    if (dto.tshirtSize !== undefined) updateData.tshirtSize = dto.tshirtSize;
    if (dto.trouserSize !== undefined) updateData.trouserSize = dto.trouserSize;

    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.battingStyle !== undefined)
      updateData.battingStyle = dto.battingStyle;
    if (dto.bowlingStyle !== undefined)
      updateData.bowlingStyle = dto.bowlingStyle;

    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;

    if (dto.basePrice !== undefined) updateData.basePrice = dto.basePrice;

    // 3. Update player
    return this.prisma.prisma.player.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    const player = await this.prisma.prisma.player.findUnique({
      where: { id },
      include: { auction: true },
    });
    if (!player || player.auction.organizerId !== userId) {
      throw new ForbiddenException("Cannot delete this player");
    }
    return this.prisma.prisma.player.delete({ where: { id } });
  }
}
