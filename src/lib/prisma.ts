import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // Use environment DATABASE_URL and optimize for Supabase pooler
    const baseUrl = process.env.DATABASE_URL;

    if (!baseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    // Validate URL format
    if (!baseUrl.startsWith('postgresql://') && !baseUrl.startsWith('postgres://')) {
        console.error('Invalid DATABASE_URL format:', baseUrl.substring(0, 20) + '...');
        throw new Error('DATABASE_URL must start with postgresql:// or postgres://');
    }

    // Add pooler optimizations if not already present
    const optimizedUrl = baseUrl.includes('prepared_statements=false')
        ? baseUrl
        : baseUrl.includes('?')
            ? `${baseUrl}&prepared_statements=false&connection_limit=1`
            : `${baseUrl}?prepared_statements=false&connection_limit=1`;

    // Log the URL being used (hide password for security)
    console.log('Database URL being used:', optimizedUrl.replace(/:[^:@]*@/, ':***@'));

    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        datasources: {
            db: {
                url: optimizedUrl
            }
        }
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

// Lazy initialization - only create when needed
let prisma: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
    if (!prisma) {
        if (process.env.NODE_ENV !== 'production' && globalThis.prismaGlobal) {
            prisma = globalThis.prismaGlobal;
        } else {
            prisma = prismaClientSingleton();
            if (process.env.NODE_ENV !== 'production') {
                globalThis.prismaGlobal = prisma;
            }
        }
    }
    return prisma;
}

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

// Export a getter function instead of direct instance
export default getPrismaClient;
