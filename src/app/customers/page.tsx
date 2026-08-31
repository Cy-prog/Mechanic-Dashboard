"use client";

import React, { useState, useEffect } from "react";
import { Customer } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Search, Users, Car, Phone, Mail, MapPin, DollarSign, Calendar, RotateCw } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCustomers(data);
      }
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Customer Accounts & Vehicle Fleet
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {customers.length} Verified Clients
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registered vehicle owners, registered garages, and lifetime spend records
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="p-2 self-start sm:self-auto rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
          title="Refresh Customers"
        >
          <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/60 text-foreground placeholder:text-muted-foreground text-xs rounded-lg pl-9 pr-4 py-2.5 border border-border focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && customers.length === 0 ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-card animate-pulse rounded-xl border border-border" />
          ))
        ) : customers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No customers found matching your search.
          </div>
        ) : (
          customers.map((c) => (
            <div
              key={c.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-11 w-11 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
                    {c.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{c.name}</h3>
                    <span className="text-[11px] text-muted-foreground">
                      Client since {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground my-3">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{c.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{c.address}</span>
                  </p>
                </div>

                {/* Vehicles registered */}
                {c.vehicles && c.vehicles.length > 0 && (
                  <div className="bg-muted/40 p-2.5 rounded-lg border border-border/60 my-2 text-xs">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Registered Vehicles ({c.vehicles.length})
                    </span>
                    {c.vehicles.map((v: any) => (
                      <div key={v.id} className="flex items-center justify-between text-foreground">
                        <span className="font-medium">
                          {v.year} {v.make} {v.model}
                        </span>
                        <span className="font-mono text-[10px] bg-background px-1.5 py-0.5 rounded border border-border">
                          {v.licensePlate}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Spend Stats Footer */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{c.totalBookings} Bookings</span>
                <span className="font-bold text-emerald-500">
                  {formatCurrency(c.totalSpent || 0)} Spent
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
