"use client";

import React, { useState } from "react";
import { Mechanic, Booking } from "@/types";
import { Wrench, Navigation, Car, MapPin, ZoomIn, ZoomOut, Compass } from "lucide-react";
import { StatusBadge } from "@/components/bookings/StatusBadge";

interface MechanicMapProps {
  mechanics: Mechanic[];
  onSelectMechanic?: (mechanic: Mechanic) => void;
}

export function MechanicMap({ mechanics, onSelectMechanic }: MechanicMapProps) {
  const [selectedPin, setSelectedPin] = useState<Mechanic | null>(null);

  // Normalize SF metro bounds to SVG viewport (500x350)
  // Lat: ~37.73 to 37.81, Lng: ~ -122.46 to -122.38
  const minLat = 37.73;
  const maxLat = 37.81;
  const minLng = -122.47;
  const maxLng = -122.38;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 560 + 20;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 340 + 20;
    return { x, y };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "#10b981"; // Emerald
      case "EN_ROUTE":
        return "#6366f1"; // Indigo
      case "BUSY":
        return "#a855f7"; // Purple
      default:
        return "#64748b"; // Slate
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-3 z-10">
        <div>
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "12s" }} />
            Live Fleet Radar & GPS Map
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time active tracking of 25 mobile workshop vans across metropolitan zone
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
          </span>
          <span className="flex items-center gap-1 text-indigo-500 font-medium">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" /> On The Way
          </span>
          <span className="flex items-center gap-1 text-purple-500 font-medium">
            <span className="h-2 w-2 rounded-full bg-purple-500" /> In Service
          </span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-[380px] bg-slate-950/90 rounded-xl overflow-hidden border border-slate-800">
        {/* Stylized Grid & Roads */}
        <svg className="w-full h-full" viewBox="0 0 600 380">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
            <radialGradient id="radarScan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Map Grid Pattern */}
          <rect width="600" height="380" fill="url(#grid)" />

          {/* City Coastline / Sector Zones */}
          <path
            d="M 20 80 Q 150 40 320 90 T 580 60"
            fill="none"
            stroke="rgba(59, 130, 246, 0.18)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M 60 360 Q 240 280 380 320 T 560 270"
            fill="none"
            stroke="rgba(59, 130, 246, 0.18)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Major simulated arterial avenues */}
          <line x1="80" y1="20" x2="520" y2="360" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <line x1="480" y1="20" x2="120" y2="360" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <line x1="20" y1="180" x2="580" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <line x1="300" y1="20" x2="300" y2="360" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

          {/* Pulse circles in background */}
          <circle cx="300" cy="190" r="160" fill="none" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="1" />
          <circle cx="300" cy="190" r="90" fill="none" stroke="rgba(59, 130, 246, 0.12)" strokeWidth="1" />

          {/* Render Route Trajectories for En Route / Busy Mechanics */}
          {mechanics
            .filter((m) => m.status === "EN_ROUTE" || m.status === "BUSY")
            .map((m) => {
              const start = project(m.latitude, m.longitude);
              const destLat = m.latitude + 0.012;
              const destLng = m.longitude - 0.015;
              const end = project(destLat, destLng);

              return (
                <g key={`route-${m.id}`}>
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={m.status === "EN_ROUTE" ? "#6366f1" : "#a855f7"}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    strokeOpacity="0.7"
                  />
                  {/* Destination pin */}
                  <circle cx={end.x} cy={end.y} r="4" fill="#f59e0b" />
                </g>
              );
            })}

          {/* Mechanic Pins */}
          {mechanics.map((m) => {
            const { x, y } = project(m.latitude, m.longitude);
            const color = getStatusColor(m.status);
            const isSelected = selectedPin?.id === m.id;

            return (
              <g
                key={m.id}
                className="cursor-pointer transition-all duration-300 group"
                onClick={() => {
                  setSelectedPin(m);
                  if (onSelectMechanic) onSelectMechanic(m);
                }}
              >
                {/* Ping animation for active en-route mechanics */}
                {m.status === "EN_ROUTE" && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    className="animate-ping origin-center"
                  />
                )}

                {/* Pin shadow / halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "14" : "10"}
                  fill={color}
                  fillOpacity={isSelected ? "0.4" : "0.2"}
                />

                {/* Core Pin */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "7" : "5"}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Tooltip Label */}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="600"
                  className="opacity-0 group-hover:opacity-100 transition duration-150 pointer-events-none drop-shadow"
                >
                  {m.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Mechanic Floating Info Box */}
        {selectedPin && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-card/95 backdrop-blur border border-border p-3.5 rounded-xl shadow-xl z-20 text-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
              <span className="font-bold text-foreground">{selectedPin.name}</span>
              <StatusBadge status={selectedPin.status} size="sm" />
            </div>
            <p className="text-muted-foreground text-[11px] mb-1">{selectedPin.specialization}</p>
            <div className="flex items-center justify-between text-muted-foreground pt-1 text-[11px]">
              <span>★ {selectedPin.rating} Rating</span>
              <span>{selectedPin.jobsCompleted} Completed Jobs</span>
            </div>
            {selectedPin.activeBooking && (
              <div className="mt-2 pt-2 border-t border-border text-[11px]">
                <span className="font-semibold text-primary">Active Ticket: </span>
                <span className="text-foreground">{selectedPin.activeBooking.serviceName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
