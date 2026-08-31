"use client";

import React, { useState, useEffect } from "react";
import { DashboardMetrics, ChartDataPoint, CategoryBreakdown, StatusCount } from "@/types";
import { StatCards } from "@/components/dashboard/StatCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ServiceDonutChart } from "@/components/dashboard/ServiceDonutChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { LiveActivityTicker } from "@/components/dashboard/LiveActivityTicker";
import { LiveSimulatorBanner } from "@/components/layout/LiveSimulatorBanner";
import { NewBookingModal } from "@/components/bookings/NewBookingModal";
import { RotateCw, PlusCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [statuses, setStatuses] = useState<StatusCount[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [range, setRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const fetchDashboardData = async (selectedRange = range) => {
    try {
      const res = await fetch(`/api/dashboard?range=${selectedRange}`);
      const data = await res.json();
      if (data.metrics) {
        setMetrics(data.metrics);
        setChartData(data.chartData);
        setCategories(data.categoryBreakdown);
        setStatuses(data.statusBreakdown);
        setActivities(data.recentActivity);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(range);
  }, [range]);

  // Real-time SSE event listener for instant reactivity
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/live-stream");
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "STATUS_CHANGE" || parsed.type === "NEW_BOOKING") {
            fetchDashboardData(range);
          }
        } catch {}
      };
    } catch (err) {
      console.error("SSE connection error", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [range]);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Operations Mission Control
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live fleet dispatch, technician tracking, and vehicle service telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDashboardData(range)}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
            title="Refresh metrics"
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition"
          >
            <PlusCircle className="h-4 w-4" />
            Dispatch Booking
          </button>
        </div>
      </div>

      {/* Live Operations Simulator Control Ribbon */}
      <LiveSimulatorBanner onTick={() => fetchDashboardData(range)} />

      {/* 8 Core KPI Stat Cards */}
      {metrics ? (
        <StatCards metrics={metrics} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-card animate-pulse rounded-xl border border-border" />
          ))}
        </div>
      )}

      {/* Main Analytics Grid: Revenue & Category Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={chartData} onRangeChange={(r) => setRange(r)} />
        </div>
        <div>
          <ServiceDonutChart data={categories} />
        </div>
      </div>

      {/* Operational Breakdown & Real-Time Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StatusDistributionChart data={statuses} />
        </div>
        <div className="lg:col-span-2">
          <LiveActivityTicker activities={activities} />
        </div>
      </div>

      {/* Quick Navigation Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/bookings"
          className="bg-card hover:bg-muted/40 border border-border p-4 rounded-xl shadow-sm transition flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-sm text-foreground">Live Bookings Queue</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inspect {metrics?.totalBookings || 500}+ service tickets with full filters
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/mechanics"
          className="bg-card hover:bg-muted/40 border border-border p-4 rounded-xl shadow-sm transition flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-sm text-foreground">Fleet & GPS Radar</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track 25 mechanics on duty and live on-site locations
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/analytics"
          className="bg-card hover:bg-muted/40 border border-border p-4 rounded-xl shadow-sm transition flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-sm text-foreground">Executive Analytics</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deep dive into technician efficiency and peak service hours
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onCreated={() => fetchDashboardData(range)}
      />
    </div>
  );
}
