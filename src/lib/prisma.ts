import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// For Supabase pooler, always create fresh connections to avoid prepared statement conflicts
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Enhanced wrapper that handles connection pooler issues
export async function withPrisma<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    // For development with pooler, create a fresh client for each operation
    if (process.env.NODE_ENV === 'development' && process.env.DATABASE_URL?.includes('pgbouncer=true')) {
        const freshPrisma = prismaClientSingleton();
        try {
            const result = await operation(freshPrisma);
            return result;
        } finally {
            await freshPrisma.$disconnect();
        }
    }

    // Use global client for other cases
    return operation(prisma);
}

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}
