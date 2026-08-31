"use client";

import React, { useState } from "react";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { NewBookingModal } from "@/components/bookings/NewBookingModal";
import { PlusCircle, CalendarDays, Zap } from "lucide-react";
import { LiveSimulatorBanner } from "@/components/layout/LiveSimulatorBanner";

export default function BookingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Bookings & Service Operations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              560+ Tickets
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search, filter, update live statuses, and inspect full customer vehicle service records
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Booking
        </button>
      </div>

      {/* Live Simulation Controls */}
      <LiveSimulatorBanner />

      {/* Main Bookings Data Grid */}
      <BookingsTable />

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          // Trigger refresh automatically
        }}
      />
    </div>
  );
}
