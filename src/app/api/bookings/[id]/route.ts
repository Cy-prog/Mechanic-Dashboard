import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          include: { vehicles: true },
        },
        vehicle: true,
        mechanic: true,
        statusTimeline: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Get Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, mechanicId, notes, note } = body;

    const existing = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { mechanic: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (mechanicId !== undefined) updateData.mechanicId = mechanicId;
    if (notes !== undefined) updateData.notes = notes;

    if (status === "IN_PROGRESS" && !existing.startedAt) {
      updateData.startedAt = new Date();
    }
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
      // Update mechanic jobsCompleted count
      const activeMechId = mechanicId || existing.mechanicId;
      if (activeMechId) {
        await prisma.mechanic.update({
          where: { id: activeMechId },
          data: {
            jobsCompleted: { increment: 1 },
            status: "AVAILABLE",
            currentBookingId: null,
          },
        });
      }
    }

    if (status === "EN_ROUTE" && (mechanicId || existing.mechanicId)) {
      await prisma.mechanic.update({
        where: { id: (mechanicId || existing.mechanicId)! },
        data: { status: "EN_ROUTE", currentBookingId: params.id },
      });
    }

    if (status === "IN_PROGRESS" && (mechanicId || existing.mechanicId)) {
      await prisma.mechanic.update({
        where: { id: (mechanicId || existing.mechanicId)! },
        data: { status: "BUSY", currentBookingId: params.id },
      });
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: true,
        vehicle: true,
        mechanic: true,
      },
    });

    // Create status timeline log
    if (status) {
      await prisma.statusHistory.create({
        data: {
          bookingId: params.id,
          status,
          note:
            note ||
            `Status updated to ${status}${
              updated.mechanic ? ` with mechanic ${updated.mechanic.name}` : ""
            }.`,
        },
      });
    }

    // Broadcast SSE Realtime event
    realtimeHub.broadcast("STATUS_CHANGE", updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
