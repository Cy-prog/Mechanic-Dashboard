"use client";

import React, { useState, useEffect } from "react";
import { FileCode2, Play, Copy, Check, ExternalLink, Code } from "lucide-react";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, any>>({});
  const [loadingEndpoint, setLoadingEndpoint] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((r) => r.json())
      .then((json) => setSpec(json));
  }, []);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(window.location.origin + path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleTest = async (endpointPath: string, method: string) => {
    setLoadingEndpoint(endpointPath);
    try {
      const res = await fetch(endpointPath, { method });
      const contentType = res.headers.get("content-type");
      let data: any;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      setTestResult((prev) => ({
        ...prev,
        [endpointPath]: {
          status: res.status,
          data,
          time: new Date().toLocaleTimeString(),
        },
      }));
    } catch (err: any) {
      setTestResult((prev) => ({
        ...prev,
        [endpointPath]: { status: 500, error: err.message },
      }));
    } finally {
      setLoadingEndpoint(null);
    }
  };

  const endpoints = [
    {
      path: "/api/dashboard",
      method: "GET",
      desc: "Returns operational aggregate metrics, KPI counters, daily revenue series, category distribution, and recent activity logs.",
      sampleParams: "?range=30d",
    },
    {
      path: "/api/bookings",
      method: "GET",
      desc: "Search, filter by status or service category, sort, and paginate through 560+ vehicle service records.",
      sampleParams: "?page=1&limit=5&status=PENDING",
    },
    {
      path: "/api/mechanics",
      method: "GET",
      desc: "Lists all 25 active mechanics, live statuses, coordinates, ratings, and currently assigned jobs.",
      sampleParams: "?status=AVAILABLE",
    },
    {
      path: "/api/customers",
      method: "GET",
      desc: "Directory of registered vehicle owners with customer lifetime spend and vehicle details.",
      sampleParams: "",
    },
    {
      path: "/api/simulator",
      method: "POST",
      desc: "Advances operational simulation state by 1 step (progresses tickets from Pending ➔ Assigned ➔ On The Way ➔ Completed).",
      sampleParams: "",
    },
    {
      path: "/api/export/csv",
      method: "GET",
      desc: "Generates and streams dynamic CSV export of filtered booking records.",
      sampleParams: "?status=ALL",
    },
    {
      path: "/api/live-stream",
      method: "GET",
      desc: "Server-Sent Events (SSE) stream broadcasting real-time status transitions and live technician GPS telemetry.",
      sampleParams: "",
    },
    {
      path: "/api/docs",
      method: "GET",
      desc: "Full OpenAPI 3.0.3 specification JSON.",
      sampleParams: "",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FileCode2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            API Documentation & OpenAPI Gateway
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Interactive REST & SSE Real-time endpoints for Instant Mechanic SaaS platform
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-4 rounded-xl text-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-foreground">OpenAPI 3.0.3 Specification Active</span>
            <p className="text-muted-foreground mt-0.5">
              Base URL: <code className="text-primary font-mono font-semibold">/api</code>
            </p>
          </div>
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card text-foreground border border-border hover:bg-muted font-semibold transition"
          >
            Raw JSON Spec <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {endpoints.map((ep) => {
          const test = testResult[ep.path];
          const isLoading = loadingEndpoint === ep.path;

          return (
            <div
              key={ep.path}
              className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
                      ep.method === "GET"
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {ep.path}
                    <span className="text-muted-foreground font-normal">{ep.sampleParams}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(ep.path + ep.sampleParams)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs transition"
                    title="Copy full URL"
                  >
                    {copiedPath === ep.path + ep.sampleParams ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleTest(ep.path + ep.sampleParams, ep.method)}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {isLoading ? "Executing..." : "Try It Live"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">{ep.desc}</p>

              {/* Live Test Response Output */}
              {test && (
                <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800 text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          test.status === 200 || test.status === 201
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      />
                      HTTP {test.status} OK
                    </span>
                    <span>Response at {test.time}</span>
                  </div>
                  <pre className="max-h-52 overflow-y-auto text-emerald-400 text-[11px] whitespace-pre-wrap">
                    {typeof test.data === "object"
                      ? JSON.stringify(test.data, null, 2)
                      : String(test.data).slice(0, 400) + "..."}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
