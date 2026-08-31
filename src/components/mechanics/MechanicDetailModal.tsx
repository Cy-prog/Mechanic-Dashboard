"use client";

import React, { useState } from "react";
import { Mechanic } from "@/types";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { X, Wrench, Star, CheckCircle, Phone, Mail, MapPin, Calendar, Clock } from "lucide-react";

interface MechanicDetailModalProps {
  mechanic: Mechanic | null;
  onClose: () => void;
  onStatusUpdate: (id: string, newStatus: string) => Promise<void>;
}

export function MechanicDetailModal({
  mechanic,
  onClose,
  onStatusUpdate,
}: MechanicDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!mechanic) return null;

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(mechanic.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
              {mechanic.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-foreground">{mechanic.name}</h2>
                <StatusBadge status={mechanic.status} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground">{mechanic.specialization}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/40 p-3 rounded-xl border border-border text-center">
              <span className="text-muted-foreground block mb-1">Rating</span>
              <span className="font-bold text-base text-amber-500 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-500" /> {mechanic.rating}
              </span>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border text-center">
              <span className="text-muted-foreground block mb-1">Jobs Done</span>
              <span className="font-bold text-base text-foreground">
                {mechanic.jobsCompleted}
              </span>
            </div>
            <div className="bg-muted/40 p-3 rounded-xl border border-border text-center">
              <span className="text-muted-foreground block mb-1">Fleet Unit</span>
              <span className="font-bold text-base text-primary">Van #{mechanic.id.slice(0, 4)}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-muted/30 p-3.5 rounded-xl border border-border/60 space-y-2">
            <h4 className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
              Direct Contact & Location
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p className="flex items-center gap-1.5 text-foreground">
                <Phone className="h-3.5 w-3.5 text-primary" /> {mechanic.phone}
              </p>
              <p className="flex items-center gap-1.5 text-foreground truncate">
                <Mail className="h-3.5 w-3.5 text-primary" /> {mechanic.email}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              GPS Coordinates: {mechanic.latitude.toFixed(4)}, {mechanic.longitude.toFixed(4)}
            </p>
          </div>

          {/* Status Changer */}
          <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
            <h4 className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] mb-2">
              Set Operational Status
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {["AVAILABLE", "EN_ROUTE", "BUSY", "OFFLINE"].map((st) => (
                <button
                  key={st}
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold border transition ${
                    mechanic.status === st
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground hover:bg-muted border-border"
                  }`}
                >
                  {st.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Active Job / Schedule */}
          {mechanic.activeBooking && (
            <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-xl">
              <h4 className="font-bold text-primary text-xs mb-1">Currently Assigned Vehicle</h4>
              <p className="font-bold text-foreground">{mechanic.activeBooking.serviceName}</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                Client: {mechanic.activeBooking.customer?.name} • Address: {mechanic.activeBooking.customerAddress}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
