import { PrismaClient } from "@prisma/client";
import * as SQLite from "expo-sqlite";
import { PrismaSQLite } from "@prisma/adapter-sqlite";

let prisma: PrismaClient | null = null;

export function getPrismaClient() {
  if (!prisma) {
    const db = SQLite.openDatabaseSync("credvault.db");
    const adapter = new PrismaSQLite(db);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}