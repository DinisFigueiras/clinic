import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma-serverless";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const week = searchParams.get("week");
    const date = searchParams.get("date");

    const data = await withPrisma(async (prisma) => {
      if (week) {
        const now = new Date();
        const weekEnd = new Date(now);
        weekEnd.setDate(now.getDate() + 7);
        return await prisma.bookings.findMany({
          where: {
            booking_StartdateTime: {
              gte: new Date(now.setHours(0, 0, 0, 0)),
              lte: new Date(weekEnd.setHours(23, 59, 59, 999)),
            },
          },
          include: { patient: true },
          orderBy: { booking_StartdateTime: "asc" },
        });
      } else if (date) {
        const d = new Date(date);
        return await prisma.bookings.findMany({
          where: {
            booking_StartdateTime: {
              gte: new Date(d.setHours(0, 0, 0, 0)),
              lte: new Date(d.setHours(23, 59, 59, 999)),
            },
          },
          include: { patient: true },
          orderBy: { booking_StartdateTime: "asc" },
        });
      }
      return [];
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Bookings API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}