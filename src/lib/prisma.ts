import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // Use environment DATABASE_URL directly (no modifications)
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    // Log the URL being used (hide password for security)
    console.log('Database URL being used:', databaseUrl.replace(/:[^:@]*@/, ':***@'));

    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        datasources: {
            db: {
                url: databaseUrl
            }
        }
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// For Supabase pooler, always create fresh connections to avoid prepared statement conflicts
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Optimized wrapper for Vercel serverless functions
export async function withPrisma<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    // For serverless environments, always use fresh connections
    const freshPrisma = prismaClientSingleton();
    try {
        return await operation(freshPrisma);
    } finally {
        await freshPrisma.$disconnect();
    }
}

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}
