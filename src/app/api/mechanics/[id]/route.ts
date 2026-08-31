import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mechanic = await prisma.mechanic.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            customer: true,
            vehicle: true,
          },
        },
      },
    });

    if (!mechanic) {
      return NextResponse.json({ error: "Mechanic not found" }, { status: 404 });
    }

    return NextResponse.json(mechanic);
  } catch (error) {
    console.error("Get Mechanic Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch mechanic" },
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
    const { status, latitude, longitude } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;

    const mechanic = await prisma.mechanic.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(mechanic);
  } catch (error) {
    console.error("Update Mechanic Error:", error);
    return NextResponse.json(
      { error: "Failed to update mechanic" },
      { status: 500 }
    );
  }
}
