import { PrismaClient } from "@prisma/client";

// Create a fresh Prisma client for serverless functions
export function createPrismaClient() {
    const baseUrl = process.env.DATABASE_URL || "";
    const url = baseUrl.includes('?') 
        ? `${baseUrl}&prepared_statements=false&connection_limit=1`
        : `${baseUrl}?prepared_statements=false&connection_limit=1`;
    
    return new PrismaClient({
        log: ['error'],
        datasources: {
            db: { url }
        }
    });
}

// Utility function to execute a database operation with automatic cleanup
export async function withPrisma<T>(
    operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
    const prisma = createPrismaClient();
    try {
        return await operation(prisma);
    } finally {
        await prisma.$disconnect();
    }
}
