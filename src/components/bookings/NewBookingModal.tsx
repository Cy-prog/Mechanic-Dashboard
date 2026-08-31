"use client";

import React, { useState, useEffect } from "react";
import { X, PlusCircle } from "lucide-react";

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewBookingModal({ isOpen, onClose, onCreated }: NewBookingModalProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Periodic Maintenance");
  const [serviceName, setServiceName] = useState("Full Synthetic Oil & Filter Service");
  const [amount, setAmount] = useState("145");
  const [priority, setPriority] = useState("MEDIUM");
  const [notes, setNotes] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/customers")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCustomers(data);
            if (data.length > 0) {
              setCustomerId(data[0].id);
              setCustomerAddress(data[0].address);
            }
          }
        });

      fetch("/api/mechanics")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setMechanics(data);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          mechanicId: mechanicId || undefined,
          serviceCategory,
          serviceName,
          amount,
          priority,
          notes,
          customerAddress,
        }),
      });
      if (res.ok) {
        onCreated();
        onClose();
      }
    } catch (err) {
      console.error("Failed to create booking", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">Create Service Booking</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Customer</label>
            <select
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                const c = customers.find((x) => x.id === e.target.value);
                if (c) setCustomerAddress(c.address);
              }}
              className="w-full bg-muted text-foreground p-2.5 rounded-lg border border-border outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Service Line</label>
              <select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="w-full bg-muted text-foreground p-2.5 rounded-lg border border-border outline-none"
              >
                <option value="Emergency Breakdown">Emergency Breakdown</option>
                <option value="Periodic Maintenance">Periodic Maintenance</option>
                <option value="Brake & Tires">Brake & Tires</option>
                <option value="Engine Diagnostics">Engine Diagnostics</option>
                <option value="Battery & Electrical">Battery & Electrical</option>
                <option value="AC & Heating">AC & Heating</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-muted text-foreground p-2.5 rounded-lg border border-border outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="EMERGENCY">Emergency Roadside</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Service Task Description</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-muted text-foreground p-2.5 rounded-lg border border-border outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Quote Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-muted text-foreground p-2.5 rounded-lg border border-border outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Assign Lead Mechanic</label>
              <select
                value={mechanicId}
                onChange={(e) => setMechanicId(e.target.value)}
                className="w-full bg-muted text-foreground p-2.5 rounded-lg border border-border outline-none"
              >
                <option value="">Auto-Dispatch Later</option>
                {mechanics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Service Location Address</label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full bg-muted text-foreground p-2.5 rounded-lg border border-border outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Dispatch Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Customer vehicle parked in driveway..."
              className="w-full bg-muted text-foreground p-2.5 rounded-lg border border-border outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
            >
              {isSubmitting ? "Creating..." : "Confirm & Dispatch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
