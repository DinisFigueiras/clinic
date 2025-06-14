import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection using the optimized wrapper
    const result = await withPrisma(async (prisma) => {
      return await prisma.$queryRaw`SELECT 1 as test`;
    });

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      result,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set"
      }
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set"
      }
    }, { status: 500 });
  }
}
