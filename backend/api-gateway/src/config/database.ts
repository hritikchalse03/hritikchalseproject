import { PrismaClient } from '@prisma/client';
import { config } from './config';

let prisma: PrismaClient;

declare global {
  var __prisma: PrismaClient | undefined;
}

if (config.env === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
  });
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
}

export { prisma };