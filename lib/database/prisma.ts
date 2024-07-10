import { PrismaClient } from "@prisma/client";

// Utilizes globalThis to maintain a single instance of PrismaClient across the application.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a new PrismaClient instance if one doesn't already exist.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// For development and testing purposes, assign the PrismaClient instance to the global object.
// This will make sure that new prisma client is not created on hot reloads.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
