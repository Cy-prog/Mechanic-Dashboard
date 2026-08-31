"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, TrendingUp, DollarSign, Clock, Users, Star, Award, Zap } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard?range=all")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setIsLoading(false);
      });
  }, []);

  // Simulated peak demand hourly data (8am - 8pm)
  const hourlyTraffic = [
    { hour: "8 AM", bookings: 18, avgSpend: 160 },
    { hour: "9 AM", bookings: 32, avgSpend: 210 },
    { hour: "10 AM", bookings: 45, avgSpend: 240 },
    { hour: "11 AM", bookings: 52, avgSpend: 195 },
    { hour: "12 PM", bookings: 38, avgSpend: 180 },
    { hour: "1 PM", bookings: 41, avgSpend: 220 },
    { hour: "2 PM", bookings: 49, avgSpend: 260 },
    { hour: "3 PM", bookings: 58, avgSpend: 275 },
    { hour: "4 PM", bookings: 64, avgSpend: 310 },
    { hour: "5 PM", bookings: 50, avgSpend: 230 },
    { hour: "6 PM", bookings: 34, avgSpend: 190 },
    { hour: "7 PM", bookings: 22, avgSpend: 150 },
  ];

  // Technician Leaderboard
  const leaderboard = [
    { name: "Carlos Mendez", spec: "Master Diagnostics", jobs: 184, rating: 4.96, revenue: "$48,200" },
    { name: "Vikram Patel", spec: "EV / Hybrid Systems", jobs: 172, rating: 4.98, revenue: "$44,800" },
    { name: "Dmitri Ivanov", spec: "European Spec", jobs: 165, rating: 4.97, revenue: "$43,100" },
    { name: "Elena Rostova", spec: "Climate & AC", jobs: 158, rating: 4.94, revenue: "$39,500" },
    { name: "Sarah Jenkins", spec: "Transmission Pro", jobs: 152, rating: 4.92, revenue: "$38,900" },
    { name: "Devon Brooks", spec: "Brake & Suspension", jobs: 146, rating: 4.88, revenue: "$36,200" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Analytics & Performance Intelligence
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          High-resolution revenue attribution, technician leaderboard, and peak demand telemetry
        </p>
      </div>

      {/* Top Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Avg Job Value
          </span>
          <div className="text-2xl font-bold text-foreground mt-1">
            {data ? formatCurrency(data.metrics.averageBookingValue) : "$245"}
          </div>
          <span className="text-emerald-500 text-xs font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +8.4% this month
          </span>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Completion Rate
          </span>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            {data ? `${data.metrics.conversionRate}%` : "94.2%"}
          </div>
          <span className="text-muted-foreground text-xs mt-1 block">Industry benchmark: 88%</span>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Customer Satisfaction
          </span>
          <div className="text-2xl font-bold text-amber-500 mt-1 flex items-center gap-1.5">
            <Star className="h-5 w-5 fill-amber-500" /> 4.92 / 5.0
          </div>
          <span className="text-muted-foreground text-xs mt-1 block">Based on 490+ reviews</span>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Dispatch Velocity
          </span>
          <div className="text-2xl font-bold text-primary mt-1">18.4 mins</div>
          <span className="text-emerald-500 text-xs font-medium flex items-center gap-1 mt-1">
            <Zap className="h-3 w-3" /> -3.2m faster response
          </span>
        </div>
      </div>

      {/* Hourly Demand & Revenue Attribution Chart */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-foreground">Peak Operating Hours Demand</h3>
            <p className="text-xs text-muted-foreground">
              Booking volume density throughout metropolitan daylight schedule
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover text-popover-foreground border border-border p-2.5 rounded-lg shadow-lg text-xs">
                        <p className="font-semibold">{label}</p>
                        <p className="text-primary font-medium mt-0.5">
                          {payload[0].payload.bookings} Bookings
                        </p>
                        <p className="text-emerald-500 font-medium">
                          Avg Job: ${payload[0].payload.avgSpend}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technician Performance Leaderboard */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-base text-foreground">
              Lead Technician Efficiency Rankings
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">Top Fleet Performers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Technician</th>
                <th className="py-2.5 px-3">Specialization</th>
                <th className="py-2.5 px-3 text-center">Rating</th>
                <th className="py-2.5 px-3 text-right">Jobs Completed</th>
                <th className="py-2.5 px-3 text-right">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leaderboard.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition">
                  <td className="py-3 px-3 font-bold text-muted-foreground">#{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{item.name}</td>
                  <td className="py-3 px-3 text-muted-foreground">{item.spec}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs border border-amber-500/20">
                      ★ {item.rating}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-foreground">
                    {item.jobs}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-500">
                    {item.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
