// packages/database_postgres/src/index.ts
// packages/database_postgres/src/index.ts
import { PrismaClient } from "@prisma/client";

// Use singleton pattern (same as Prisma docs)
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient;
};

// If already exists → reuse same instance
// Otherwise create new one
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient();

// Make it available globally (for dev hot-reload)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Export everything from @prisma/client
export * from "@prisma/client";
