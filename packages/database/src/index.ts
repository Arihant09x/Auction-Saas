// packages/database_postgres/src/index.ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
export { PrismaClient };
