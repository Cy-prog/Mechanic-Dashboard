import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const mechanicId = searchParams.get("mechanicId") || "";
    const priority = searchParams.get("priority") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const where: any = {};

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { serviceName: { contains: search } },
        { customer: { name: { contains: search } } },
        { vehicle: { licensePlate: { contains: search } } },
        { vehicle: { make: { contains: search } } },
        { vehicle: { model: { contains: search } } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (category && category !== "ALL") {
      where.serviceCategory = category;
    }

    if (mechanicId && mechanicId !== "ALL") {
      where.mechanicId = mechanicId;
    }

    if (priority && priority !== "ALL") {
      where.priority = priority;
    }

    const skip = (page - 1) * limit;

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: true,
          vehicle: true,
          mechanic: true,
          statusTimeline: {
            orderBy: { timestamp: "desc" },
            take: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Bookings API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      vehicleId,
      serviceCategory,
      serviceName,
      amount,
      priority,
      notes,
      customerAddress,
      scheduledAt,
      mechanicId,
    } = body;

    const count = await prisma.booking.count();
    const id = `IM-${84000 + count + 1}`;

    const status = mechanicId ? "ASSIGNED" : "PENDING";

    const booking = await prisma.booking.create({
      data: {
        id,
        customerId,
        vehicleId: vehicleId || null,
        mechanicId: mechanicId || null,
        serviceCategory: serviceCategory || "Periodic Maintenance",
        serviceName: serviceName || "General Vehicle Service",
        status,
        priority: priority || "MEDIUM",
        amount: parseFloat(amount || "150"),
        notes: notes || "Mobile service booking",
        customerAddress: customerAddress || "Downtown Service Area",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        statusTimeline: {
          create: [
            {
              status: "PENDING",
              note: "Booking created by operations team.",
            },
            ...(mechanicId
              ? [
                  {
                    status: "ASSIGNED",
                    note: "Mechanic assigned upon booking creation.",
                  },
                ]
              : []),
          ],
        },
      },
      include: {
        customer: true,
        vehicle: true,
        mechanic: true,
      },
    });

    realtimeHub.broadcast("NEW_BOOKING", booking);

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
