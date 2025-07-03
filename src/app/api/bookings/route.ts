import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

/**
 * Bookings API endpoint with filtering support
 * GET /api/bookings?week=true&date=2024-01-01&patientId=1&futureOnly=true&pastOnly=true
 */
export async function GET(req: NextRequest) {
  try {
    // Extract query parameters for filtering
    const { searchParams } = new URL(req.url);
    const week = searchParams.get("week");
    const date = searchParams.get("date");
    const patientId = searchParams.get("patientId");
    const futureOnly = searchParams.get("futureOnly");
    const pastOnly = searchParams.get("pastOnly");
    const search = searchParams.get("search");

    const data = await withPrisma(async (prisma) => {
      let where: any = {};

      // Add patient filter if specified
      if (patientId) {
        where.patient_id = parseInt(patientId);
      }

      if (week) {
        const now = new Date();

        // Calculate the start of the current week (Monday)
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days to Monday

        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - daysFromMonday);
        weekStart.setHours(0, 0, 0, 0);

        // Calculate the end of the current week (Sunday)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Monday + 6 days = Sunday
        weekEnd.setHours(23, 59, 59, 999);

        where.booking_StartdateTime = {
          gte: weekStart,
          lte: weekEnd,
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
      } else if (pastOnly === 'true') {
        where.booking_StartdateTime = {
          lt: new Date(new Date().setHours(0, 0, 0, 0)),
        };
      }

      // If no filters are specified and no patientId, return empty array
      if (!week && !date && !futureOnly && !pastOnly && !patientId) {
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