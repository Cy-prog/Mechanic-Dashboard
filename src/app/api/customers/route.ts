import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        vehicles: true,
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: { amount: true, status: true },
        },
      },
    });

    const formatted = customers.map((c) => {
      const totalSpent = c.bookings.reduce((sum, b) => sum + b.amount, 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        city: c.city,
        avatarUrl: c.avatarUrl,
        vehicles: c.vehicles,
        createdAt: c.createdAt,
        totalBookings: c.bookings.length,
        totalSpent: Math.round(totalSpent),
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Customers API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
