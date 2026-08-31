"use client";

import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  DollarSign,
  Users,
  Wrench,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardMetrics } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface StatCardsProps {
  metrics: DashboardMetrics;
}

export function StatCards({ metrics }: StatCardsProps) {
  const cards = [
    {
      title: "Total Bookings",
      value: metrics.totalBookings.toLocaleString(),
      change: "+12.4%",
      isPositive: true,
      subtext: `${metrics.conversionRate}% completion rate`,
      icon: Calendar,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Today's Bookings",
      value: metrics.todaysBookings.toString(),
      change: "+8 today",
      isPositive: true,
      subtext: "Live queue active",
      icon: Clock,
      gradient: "from-amber-500/10 to-amber-600/5",
      iconColor: "text-amber-500",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Completed Jobs",
      value: metrics.completedBookings.toLocaleString(),
      change: "+94.2%",
      isPositive: true,
      subtext: "Certified road-ready",
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-500",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Pending Dispatch",
      value: metrics.pendingBookings.toString(),
      change: metrics.pendingBookings > 5 ? "Needs Attention" : "Optimal",
      isPositive: metrics.pendingBookings <= 5,
      subtext: `${metrics.assignedBookings} assigned`,
      icon: AlertTriangle,
      gradient: "from-orange-500/10 to-orange-600/5",
      iconColor: "text-orange-500",
      borderColor: "border-orange-500/20",
    },
    {
      title: "Cancelled Bookings",
      value: metrics.cancelledBookings.toString(),
      change: "-3.1%",
      isPositive: true,
      subtext: "Low cancellation rate",
      icon: XCircle,
      gradient: "from-rose-500/10 to-rose-600/5",
      iconColor: "text-rose-500",
      borderColor: "border-rose-500/20",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      change: `+$${metrics.todaysRevenue} today`,
      isPositive: true,
      subtext: `Avg $${metrics.averageBookingValue} / job`,
      icon: DollarSign,
      gradient: "from-indigo-500/10 to-indigo-600/5",
      iconColor: "text-indigo-500",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "Active Mechanics",
      value: `${metrics.activeMechanics} / ${metrics.totalMechanics}`,
      change: "On duty",
      isPositive: true,
      subtext: `${metrics.inProgressBookings + metrics.enRouteBookings} in service`,
      icon: Wrench,
      gradient: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/20",
    },
    {
      title: "New Customers",
      value: metrics.newCustomers.toString(),
      change: "+18.2%",
      isPositive: true,
      subtext: "4.88 ⭐ satisfaction",
      icon: Users,
      gradient: "from-cyan-500/10 to-cyan-600/5",
      iconColor: "text-cyan-500",
      borderColor: "border-cyan-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`bg-card bg-gradient-to-br ${c.gradient} border ${c.borderColor} rounded-xl p-4 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`p-2 rounded-lg bg-background/80 shadow-xs ${c.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {c.value}
              </span>
              <span
                className={`inline-flex items-center text-xs font-medium ${
                  c.isPositive ? "text-emerald-500" : "text-amber-500"
                }`}
              >
                {c.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                {c.change}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
              {c.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
