import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { Component as LumaSpin } from "@/components/ui/luma-spin";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Watchlist = lazy(() => import("../pages/WatchList"));
const Login = lazy(() => import("../pages/Login"));
const Layout = lazy(() => import("./layouts/Layout"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Landing = lazy(() => import("../pages/Landing"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const SignUp = lazy(() => import("../pages/SignUp"));
const StockDetail = lazy(() => import("../pages/StockDetail"));
const Learn = lazy(() => import("../pages/Learn"));

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <LumaSpin />
    </div>
  );
}

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      if (!supabase) {
        if (!isMounted) return;
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) {
          setAuthLoading(false);
          return;
        }
        setUser(data.session?.user || null);
      } catch (error) {
        if (!isMounted) {
          setAuthLoading(false);
          return;
        }
        console.error("Failed to restore auth session:", error);
        setUser(null);
      }

      if (!isMounted) return;
      setAuthLoading(false);
    };

    syncSession();

    if (!supabase) {
      return () => {
        isMounted = false;
      };
    }

    // Listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setUser(session?.user || null);
        setAuthLoading(false);
      },
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setUser, setAuthLoading]);

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="learn" element={<Learn />} />
          <Route path="stocks/:symbol" element={<StockDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
