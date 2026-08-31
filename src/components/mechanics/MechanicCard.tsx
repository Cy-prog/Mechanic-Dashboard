"use client";

import React from "react";
import { Mechanic } from "@/types";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { Wrench, Phone, Mail, Star, CheckCircle, Navigation, MapPin } from "lucide-react";

interface MechanicCardProps {
  mechanic: Mechanic;
  onSelect: (mechanic: Mechanic) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export function MechanicCard({ mechanic, onSelect, onStatusChange }: MechanicCardProps) {
  return (
    <div
      onClick={() => onSelect(mechanic)}
      className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
              {mechanic.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">{mechanic.name}</h3>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {mechanic.specialization}
              </p>
            </div>
          </div>
          <StatusBadge status={mechanic.status} size="sm" />
        </div>

        {/* Specs & Performance */}
        <div className="grid grid-cols-2 gap-2 bg-muted/40 rounded-lg p-2.5 my-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-foreground">{mechanic.rating}</span>
            <span className="text-[10px]">Rating</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-semibold text-foreground">{mechanic.jobsCompleted}</span>
            <span className="text-[10px]">Completed</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{mechanic.phone}</span>
          </p>
          <p className="flex items-center gap-1.5 truncate">
            <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{mechanic.email}</span>
          </p>
        </div>
      </div>

      {/* Active Assignment / Status Quick Toggle */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
        {mechanic.activeBooking ? (
          <div className="truncate text-primary font-medium">
            <span className="font-bold">Active:</span> {mechanic.activeBooking.serviceName}
          </div>
        ) : (
          <span className="text-muted-foreground italic">Ready for dispatch</span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(mechanic);
          }}
          className="px-2.5 py-1 rounded-md bg-secondary hover:bg-muted text-foreground text-xs font-semibold transition"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
