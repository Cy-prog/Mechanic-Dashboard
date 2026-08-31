"use client";

import React, { useState, useEffect } from "react";
import { Mechanic } from "@/types";
import { MechanicMap } from "@/components/mechanics/MechanicMap";
import { MechanicCard } from "@/components/mechanics/MechanicCard";
import { MechanicDetailModal } from "@/components/mechanics/MechanicDetailModal";
import { LiveSimulatorBanner } from "@/components/layout/LiveSimulatorBanner";
import { Wrench, RotateCw, Filter, Users } from "lucide-react";

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

  const fetchMechanics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/mechanics?status=${statusFilter}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMechanics(data);
      }
    } catch (err) {
      console.error("Failed to load mechanics", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, [statusFilter]);

  // Listen to SSE live telemetry updates
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/live-stream");
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "STATUS_CHANGE" || parsed.type === "MECHANIC_MOVE") {
            fetchMechanics();
          }
        } catch {}
      };
    } catch (err) {
      console.error("SSE error in mechanics page", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [statusFilter]);

  const handleMechanicStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/mechanics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      if (updated.id) {
        setSelectedMechanic(updated);
        fetchMechanics();
      }
    } catch (err) {
      console.error("Failed to update mechanic status", err);
    }
  };

  const statusOptions = ["ALL", "AVAILABLE", "EN_ROUTE", "BUSY", "OFFLINE"];

  const counts = {
    all: mechanics.length,
    available: mechanics.filter((m) => m.status === "AVAILABLE").length,
    enRoute: mechanics.filter((m) => m.status === "EN_ROUTE").length,
    busy: mechanics.filter((m) => m.status === "BUSY").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Mechanics Fleet & Dispatch Radar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {mechanics.length} Certified Technicians
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time technician availability, on-site jobs, and GPS coordinates
          </p>
        </div>

        <button
          onClick={fetchMechanics}
          className="p-2 self-start sm:self-auto rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
          title="Refresh Fleet Telemetry"
        >
          <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Live Simulation Banner */}
      <LiveSimulatorBanner onTick={fetchMechanics} />

      {/* Interactive Map */}
      <MechanicMap
        mechanics={mechanics}
        onSelectMechanic={(m) => setSelectedMechanic(m)}
      />

      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {s === "ALL" ? "All Fleet" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground hidden sm:inline">
          {counts.available} available • {counts.enRoute} en route • {counts.busy} in service
        </span>
      </div>

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && mechanics.length === 0 ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-card animate-pulse rounded-xl border border-border" />
          ))
        ) : mechanics.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No technicians found in this status category.
          </div>
        ) : (
          mechanics.map((m) => (
            <MechanicCard
              key={m.id}
              mechanic={m}
              onSelect={(tech) => setSelectedMechanic(tech)}
            />
          ))
        )}
      </div>

      {/* Detail Modal */}
      <MechanicDetailModal
        mechanic={selectedMechanic}
        onClose={() => setSelectedMechanic(null)}
        onStatusUpdate={handleMechanicStatusUpdate}
      />
    </div>
  );
}
