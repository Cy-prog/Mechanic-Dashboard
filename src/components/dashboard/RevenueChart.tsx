"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: ChartDataPoint[];
  onRangeChange?: (range: string) => void;
}

export function RevenueChart({ data, onRangeChange }: RevenueChartProps) {
  const [activeTab, setActiveTab] = useState<"revenue" | "bookings">("revenue");
  const [selectedRange, setSelectedRange] = useState("30d");

  const handleRange = (range: string) => {
    setSelectedRange(range);
    if (onRangeChange) onRangeChange(range);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Revenue & Bookings Over Time
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational trajectory and volume trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Metric toggle */}
          <div className="flex bg-muted p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === "revenue"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === "bookings"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bookings
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-muted/60 p-1 rounded-lg text-xs">
            {["7d", "30d", "90d", "all"].map((r) => (
              <button
                key={r}
                onClick={() => handleRange(r)}
                className={`px-2.5 py-1 rounded-md capitalize transition ${
                  selectedRange === r
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (activeTab === "revenue" ? `$${v}` : v)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover text-popover-foreground border border-border p-2.5 rounded-lg shadow-lg text-xs">
                      <p className="font-semibold mb-1">{label}</p>
                      <p className="text-blue-500 font-medium">
                        Revenue: {formatCurrency(payload[0].payload.revenue)}
                      </p>
                      <p className="text-emerald-500 font-medium">
                        Bookings: {payload[0].payload.bookings} (
                        {payload[0].payload.completed} completed)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {activeTab === "revenue" ? (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
