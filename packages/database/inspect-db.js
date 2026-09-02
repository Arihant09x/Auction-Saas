const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspectDb() {
  try {
    ('--- ENUMS ---');
    const enums = await prisma.$queryRaw`
      SELECT t.typname, e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname IN ('BlogStatus', 'UserStatus', 'Role');
    `;
    (enums);

    ('\n--- TABLES ---');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    (tables);

    ('\n--- AUDIT LOG COLUMNS ---');
    const auditCols = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'AuditLog';
    `;
    (auditCols);

    ('\n--- USER COLUMNS ---');
    const userCols = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'User';
    `;
    (userCols);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

inspectDb();
