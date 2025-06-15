import { PrismaClient } from "@prisma/client";

// Optimized Prisma client factory for Vercel serverless functions
const createPrismaClient = () => {
    const baseUrl = process.env.DATABASE_URL;

    if (!baseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    // Validate URL format
    if (!baseUrl.startsWith('postgresql://') && !baseUrl.startsWith('postgres://')) {
        console.error('Invalid DATABASE_URL format:', baseUrl.substring(0, 20) + '...');
        throw new Error('DATABASE_URL must start with postgresql:// or postgres://');
    }

    // Force Supabase pooler optimizations for Vercel
    const vercelOptimizedUrl = baseUrl.includes('prepared_statements=false')
        ? baseUrl
        : baseUrl.includes('?')
            ? `${baseUrl}&prepared_statements=false&connection_limit=1&pool_timeout=0`
            : `${baseUrl}?prepared_statements=false&connection_limit=1&pool_timeout=0`;

    console.log('Vercel-optimized DB URL:', vercelOptimizedUrl.replace(/:[^:@]*@/, ':***@'));

    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        datasources: {
            db: {
                url: vercelOptimizedUrl
            }
        }
    });
}

// Vercel-specific connection management
declare const globalThis: {
    prismaGlobal: PrismaClient | undefined;
} & typeof global;

// For Vercel serverless functions - always use fresh connections
export async function withPrisma<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    const prisma = createPrismaClient();
    try {
        const result = await operation(prisma);
        return result;
    } catch (error) {
        console.error('Prisma operation failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// For development only - reuse connection
function getDevPrismaClient(): PrismaClient {
    if (!globalThis.prismaGlobal) {
        globalThis.prismaGlobal = createPrismaClient();
    }
    return globalThis.prismaGlobal;
}

// Export appropriate client based on environment
const prisma = process.env.NODE_ENV === 'production'
    ? createPrismaClient() // Always fresh in production
    : getDevPrismaClient(); // Reuse in development

export default prisma;
