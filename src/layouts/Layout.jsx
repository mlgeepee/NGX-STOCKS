import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { NGXLogo } from "@/components/ui/ngx-logo";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top right, oklch(var(--primary) / 0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(215,167,90,0.16), transparent 24%)",
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
      <div className="lg:pl-[22rem]">
        <main className="relative min-h-screen px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-white/55 px-3.5 py-2.5 shadow-sm backdrop-blur-sm dark:bg-white/5"
            >
              <span className="brand-mark h-10 w-10 rounded-[1.15rem]">
                <NGXLogo className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-accent-foreground">
                  NGX Stocks
                </span>
                <span className="block truncate text-sm text-muted-foreground">
                  Market workspace
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setIsSidebarOpen((value) => !value)}
              className="inline-flex items-center justify-center rounded-[1.25rem] border border-border/80 bg-white/75 px-3.5 py-3 text-foreground shadow-sm backdrop-blur-sm transition hover:border-primary/20 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
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
