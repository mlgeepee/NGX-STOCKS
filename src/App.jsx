import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Watchlist from "../pages/WatchList";
import Login from "../pages/Login";
import Layout from "./layouts/Layout";
import { useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuthStore } from "../store/useAuthStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "../pages/Landing";
import ResetPassword from "../pages/ResetPassword";
import SignUp from "../pages/SignUp";

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

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
          return;
        }
        setUser(data.session?.user || null);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to restore auth session:", error);
        setUser(null);
      } finally {
        if (!isMounted) return;
        setAuthLoading(false);
      }
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
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
