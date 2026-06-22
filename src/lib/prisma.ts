import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import path from "path"

let connectionString = process.env.DATABASE_URL || "file:./dev.db"

if (connectionString.startsWith("file:")) {
  const dbPath = connectionString.substring(5)
  if (!path.isAbsolute(dbPath)) {
    const resolvedPath = path.resolve(process.cwd(), "prisma", dbPath)
    connectionString = `file:${resolvedPath}`
  }
}

const adapter = new PrismaBetterSqlite3({ url: connectionString })

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma