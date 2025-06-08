import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const week = searchParams.get("week");
  const date = searchParams.get("date");
  let data: any[] = [];

  if (week) {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    data = await prisma.bookings.findMany({
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
    data = await prisma.bookings.findMany({
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

  return NextResponse.json(data);
}