import { NextResponse } from 'next/server';
import { withPrisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    const dbStatus = await withPrisma(async (prisma) => {
      await prisma.$queryRaw`SELECT 1`;
      return 'healthy';
    });

    // Check environment variables
    const envCheck = {
      database: !!process.env.DATABASE_URL,
      clerk: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    };

    // Get basic metrics
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
    };

    return NextResponse.json({
      status: 'healthy',
      database: dbStatus,
      environment: envCheck,
      metrics,
      version: '1.0.1', // Trigger redeploy to pick up environment variables
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
