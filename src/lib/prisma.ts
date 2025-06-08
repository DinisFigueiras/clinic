import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    const baseUrl = process.env.DATABASE_URL || "";
    // For serverless environments, disable prepared statements completely
    const url = baseUrl.includes('?')
        ? `${baseUrl}&prepared_statements=false&connection_limit=1`
        : `${baseUrl}?prepared_statements=false&connection_limit=1`;

    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
        datasources: {
            db: { url }
        }
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// In production (serverless), create a new client each time to avoid connection issues
const prisma = process.env.NODE_ENV === 'production'
    ? prismaClientSingleton()
    : (globalThis.prismaGlobal ?? prismaClientSingleton())

// Use the global Prisma client for all operations
export function withPrisma<T>(operation: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return operation(prisma);
}

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
}
