import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (category && category !== "ALL") where.serviceCategory = category;

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        vehicle: true,
        mechanic: true,
      },
    });

    const headers = [
      "Booking ID",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Vehicle",
      "License Plate",
      "Service Category",
      "Service Name",
      "Status",
      "Priority",
      "Amount ($)",
      "Mechanic Name",
      "Scheduled Date",
      "Created At",
    ];

    const rows = bookings.map((b) => [
      b.id,
      `"${b.customer?.name || "N/A"}"`,
      `"${b.customer?.email || "N/A"}"`,
      `"${b.customer?.phone || "N/A"}"`,
      `"${b.vehicle ? `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}` : "N/A"}"`,
      `"${b.vehicle?.licensePlate || "N/A"}"`,
      `"${b.serviceCategory}"`,
      `"${b.serviceName}"`,
      b.status,
      b.priority,
      b.amount,
      `"${b.mechanic?.name || "Unassigned"}"`,
      `"${new Date(b.scheduledAt).toISOString()}"`,
      `"${new Date(b.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="instant-mechanic-bookings-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV Export Error:", error);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}
