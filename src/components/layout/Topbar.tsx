"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Bell,
  Search,
  PlusCircle,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopbarProps {
  onOpenNewBooking?: () => void;
}

export function Topbar({ onOpenNewBooking }: TopbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [liveConnected, setLiveConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check initial theme
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    // Connect to live SSE Stream
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/live-stream");
      eventSource.onopen = () => {
        setLiveConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "STATUS_CHANGE") {
            const newNotif = {
              id: Date.now(),
              title: `Booking ${parsed.data.id} Updated`,
              message: `Status changed to ${parsed.data.status} for ${parsed.data.customer?.name || "Customer"}`,
              time: "Just now",
              type: "status",
            };
            setNotifications((prev) => [newNotif, ...prev.slice(0, 7)]);
          } else if (parsed.type === "NEW_BOOKING") {
            const newNotif = {
              id: Date.now(),
              title: `New Booking ${parsed.data.id}`,
              message: `${parsed.data.serviceName} - $${parsed.data.amount}`,
              time: "Just now",
              type: "new",
            };
            setNotifications((prev) => [newNotif, ...prev.slice(0, 7)]);
          }
        } catch (e) {
          // ignore keepalive
        }
      };

      eventSource.onerror = () => {
        setLiveConnected(false);
      };
    } catch (err) {
      console.error("SSE connection error", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
      {/* Left side / Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search booking ID, customer, vehicle plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/60 hover:bg-muted text-foreground placeholder:text-muted-foreground text-sm rounded-lg pl-9 pr-4 py-2 border border-transparent focus:border-primary focus:bg-background outline-none transition"
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Live Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border text-xs font-medium">
          <span className="relative flex h-2 w-2">
            {liveConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                liveConnected ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
          </span>
          <span className="text-muted-foreground hidden sm:inline">
            {liveConnected ? "Live SSE Stream" : "Connecting..."}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            title="Real-time Alerts"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
                <span className="font-semibold text-sm">Real-Time Activity</span>
                <span className="text-xs text-muted-foreground">
                  {notifications.length} events
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Waiting for live operations events...
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-muted/40 text-xs hover:bg-muted/80 transition"
                    >
                      <p className="font-semibold text-foreground">{n.title}</p>
                      <p className="text-muted-foreground mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Quick New Booking Button */}
        {onOpenNewBooking && (
          <button
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Booking</span>
          </button>
        )}
      </div>
    </header>
  );
}
