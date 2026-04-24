import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top right, oklch(var(--primary) / 0.22), transparent 34%), radial-gradient(circle at bottom left, oklch(var(--primary) / 0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.36), rgba(248,251,248,0.82))",
        }}
      />
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:pl-[21rem]">
        <main className="relative min-h-screen px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="flex items-center justify-between px-5 py-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((value) => !value)}
              className="inline-flex items-center justify-center rounded-2xl border border-border/80 bg-white/90 px-3.5 py-3 text-foreground shadow-sm transition hover:bg-white"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mx-auto w-full max-w-[1480px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
