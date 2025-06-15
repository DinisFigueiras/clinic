import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Bookings API endpoint with filtering support
 * GET /api/bookings?week=true&date=2024-01-01&patientId=1&futureOnly=true
 */
export async function GET(req: NextRequest) {
  try {
    // Extract query parameters for filtering
    const { searchParams } = new URL(req.url);
    const week = searchParams.get("week");
    const date = searchParams.get("date");
    const patientId = searchParams.get("patientId");
    const futureOnly = searchParams.get("futureOnly");
    const search = searchParams.get("search");

    const data = await withPrisma(async (prisma) => {
      let where: any = {};

      // Add patient filter if specified
      if (patientId) {
        where.patient_id = parseInt(patientId);
      }

      if (week) {
        const now = new Date();
        const weekEnd = new Date(now);
        weekEnd.setDate(now.getDate() + 7);
        where.booking_StartdateTime = {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lte: new Date(weekEnd.setHours(23, 59, 59, 999)),
        };
      } else if (date) {
        // Handle date string in YYYY-MM-DD format for Portuguese timezone
        const [year, month, day] = date.split('-').map(Number);

        // Create dates in Portuguese timezone (Europe/Lisbon)
        const startOfDay = new Date();
        startOfDay.setFullYear(year, month - 1, day);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setFullYear(year, month - 1, day);
        endOfDay.setHours(23, 59, 59, 999);

        where.booking_StartdateTime = {
          gte: startOfDay,
          lte: endOfDay,
        };
      } else if (futureOnly === 'true') {
        where.booking_StartdateTime = {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        };
      }

      // If no filters are specified and no patientId, return empty array
      if (!week && !date && !futureOnly && !patientId) {
        return [];
      }

      return await prisma.bookings.findMany({
        where,
        include: {
          patient: true,
          bookingMedications: {
            include: {
              medication: true
            }
          }
        },
        orderBy: { booking_StartdateTime: "asc" },
      });
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Bookings API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}