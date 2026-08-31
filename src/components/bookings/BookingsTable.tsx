"use client";

import React, { useState, useEffect } from "react";
import { Booking, BookingStatus } from "@/types";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  Wrench,
  RotateCw,
} from "lucide-react";
import { BookingDrawer } from "@/components/bookings/BookingDrawer";

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status: statusFilter,
        category: categoryFilter,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.data) {
        setBookings(json.data);
        setTotal(json.pagination.total);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, limit, search, statusFilter, categoryFilter, sortBy, sortOrder]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/live-stream");
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "STATUS_CHANGE" || parsed.type === "NEW_BOOKING") {
            fetchBookings();
            if (selectedBooking && selectedBooking.id === parsed.data.id) {
              setSelectedBooking(parsed.data);
            }
          }
        } catch {}
      };
    } catch (err) {
      console.error("SSE error in bookings table", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [selectedBooking]);

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus, note?: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const updated = await res.json();
      if (updated.id) {
        setSelectedBooking(updated);
        fetchBookings();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleExportCSV = () => {
    window.location.href = `/api/export/csv?status=${statusFilter}&category=${categoryFilter}`;
  };

  const statuses = ["ALL", "PENDING", "ASSIGNED", "EN_ROUTE", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  const categories = [
    "ALL",
    "Emergency Breakdown",
    "Periodic Maintenance",
    "Brake & Tires",
    "Engine Diagnostics",
    "Battery & Electrical",
    "AC & Heating",
  ];

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, customer name, license plate..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-muted/60 text-foreground placeholder:text-muted-foreground text-xs rounded-lg pl-9 pr-4 py-2.5 border border-border focus:border-primary focus:bg-background outline-none transition"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-muted text-foreground text-xs rounded-lg px-3 py-2 border border-border outline-none font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-muted text-foreground text-xs rounded-lg px-3 py-2 border border-border outline-none font-medium"
          >
            <option value="createdAt">Date Created</option>
            <option value="scheduledAt">Scheduled Date</option>
            <option value="amount">Amount ($)</option>
            <option value="status">Status</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-border transition"
            title="Toggle sort order"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent text-xs font-semibold border border-border transition"
          >
            <Download className="h-4 w-4 text-emerald-500" />
            Export CSV
          </button>

          <button
            onClick={fetchBookings}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-border transition"
            title="Refresh Data"
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Status Filter Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === s
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
            }`}
          >
            {s === "ALL" ? "All Bookings" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Mechanic</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Scheduled</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    <RotateCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading operations queue...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    No bookings found matching your search or filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {b.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-foreground">{b.customer?.name}</p>
                      <p className="text-[11px] text-muted-foreground">{b.customer?.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-foreground">
                        {b.vehicle ? `${b.vehicle.make} ${b.vehicle.model}` : "Vehicle"}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {b.vehicle?.licensePlate || "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4 max-w-[200px]">
                      <p className="font-medium text-foreground truncate">{b.serviceName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{b.serviceCategory}</p>
                    </td>
                    <td className="py-3 px-4">
                      {b.mechanic ? (
                        <div className="flex items-center gap-1.5">
                          <Wrench className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="font-medium text-foreground truncate">
                            {b.mechanic.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">
                      {formatCurrency(b.amount)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDateTime(b.scheduledAt)}
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-semibold text-foreground">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> bookings
          </div>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-muted text-foreground text-xs rounded-lg px-2 py-1 border border-border outline-none mr-2"
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-muted text-foreground disabled:opacity-40 hover:bg-accent border border-border transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-foreground px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-muted text-foreground disabled:opacity-40 hover:bg-accent border border-border transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <BookingDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
