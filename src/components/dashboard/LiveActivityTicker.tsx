"use client";

import React from "react";
import { formatTimeAgo } from "@/lib/utils";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { Car, User, Wrench, ArrowRight } from "lucide-react";

interface LiveActivityProps {
  activities: any[];
}

export function LiveActivityTicker({ activities }: LiveActivityProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Live Activity Feed
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time status updates & technician dispatch events
          </p>
        </div>
      </div>

      <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No live events recorded yet.
          </p>
        ) : (
          activities.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition border border-border/40 text-xs"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <Car className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-foreground">
                    {a.booking?.id}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTimeAgo(a.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={a.status} size="sm" />
                  <span className="text-muted-foreground truncate">
                    {a.booking?.customer?.name || "Customer"}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                  {a.note || a.booking?.serviceName}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
