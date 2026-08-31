import React from "react";
import { BookingStatus } from "@/types";

interface StatusBadgeProps {
  status: BookingStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; dot: string; ping?: boolean }
  > = {
    PENDING: {
      label: "Pending",
      bg: "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
      ping: true,
    },
    ASSIGNED: {
      label: "Assigned",
      bg: "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30",
      text: "text-blue-600 dark:text-blue-400",
      dot: "bg-blue-500",
    },
    EN_ROUTE: {
      label: "On The Way",
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30",
      text: "text-indigo-600 dark:text-indigo-400",
      dot: "bg-indigo-500",
      ping: true,
    },
    IN_PROGRESS: {
      label: "In Service",
      bg: "bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/30",
      text: "text-purple-600 dark:text-purple-400",
      dot: "bg-purple-500",
      ping: true,
    },
    COMPLETED: {
      label: "Completed",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30",
      text: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    CANCELLED: {
      label: "Cancelled",
      bg: "bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30",
      text: "text-rose-600 dark:text-rose-400",
      dot: "bg-rose-500",
    },
  };

  const config = configs[status] || {
    label: status,
    bg: "bg-slate-500/10 border-slate-500/30",
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-400",
  };

  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${config.bg} ${config.text} ${
        isSmall ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {config.ping && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      {config.label}
    </span>
  );
}
