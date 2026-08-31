"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CategoryBreakdown } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ServiceDonutChartProps {
  data: CategoryBreakdown[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

export function ServiceDonutChart({ data }: ServiceDonutChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Service Categories
          </h2>
          <span className="text-xs font-semibold text-muted-foreground">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Breakdown of demand by automotive service line
        </p>
      </div>

      <div className="h-[200px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-popover text-popover-foreground border border-border p-2.5 rounded-lg shadow-lg text-xs">
                      <p className="font-semibold">{d.category}</p>
                      <p className="text-muted-foreground mt-0.5">
                        {d.count} bookings ({d.percentage}%)
                      </p>
                      <p className="font-medium text-primary mt-0.5">
                        {formatCurrency(d.revenue)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center pointer-events-none">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">
            {data.reduce((acc, curr) => acc + curr.count, 0)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border">
        {data.slice(0, 6).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="truncate text-muted-foreground">{item.category}</span>
            <span className="font-semibold text-foreground ml-auto">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
