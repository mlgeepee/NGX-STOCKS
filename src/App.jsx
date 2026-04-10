import { Routes, Route } from "react-router-dom";
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

  useEffect(() => {
    if (!supabase) return;

    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    // Listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="watchlist" element={<Watchlist />} />
      </Route>
    </Routes>
  );
}
