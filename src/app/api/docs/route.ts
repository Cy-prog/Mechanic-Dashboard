import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "Instant Mechanic Live Operations API",
      version: "1.0.0",
      description:
        "High-performance REST & SSE Real-time Operations API for Instant Mechanic fleet management, live dispatch, and analytics.",
    },
    servers: [
      {
        url: "/api",
        description: "Primary Production & Staging Gateway",
      },
    ],
    paths: {
      "/dashboard": {
        get: {
          summary: "Get Operational Overview & Aggregates",
          description:
            "Returns aggregated metrics (KPI cards, revenue series, bookings breakdown, category share).",
          parameters: [
            {
              name: "range",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["7d", "30d", "90d", "all"], default: "30d" },
            },
          ],
          responses: {
            200: { description: "Realtime metrics successfully computed" },
          },
        },
      },
      "/bookings": {
        get: {
          summary: "List Bookings with Search, Sorting & Multi-Filters",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 15 } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "mechanicId", in: "query", schema: { type: "string" } },
            { name: "sortBy", in: "query", schema: { type: "string", default: "createdAt" } },
            { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
          ],
          responses: { 200: { description: "Paginated list of bookings" } },
        },
        post: {
          summary: "Create New Customer Vehicle Service Booking",
          responses: { 201: { description: "Booking created and broadcast to live SSE" } },
        },
      },
      "/bookings/{id}": {
        get: {
          summary: "Get Single Booking by ID with Timeline History",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Booking details" }, 404: { description: "Not found" } },
        },
        patch: {
          summary: "Update Booking Status / Assign Mechanic",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Status updated & live event emitted" } },
        },
      },
      "/mechanics": {
        get: {
          summary: "List Fleet Mechanics with Live Status & Telemetry",
          responses: { 200: { description: "Fleet roster" } },
        },
      },
      "/live-stream": {
        get: {
          summary: "Server-Sent Events (SSE) Live Stream",
          description: "Persistent HTTP stream broadcasting live booking status and location events.",
          responses: { 200: { description: "Event stream initiated" } },
        },
      },
      "/simulator": {
        post: {
          summary: "Advance Operations Simulation by 1 Step",
          responses: { 200: { description: "Simulator event dispatched" } },
        },
      },
      "/export/csv": {
        get: {
          summary: "Export Bookings as CSV File",
          responses: { 200: { description: "CSV file stream" } },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
