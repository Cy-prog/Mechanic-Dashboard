"use client";

import React from "react";
import { StatusCount } from "@/types";
import { StatusBadge } from "@/components/bookings/StatusBadge";

interface StatusDistributionProps {
  data: StatusCount[];
}

export function StatusDistributionChart({ data }: StatusDistributionProps) {
  const statusColors: Record<string, string> = {
    COMPLETED: "bg-emerald-500",
    IN_PROGRESS: "bg-purple-500",
    EN_ROUTE: "bg-indigo-500",
    ASSIGNED: "bg-blue-500",
    PENDING: "bg-amber-500",
    CANCELLED: "bg-rose-500",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Live Operational Pipeline
        </h2>
        <span className="text-xs text-muted-foreground">Active Status Mix</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Current distribution across all service workflow states
      </p>

      {/* Progress Bar Ribbon */}
      <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex gap-0.5 mb-5">
        {data.map((s, idx) => (
          <div
            key={idx}
            style={{ width: `${s.percentage}%` }}
            className={`${statusColors[s.status] || "bg-slate-400"} h-full transition-all duration-500`}
            title={`${s.status}: ${s.count} (${s.percentage}%)`}
          />
        ))}
      </div>

      {/* Breakdown Items */}
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <StatusBadge status={item.status} size="sm" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">{item.count}</span>
              <span className="text-muted-foreground w-12 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
