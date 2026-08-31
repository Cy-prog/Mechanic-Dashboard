import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { realtimeHub } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Progress an IN_PROGRESS booking to COMPLETED
    const inProgress = await prisma.booking.findFirst({
      where: { status: "IN_PROGRESS" },
      include: { mechanic: true, customer: true, vehicle: true },
    });

    if (inProgress) {
      const updated = await prisma.booking.update({
        where: { id: inProgress.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
        include: { customer: true, vehicle: true, mechanic: true },
      });

      if (inProgress.mechanicId) {
        await prisma.mechanic.update({
          where: { id: inProgress.mechanicId },
          data: {
            status: "AVAILABLE",
            jobsCompleted: { increment: 1 },
            currentBookingId: null,
          },
        });
      }

      await prisma.statusHistory.create({
        data: {
          bookingId: inProgress.id,
          status: "COMPLETED",
          note: "Service completed successfully. Customer vehicle certified road-ready.",
        },
      });

      realtimeHub.broadcast("STATUS_CHANGE", updated);
      return NextResponse.json({ action: "COMPLETED_BOOKING", booking: updated });
    }

    // 2. Progress an EN_ROUTE booking to IN_PROGRESS
    const enRoute = await prisma.booking.findFirst({
      where: { status: "EN_ROUTE" },
      include: { mechanic: true, customer: true, vehicle: true },
    });

    if (enRoute) {
      const updated = await prisma.booking.update({
        where: { id: enRoute.id },
        data: {
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
        include: { customer: true, vehicle: true, mechanic: true },
      });

      if (enRoute.mechanicId) {
        await prisma.mechanic.update({
          where: { id: enRoute.mechanicId },
          data: { status: "BUSY" },
        });
      }

      await prisma.statusHistory.create({
        data: {
          bookingId: enRoute.id,
          status: "IN_PROGRESS",
          note: "Mechanic arrived on site. Commenced diagnostics and repair work.",
        },
      });

      realtimeHub.broadcast("STATUS_CHANGE", updated);
      return NextResponse.json({ action: "STARTED_BOOKING", booking: updated });
    }

    // 3. Progress an ASSIGNED booking to EN_ROUTE
    const assigned = await prisma.booking.findFirst({
      where: { status: "ASSIGNED" },
      include: { mechanic: true, customer: true, vehicle: true },
    });

    if (assigned) {
      const updated = await prisma.booking.update({
        where: { id: assigned.id },
        data: { status: "EN_ROUTE" },
        include: { customer: true, vehicle: true, mechanic: true },
      });

      if (assigned.mechanicId) {
        await prisma.mechanic.update({
          where: { id: assigned.mechanicId },
          data: { status: "EN_ROUTE" },
        });
      }

      await prisma.statusHistory.create({
        data: {
          bookingId: assigned.id,
          status: "EN_ROUTE",
          note: "Technician dispatched and en route to client location with equipment.",
        },
      });

      realtimeHub.broadcast("STATUS_CHANGE", updated);
      return NextResponse.json({ action: "DISPATCHED_BOOKING", booking: updated });
    }

    // 4. Assign a PENDING booking to an AVAILABLE mechanic
    const pending = await prisma.booking.findFirst({
      where: { status: "PENDING" },
      include: { customer: true, vehicle: true },
    });

    if (pending) {
      const availableMechanic = await prisma.mechanic.findFirst({
        where: { status: "AVAILABLE" },
      });

      if (availableMechanic) {
        const updated = await prisma.booking.update({
          where: { id: pending.id },
          data: {
            status: "ASSIGNED",
            mechanicId: availableMechanic.id,
          },
          include: { customer: true, vehicle: true, mechanic: true },
        });

        await prisma.mechanic.update({
          where: { id: availableMechanic.id },
          data: {
            status: "BUSY",
            currentBookingId: pending.id,
          },
        });

        await prisma.statusHistory.create({
          data: {
            bookingId: pending.id,
            status: "ASSIGNED",
            note: `Assigned to ${availableMechanic.name} (${availableMechanic.specialization}).`,
          },
        });

        realtimeHub.broadcast("STATUS_CHANGE", updated);
        return NextResponse.json({ action: "ASSIGNED_BOOKING", booking: updated });
      }
    }

    // 5. Jitter mechanic coordinates for live map movement simulation
    const activeMechanics = await prisma.mechanic.findMany({
      where: { status: { in: ["EN_ROUTE", "BUSY"] } },
      take: 5,
    });

    for (const m of activeMechanics) {
      const dLat = (Math.random() - 0.5) * 0.003;
      const dLng = (Math.random() - 0.5) * 0.003;
      const moved = await prisma.mechanic.update({
        where: { id: m.id },
        data: {
          latitude: m.latitude + dLat,
          longitude: m.longitude + dLng,
        },
      });
      realtimeHub.broadcast("MECHANIC_MOVE", moved);
    }

    return NextResponse.json({ action: "TELEMETRY_UPDATED" });
  } catch (error) {
    console.error("Simulator API Error:", error);
    return NextResponse.json(
      { error: "Simulator step failed" },
      { status: 500 }
    );
  }
}
