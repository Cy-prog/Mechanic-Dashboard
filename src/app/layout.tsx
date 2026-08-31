import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: "Instant Mechanic - Live Operations SaaS Dashboard",
  description:
    "Real-time Vehicle Service Operations, Live Dispatch, Telemetry, and Fleet Analytics Dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
            <Topbar />
            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
