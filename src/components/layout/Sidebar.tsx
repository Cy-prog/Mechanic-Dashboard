"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  BarChart3,
  Users,
  FileCode2,
  Car,
  Activity,
  ShieldCheck,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Live Operations", href: "/", icon: LayoutDashboard },
    { name: "Bookings Queue", href: "/bookings", icon: CalendarDays },
    { name: "Fleet & Mechanics", href: "/mechanics", icon: Wrench },
    { name: "Analytics & KPIs", href: "/analytics", icon: BarChart3 },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "API Documentation", href: "/api-docs", icon: FileCode2 },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col justify-between p-4 fixed left-0 top-0 bottom-0 z-30 hidden md:flex">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-border">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base tracking-tight text-foreground">
                Instant Mechanic
              </h1>
            </div>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations v1.0
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t border-border pt-4 px-2">
        <div className="bg-muted/50 rounded-xl p-3 border border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              SaaS System Active
            </span>
            <span className="text-emerald-500 font-semibold">99.9%</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Real-time SSE engine streaming vehicle telemetry and booking changes.
          </p>
        </div>
      </div>
    </aside>
  );
}
