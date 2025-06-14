import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // Force use of direct database URL
    const baseUrl = process.env.DATABASE_URL || "";

    // Ensure we're using the direct URL, not pooler
    const directUrl = baseUrl.includes('pooler.supabase.com')
        ? baseUrl.replace('aws-0-eu-west-1.pooler.supabase.com', 'db.lawrznvawnannbnekjtk.supabase.co')
        : baseUrl;

    // Log the URL being used (hide password)
    console.log('Database URL being used:', directUrl.replace(/:[^:@]*@/, ':***@'));

    return new PrismaClient({
        log: ['error', 'warn'],
        datasources: {
            db: {
                url: directUrl
            }
        }
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// For Supabase pooler, always create fresh connections to avoid prepared statement conflicts
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Enhanced wrapper that handles connection pooler issues with retry logic
export async function withPrisma<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // For production, always use fresh connections to avoid pooler issues
            if (process.env.NODE_ENV === 'production') {
                const freshPrisma = prismaClientSingleton();
                try {
                    const result = await operation(freshPrisma);
                    return result;
                } finally {
                    await freshPrisma.$disconnect();
                }
            }

            // For development, use global client
            return await operation(prisma);
        } catch (error: any) {
            // Retry on connection errors
            if (attempt < maxRetries && (
                error.code === 'P1001' || // Connection error
                error.message?.includes('Can\'t reach database server') ||
                error.message?.includes('Connection timeout')
            )) {
                console.warn(`Database connection attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }

            // If not a connection error or max retries reached, throw the error
            throw error;
        }
    }

    throw new Error('Max database connection retries exceeded');
}

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}
