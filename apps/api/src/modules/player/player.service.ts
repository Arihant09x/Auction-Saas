import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { PrismaService } from "../../prisma/prisma.service";
import Redis from "ioredis";
import { REDIS_CLIENT } from "../../redis/redis.provider";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import * as XLSX from "xlsx";
import { Multer } from "multer";
import { isAdminOrOwner } from "../../common/helpers/ownership.helper";

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
  constructor(
    private prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) { }

  async create(userId: string, userRole: string, dto: CreatePlayerDto) {
    // 1. Verify Auction Ownership
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: dto.auctionId },
    });

    if (!auction) throw new NotFoundException("Auction not found");
    if (!isAdminOrOwner(auction.organizerId, userId, userRole)) {
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
    const player = await this.prisma.prisma.player.create({
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

        profilePic: dto.profilePic ?? null,

        basePrice: finalBasePrice ?? null,
        status: "UPCOMING",
      },
    });

    await this.redis.del(`auction:${dto.auctionId}:settings`, `auction:${dto.auctionId}:snapshot`);
    return player;
  }
  async previewBulkUpload(
    userId: string,
    userRole: string,
    auctionId: string,
    file: Express.Multer.File
  ) {
    // A. Basic Ownership Check
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction || !isAdminOrOwner(auction.organizerId, userId, userRole))
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
    // Helper to find the actual header key (Case Insensitive + Trimmed + Synonym support)
    const findHeaderFlex = (synonyms: string[]) => {
      for (const name of synonyms) {
        const found = actualHeaders.find(
          (h) => h.trim().toLowerCase() === name.toLowerCase()
        );
        if (found) return found;
      }
      return undefined;
    };

    const headerMappingConfigs = [
      { key: "Name", required: true, synonyms: ["Name"] },
      { key: "Age", required: true, synonyms: ["Age"] },
      { key: "Mobile", required: true, synonyms: ["Mobile", "MobileNo", "Phone"] },
      { key: "Specification 1", required: true, synonyms: ["Specification 1", "specification1", "spec1", "role"] },
      { key: "Profile_url", required: true, synonyms: ["Profile_url", "Profile Pic", "ProfileUrl", "Photo"] },
      { key: "Specification 2", required: false, synonyms: ["Specification 2", "specification2", "spec2", "battingstyle", "batting style", "batting"] },
      { key: "Specification 3", required: false, synonyms: ["Specification 3", "specification3", "spec3", "bowlingstyle", "bowling style", "bowling"] },
      { key: "Base Value (if different)", required: false, synonyms: ["Base Value (if different)", "BasePrice", "Base Value", "Base Price", "BaseValue"] },
      { key: "Jersay No.", required: false, synonyms: ["Jersay No.", "Jersey No.", "Jersey Number", "JerseyNum", "JersayNo"] },
      { key: "Jersay Name", required: false, synonyms: ["Jersay Name", "Jersey Name", "JerseyName", "JersayName"] },
      { key: "T-Shirt", required: false, synonyms: ["T-Shirt", "TshirtSize", "T-Shirt Size", "Tshirt Size", "T Shirt"] },
      { key: "Trouser", required: false, synonyms: ["Trouser", "TrouserSize", "Trouser Size"] },
    ];

    const missingHeaders: any[] = [];
    const headerMap: Record<string, string> = {}; // Maps logical key -> actual Excel column name

    headerMappingConfigs.forEach((cfg) => {
      const found = findHeaderFlex(cfg.synonyms);
      if (found) {
        headerMap[cfg.key] = found;
      } else if (cfg.required) {
        missingHeaders.push(cfg.key);
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
      const ageRaw = row[headerMap["Age"]!]?.toString().trim();
      const profilePicRaw = row[headerMap["Profile_url"]!]?.toString().trim();
      const roleRaw = row[headerMap["Specification 1"]!]
        ?.toString()
        .trim()
        .toUpperCase() || "";

      // 2. Validation Checks
      if (!name) errors.push("Name is required");
      if (!mobile) errors.push("Mobile is required");
      if (!ageRaw) {
        errors.push("Age is required");
      } else if (isNaN(Number(ageRaw))) {
        errors.push("Age must be a valid number");
      }
      if (!profilePicRaw) errors.push("Profile URL is required");
      if (!roleRaw) errors.push("Specification 1 (Role) is required");

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

        basePrice: (headerMap["Base Value (if different)"] && row[headerMap["Base Value (if different)"]])
          ? Number(row[headerMap["Base Value (if different)"]])
          : Number(auction.minBid),

        // Playing styles
        battingStyle: headerMap["Specification 2"]
          ? this.normalizeBattingStyle(row[headerMap["Specification 2"]])
          : null,
        bowlingStyle: headerMap["Specification 3"]
          ? this.normalizeBowlingStyle(row[headerMap["Specification 3"]])
          : null,

        // Jersey & clothing (OPTIONAL SAFE MAPPING)
        jerseyNumber: (headerMap["Jersay No."] && row[headerMap["Jersay No."]])
          ? Number(row[headerMap["Jersay No."]])
          : null,
        jerseyName: headerMap["Jersay Name"] ? (row[headerMap["Jersay Name"]] || null) : null,
        tshirtSize: headerMap["T-Shirt"] ? (row[headerMap["T-Shirt"]] || null) : null,
        trouserSize: headerMap["Trouser"] ? (row[headerMap["Trouser"]] || null) : null,

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
    userRole: string,
    auctionId: string,
    playersData: any[]
  ) {
    // Re-Verify Ownership
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction || !isAdminOrOwner(auction.organizerId, userId, userRole))
      throw new ForbiddenException("Invalid Auction");

    // Transactional Insert (Rollback if any fail)
    const uploadResult = await this.prisma.prisma.$transaction(async (tx: any) => {
      // We use createMany for performance
      // Note: Prisma createMany doesn't support nested relations (like JSON details) well in some DBs,
      // but for Postgres it is fine if structure matches.

      // However, since we have mapped JSON fields, we need to map the array carefully
      const formattedData = playersData.map((p) => ({
        auctionId,
        categoryId: p.categoryId ?? null,

        name: p.name,
        mobile: p.mobile ? String(p.mobile) : null,
        age: p.age ? Number(p.age) : 0,

        fatherName: p.fatherName ? String(p.fatherName) : null,
        profilePic: p.profilePic ? String(p.profilePic) : null,

        role: p.role,
        battingStyle: p.battingStyle ? String(p.battingStyle) : null,
        bowlingStyle: p.bowlingStyle ? String(p.bowlingStyle) : null,

        tshirtSize: p.tshirtSize ? String(p.tshirtSize) : null,
        trouserSize: p.trouserSize ? String(p.trouserSize) : null,
        jerseyName: p.jerseyName ? String(p.jerseyName) : null,
        jerseyNumber: p.jerseyNumber ? Number(p.jerseyNumber) : null,

        basePrice: Number(p.basePrice),
        status: PlayerStatus.UPCOMING,
      }));

      const result = await tx.player.createMany({
        data: formattedData,
        skipDuplicates: true, // Safety net
      });

      return { success: true, count: result.count, result: result };
    });

    await this.redis.del(`auction:${auctionId}:settings`, `auction:${auctionId}:snapshot`);
    return uploadResult;
  }
  // Helper
  private mapRoleToEnum(roleRaw: string, sportType: string): PlayerRole {
    if (!roleRaw) return PlayerRole.OTHER;

    const role = roleRaw.toUpperCase().trim();
    const sport = (sportType || "").trim().toLowerCase();

    // 🏏 CRICKET
    if (sport === "cricket") {
      if (role.includes("BATSMAN") || role === "BATSMAN" || role === "BATTER" || role.includes("BAT")) return PlayerRole.BATSMAN;
      if (role.includes("BOWLER") || role === "BOWLER" || role.includes("BOWL")) return PlayerRole.BOWLER;
      if (role.includes("KEEPER") || role === "WICKET KEEPER" || role === "WICKET-KEEPER" || role.includes("WK") || role.includes("WICKET")) return PlayerRole.WICKET_KEEPER;
      if (role.includes("ALL") || role === "ALL ROUNDER" || role === "ALL-ROUNDER" || role.includes("ROUNDER") || role.includes("AR")) return PlayerRole.ALL_ROUNDER;
      return PlayerRole.OTHER;
    }

    // ⚽ FOOTBALL
    if (sport === "football") {
      if (role.includes("GOAL") || role === "GK") return PlayerRole.GOALKEEPER;
      if (role.includes("DEFENDER") || role === "DF") return PlayerRole.DEFENDER;
      if (role.includes("MID") || role === "MF") return PlayerRole.MIDFIELDER;
      if (role.includes("FORWARD") || role.includes("STRIKER") || role === "FW") return PlayerRole.FORWARD;
      return PlayerRole.OTHER;
    }

    // 🏐 VOLLEYBALL (Generic roles)
    if (sport === "volleyball") {
      return PlayerRole.OTHER; // positions vary widely → keep generic
    }

    return PlayerRole.OTHER;
  }
  async bulkUpload(
    userId: string,
    userRole: string,
    auctionId: string,
    file: Express.Multer.File
  ) {
    // 1. Verify Ownership
    const auction = await this.prisma.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction || !isAdminOrOwner(auction.organizerId, userId, userRole))
      throw new ForbiddenException("Invalid Auction");

    // 2. GET EXISTING CATEGORIES (The "Smart" Step)
    const categories = await this.prisma.prisma.category.findMany({
      where: { auctionId },
    });

    const categoryMap = new Map();
    categories.forEach((cat: any) => {
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
    const rawData = XLSX.utils.sheet_to_json<any>(worksheet, { defval: "" });
    if (rawData.length === 0) throw new BadRequestException("File is empty");

    // Helper to find the actual header key (Case Insensitive + Trimmed + Synonym support)
    const actualHeaders = Object.keys(rawData[0]);
    const findHeaderFlex = (synonyms: string[]) => {
      for (const name of synonyms) {
        const found = actualHeaders.find(
          (h) => h.trim().toLowerCase() === name.toLowerCase()
        );
        if (found) return found;
      }
      return undefined;
    };

    const headerMappingConfigs = [
      { key: "Name", required: true, synonyms: ["Name"] },
      { key: "Age", required: true, synonyms: ["Age"] },
      { key: "Mobile", required: true, synonyms: ["Mobile", "MobileNo", "Phone"] },
      { key: "Specification 1", required: true, synonyms: ["Specification 1", "specification1", "spec1", "role"] },
      { key: "Profile_url", required: true, synonyms: ["Profile_url", "Profile Pic", "ProfileUrl", "Photo"] },
      { key: "Specification 2", required: false, synonyms: ["Specification 2", "specification2", "spec2", "battingstyle", "batting style", "batting"] },
      { key: "Specification 3", required: false, synonyms: ["Specification 3", "specification3", "spec3", "bowlingstyle", "bowling style", "bowling"] },
      { key: "Base Value (if different)", required: false, synonyms: ["Base Value (if different)", "BasePrice", "Base Value", "Base Price", "BaseValue"] },
      { key: "Jersay No.", required: false, synonyms: ["Jersay No.", "Jersey No.", "Jersey Number", "JerseyNum", "JersayNo"] },
      { key: "Jersay Name", required: false, synonyms: ["Jersay Name", "Jersey Name", "JerseyName", "JersayName"] },
      { key: "T-Shirt", required: false, synonyms: ["T-Shirt", "TshirtSize", "T-Shirt Size", "Tshirt Size", "T Shirt"] },
      { key: "Trouser", required: false, synonyms: ["Trouser", "TrouserSize", "Trouser Size"] },
    ];

    const missingHeaders: any[] = [];
    const headerMap: Record<string, string> = {};

    headerMappingConfigs.forEach((cfg) => {
      const found = findHeaderFlex(cfg.synonyms);
      if (found) {
        headerMap[cfg.key] = found;
      } else if (cfg.required) {
        missingHeaders.push(cfg.key);
      }
    });

    if (missingHeaders.length > 0) {
      throw new BadRequestException(
        `Missing required columns: ${missingHeaders.join(", ")}`
      );
    }

    // 4. Process Every Row
    const playersToCreate = rawData.map((row: any) => {
      // A. EXTRACT ROLE (Specification 1)
      const excelRole = row[headerMap["Specification 1"]!]
        ? String(row[headerMap["Specification 1"]!]).trim()
        : "";
      const excelRoleUpper = excelRole.toUpperCase();

      // B. AUTO-ASSIGN CATEGORY ID
      let matchedCategoryId = null;

      // Logic: Check if Excel Role matches our DB Category Name
      if (categoryMap.has(excelRoleUpper)) {
        matchedCategoryId = categoryMap.get(excelRoleUpper);
      }
      // Fallback: If no exact match, try to find a partial match
      else {
        for (const [catName, catId] of categoryMap.entries()) {
          if (excelRoleUpper.includes(catName)) {
            matchedCategoryId = catId;
            break;
          }
        }
      }

      // C. MAP ENUM ROLE
      const dbRole = this.mapRoleToEnum(excelRoleUpper, auction.sportsType);

      // D. RETURN THE PLAYER OBJECT
      return {
        auctionId,
        categoryId: matchedCategoryId,

        name: row[headerMap["Name"]!]?.toString().trim(),
        mobile: row[headerMap["Mobile"]!] ? String(row[headerMap["Mobile"]!]).trim() : null,
        age: row[headerMap["Age"]!] ? Number(row[headerMap["Age"]!]) : 18,

        role: dbRole,

        battingStyle: headerMap["Specification 2"]
          ? this.normalizeBattingStyle(row[headerMap["Specification 2"]])
          : null,
        bowlingStyle: headerMap["Specification 3"]
          ? this.normalizeBowlingStyle(row[headerMap["Specification 3"]])
          : null,

        jerseyNumber: (headerMap["Jersay No."] && row[headerMap["Jersay No."]] !== undefined && row[headerMap["Jersay No."]] !== null)
          ? Number(row[headerMap["Jersay No."]])
          : null,
        jerseyName: (headerMap["Jersay Name"] && row[headerMap["Jersay Name"]] !== undefined && row[headerMap["Jersay Name"]] !== null)
          ? String(row[headerMap["Jersay Name"]])
          : null,
        tshirtSize: (headerMap["T-Shirt"] && row[headerMap["T-Shirt"]] !== undefined && row[headerMap["T-Shirt"]] !== null)
          ? String(row[headerMap["T-Shirt"]])
          : null,
        trouserSize: (headerMap["Trouser"] && row[headerMap["Trouser"]] !== undefined && row[headerMap["Trouser"]] !== null)
          ? String(row[headerMap["Trouser"]])
          : null,

        profilePic: (row[headerMap["Profile_url"]!] !== undefined && row[headerMap["Profile_url"]!] !== null)
          ? String(row[headerMap["Profile_url"]!])
          : null,

        basePrice: (headerMap["Base Value (if different)"] && row[headerMap["Base Value (if different)"]])
          ? Number(row[headerMap["Base Value (if different)"]])
          : Number(auction.minBid),

        status: PlayerStatus.UPCOMING,
      };
    });

    // 5. Bulk Insert into Database
    const result = await this.prisma.prisma.player.createMany({
      data: playersToCreate,
      skipDuplicates: true,
    });

    await this.redis.del(`auction:${auctionId}:settings`, `auction:${auctionId}:snapshot`);
    return result;
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
  async update(id: string, userId: string, userRole: string, dto: UpdatePlayerDto) {
    // 1. Fetch player with auction
    const player = await this.prisma.prisma.player.findUnique({
      where: { id },
      include: { auction: true },
    });

    if (!player) throw new NotFoundException("Player not found");
    if (!isAdminOrOwner(player.auction.organizerId, userId, userRole)) {
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
    if (dto.profilePic !== undefined) updateData.profilePic = dto.profilePic;

    // 3. Update player
    const updated = await this.prisma.prisma.player.update({
      where: { id },
      data: updateData,
    });

    await this.redis.del(`auction:${player.auctionId}:settings`, `auction:${player.auctionId}:snapshot`);
    return updated;
  }

  async remove(id: string, userId: string, userRole: string) {
    const player = await this.prisma.prisma.player.findUnique({
      where: { id },
      include: { auction: true },
    });
    if (!player || !isAdminOrOwner(player.auction.organizerId, userId, userRole)) {
      throw new ForbiddenException("Cannot delete this player");
    }
    const deleted = await this.prisma.prisma.player.delete({ where: { id } });
    await this.redis.del(`auction:${player.auctionId}:settings`, `auction:${player.auctionId}:snapshot`);
    return deleted;
  }

  private normalizeBattingStyle(style: string | null): string | null {
    if (!style) return null;
    const s = style.trim().toUpperCase();
    if (s.includes("RIGHT HAND") || s.includes("RIGHT-HAND") || s === "RHB" || s === "RIGHT") return "RHB";
    if (s.includes("LEFT HAND") || s.includes("LEFT-HAND") || s === "LHB" || s === "LEFT") return "LHB";
    return style.trim();
  }

  private normalizeBowlingStyle(style: string | null): string | null {
    if (!style) return null;
    const s = style.trim().toUpperCase();
    if (s.includes("RIGHT ARM FAST") || s === "RAF") return "RAF";
    if (s.includes("LEFT ARM FAST") || s === "LAF") return "LAF";
    if (s.includes("RIGHT ARM MEDIUM") || s === "RAM" || s === "RMF") return "RAM";
    if (s.includes("LEFT ARM MEDIUM") || s === "LAM" || s === "LMF") return "LAM";
    if (s.includes("RIGHT ARM OFF") || s.includes("OFFBREAK") || s === "RAO" || s === "OB") return "RAO";
    if (s.includes("RIGHT ARM LEG") || s.includes("LEGBREAK") || s === "RALB" || s === "LB") return "RALB";
    if (s.includes("LEFT ARM ORTHODOX") || s.includes("SLOW LEFT") || s === "SLA" || s === "LAO") return "SLA";
    return style.trim();
  }
}
