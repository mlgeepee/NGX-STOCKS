import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top right, oklch(var(--primary) / 0.22), transparent 34%), radial-gradient(circle at bottom left, oklch(var(--primary) / 0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.36), rgba(248,251,248,0.82))",
        }}
      />
      <Sidebar />
      <div className="pl-28 lg:pl-[21rem]">
        <main className="relative min-h-screen px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="mx-auto w-full max-w-[1480px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
