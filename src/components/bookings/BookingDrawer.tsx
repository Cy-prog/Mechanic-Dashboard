"use client";

import React, { useState } from "react";
import { Booking, BookingStatus } from "@/types";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  X,
  User,
  Car,
  Wrench,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  Play,
  Truck,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface BookingDrawerProps {
  booking: Booking | null;
  onClose: () => void;
  onStatusUpdate: (bookingId: string, newStatus: BookingStatus, note?: string) => Promise<void>;
}

export function BookingDrawer({ booking, onClose, onStatusUpdate }: BookingDrawerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [customNote, setCustomNote] = useState("");

  if (!booking) return null;

  const handleUpdate = async (status: BookingStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(booking.id, status, customNote || undefined);
      setCustomNote("");
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStatusMap: Record<BookingStatus, { next: BookingStatus; label: string; icon: any } | null> = {
    PENDING: { next: "ASSIGNED", label: "Assign Mechanic", icon: Wrench },
    ASSIGNED: { next: "EN_ROUTE", label: "Dispatch Mechanic", icon: Truck },
    EN_ROUTE: { next: "IN_PROGRESS", label: "Start Service", icon: Play },
    IN_PROGRESS: { next: "COMPLETED", label: "Mark Completed", icon: CheckCircle },
    COMPLETED: null,
    CANCELLED: null,
  };

  const nextAction = nextStatusMap[booking.status];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-foreground">{booking.id}</h2>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Created {formatDateTime(booking.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {nextAction && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-primary">Next Workflow Step</p>
                <p className="text-sm font-bold text-foreground">
                  Ready to move to {nextAction.next}?
                </p>
              </div>
              <button
                disabled={isUpdating}
                onClick={() => handleUpdate(nextAction.next)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md transition"
              >
                <nextAction.icon className="h-4 w-4" />
                {nextAction.label}
              </button>
            </div>
          )}

          <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Service Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Category</span>
                <p className="font-semibold text-foreground mt-0.5">{booking.serviceCategory}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Service Name</span>
                <p className="font-semibold text-foreground mt-0.5">{booking.serviceName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount</span>
                <p className="font-bold text-emerald-500 text-sm mt-0.5">
                  {formatCurrency(booking.amount)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Estimated Duration</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {booking.estimatedDuration} mins
                </p>
              </div>
            </div>
            {booking.notes && (
              <div className="mt-3 pt-3 border-t border-border/40 text-xs">
                <span className="text-muted-foreground">Customer Notes:</span>
                <p className="text-foreground mt-0.5 italic">{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Customer
                </h3>
              </div>
              <p className="font-bold text-foreground text-sm">{booking.customer?.name}</p>
              <p className="text-xs text-muted-foreground">{booking.customer?.phone}</p>
              <p className="text-xs text-muted-foreground">{booking.customer?.email}</p>
              <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                <span>{booking.customerAddress}</span>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Vehicle
                </h3>
              </div>
              <p className="font-bold text-foreground text-sm">
                {booking.vehicle ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}` : "Standard Vehicle"}
              </p>
              <p className="text-xs text-muted-foreground font-mono bg-background inline-block px-2 py-0.5 rounded border border-border mt-1">
                Plate: {booking.vehicle?.licensePlate || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Assigned Technician
                </h3>
              </div>
              {booking.mechanic && (
                <span className="text-xs font-semibold text-amber-500">
                  ★ {booking.mechanic.rating} Rating
                </span>
              )}
            </div>

            {booking.mechanic ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground text-sm">{booking.mechanic.name}</p>
                  <p className="text-xs text-muted-foreground">{booking.mechanic.specialization}</p>
                  <p className="text-xs text-muted-foreground">{booking.mechanic.phone}</p>
                </div>
                <div className="text-right text-xs">
                  <span className="text-muted-foreground">Completed</span>
                  <p className="font-bold text-foreground">{booking.mechanic.jobsCompleted} jobs</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-xs text-muted-foreground">No mechanic assigned yet</p>
              </div>
            )}
          </div>

          <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              Live Operations Timeline
            </h3>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {booking.statusTimeline && booking.statusTimeline.length > 0 ? (
                booking.statusTimeline.map((item, idx) => (
                  <div key={idx} className="relative pl-6 text-xs">
                    <span className="absolute left-0 top-1 h-4 w-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center" />
                    <div className="flex items-center justify-between">
                      <StatusBadge status={item.status} size="sm" />
                      <span className="text-[10px] text-muted-foreground">
                        {formatDateTime(item.timestamp)}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-muted-foreground mt-1 leading-relaxed">{item.note}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground pl-6">No timeline events recorded.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-card space-y-3 sticky bottom-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add optional note with status change..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="flex-1 bg-muted text-foreground text-xs rounded-lg px-3 py-2 border border-border outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
              <button
                disabled={isUpdating}
                onClick={() => handleUpdate("CANCELLED")}
                className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-semibold border border-rose-500/30 transition"
              >
                Cancel Booking
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted text-xs font-semibold transition"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
