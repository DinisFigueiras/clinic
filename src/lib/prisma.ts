import { PrismaClient } from "@prisma/client";

// Global Prisma client instance to avoid prepared statement conflicts
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['error'],
    // Disable prepared statements to avoid conflicts
    datasourceUrl: process.env.DATABASE_URL + "?pgbouncer=true&prepared_statements=false"
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Use the global Prisma client for all operations
export function withPrisma<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return operation(prisma);
}

// Default export for backward compatibility
export default prisma;