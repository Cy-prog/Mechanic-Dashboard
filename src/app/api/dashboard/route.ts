import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let startDate = new Date();
    if (range === "7d") startDate.setDate(now.getDate() - 7);
    else if (range === "90d") startDate.setDate(now.getDate() - 90);
    else if (range === "all") startDate = new Date(2020, 0, 1);
    else startDate.setDate(now.getDate() - 30); // default 30d

    // Core KPI Counts
    const [
      totalBookings,
      todaysBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      inProgressBookings,
      enRouteBookings,
      assignedBookings,
      totalMechanics,
      activeMechanics,
      newCustomers,
      revenueResult,
      todaysRevenueResult,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.count({ where: { status: "IN_PROGRESS" } }),
      prisma.booking.count({ where: { status: "EN_ROUTE" } }),
      prisma.booking.count({ where: { status: "ASSIGNED" } }),
      prisma.mechanic.count(),
      prisma.mechanic.count({ where: { status: { in: ["BUSY", "EN_ROUTE"] } } }),
      prisma.customer.count({ where: { createdAt: { gte: startDate } } }),
      prisma.booking.aggregate({
        _sum: { amount: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.booking.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfToday }, status: { not: "CANCELLED" } },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;
    const todaysRevenue = todaysRevenueResult._sum.amount || 0;
    const conversionRate =
      totalBookings > 0
        ? Number(((completedBookings / totalBookings) * 100).toFixed(1))
        : 0;
    const averageBookingValue =
      completedBookings > 0
        ? Math.round(totalRevenue / (totalBookings - cancelledBookings || 1))
        : 0;

    // Time-series Chart Data (grouped by day)
    const bookingsInPeriod = await prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        amount: true,
        status: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const dayMap = new Map<string, { bookings: number; revenue: number; completed: number }>();
    for (const b of bookingsInPeriod) {
      const dayKey = new Date(b.createdAt).toISOString().split("T")[0];
      const existing = dayMap.get(dayKey) || { bookings: 0, revenue: 0, completed: 0 };
      existing.bookings += 1;
      if (b.status !== "CANCELLED") {
        existing.revenue += b.amount;
      }
      if (b.status === "COMPLETED") {
        existing.completed += 1;
      }
      dayMap.set(dayKey, existing);
    }

    const chartData = Array.from(dayMap.entries()).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      bookings: data.bookings,
      revenue: Math.round(data.revenue),
      completed: data.completed,
    }));

    // Category Breakdown
    const categoryGroup = await prisma.booking.groupBy({
      by: ["serviceCategory"],
      _count: { id: true },
      _sum: { amount: true },
      where: { status: { not: "CANCELLED" } },
    });

    const categoryBreakdown = categoryGroup.map((c) => ({
      category: c.serviceCategory,
      count: c._count.id,
      revenue: Math.round(c._sum.amount || 0),
      percentage: Number(((c._count.id / (totalBookings || 1)) * 100).toFixed(1)),
    }));

    // Status Breakdown
    const statusGroup = await prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusBreakdown = statusGroup.map((s) => ({
      status: s.status,
      count: s._count.id,
      percentage: Number(((s._count.id / (totalBookings || 1)) * 100).toFixed(1)),
    }));

    // Recent Live Operations Feed
    const recentActivity = await prisma.statusHistory.findMany({
      take: 12,
      orderBy: { timestamp: "desc" },
      include: {
        booking: {
          include: {
            customer: true,
            mechanic: true,
            vehicle: true,
          },
        },
      },
    });

    return NextResponse.json({
      metrics: {
        totalBookings,
        todaysBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        inProgressBookings,
        enRouteBookings,
        assignedBookings,
        totalRevenue: Math.round(totalRevenue),
        todaysRevenue: Math.round(todaysRevenue),
        activeMechanics,
        totalMechanics,
        newCustomers,
        conversionRate,
        averageBookingValue,
        satisfactionScore: 4.88,
      },
      chartData,
      categoryBreakdown,
      statusBreakdown,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
