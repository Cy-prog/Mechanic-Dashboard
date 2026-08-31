"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, FastForward, Activity, Zap, CheckCircle } from "lucide-react";

export function LiveSimulatorBanner({ onTick }: { onTick?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalSec, setIntervalSec] = useState(5);
  const [lastAction, setLastAction] = useState<string | null>("System Ready");
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerStep = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/simulator", { method: "POST" });
      const data = await res.json();
      if (data.action) {
        setLastAction(data.action.replace(/_/g, " "));
      }
      if (onTick) onTick();
    } catch (err) {
      console.error("Simulation error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        triggerStep();
      }, intervalSec * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, intervalSec]);

  return (
    <div className="bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900/40 border border-blue-500/20 rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
          <Zap className="h-4 w-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">
              Live Operations Simulation Engine
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Interactive Test Mode
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            Simulate real-time status transitions (Pending ➔ Assigned ➔ On The Way ➔ In Progress ➔ Completed) & mechanic GPS movement.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-muted-foreground text-xs mr-2 hidden sm:block">
          Last event: <span className="font-semibold text-foreground">{lastAction}</span>
        </div>

        <button
          onClick={triggerStep}
          disabled={isProcessing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent font-medium border border-border transition"
        >
          <FastForward className="h-3.5 w-3.5 text-blue-500" />
          Step 1 Event
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-white shadow-sm transition ${
            isPlaying
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5" /> Pause Auto-Sim
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Start Auto-Sim
            </>
          )}
        </button>

        <select
          value={intervalSec}
          onChange={(e) => setIntervalSec(Number(e.target.value))}
          className="bg-card text-foreground border border-border rounded-lg px-2 py-1.5 text-xs outline-none"
        >
          <option value={3}>3s tick</option>
          <option value={5}>5s tick</option>
          <option value={10}>10s tick</option>
        </select>
      </div>
    </div>
  );
}
