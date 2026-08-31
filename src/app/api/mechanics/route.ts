import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const mechanics = await prisma.mechanic.findMany({
      where,
      orderBy: [{ status: "asc" }, { rating: "desc" }],
      include: {
        bookings: {
          where: {
            status: { in: ["ASSIGNED", "EN_ROUTE", "IN_PROGRESS"] },
          },
          take: 1,
          include: {
            customer: true,
            vehicle: true,
          },
        },
      },
    });

    const formatted = mechanics.map((m) => ({
      ...m,
      activeBooking: m.bookings.length > 0 ? m.bookings[0] : null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Mechanics API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mechanics" },
      { status: 500 }
    );
  }
}
