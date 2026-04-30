import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Sparkles, Star } from "lucide-react";
import { supabase } from "../services/supabase";
import { Alert } from "@/components/ui/alert";
import AuthShell from "@/components/AuthShell";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isSupabaseReady = Boolean(supabase);

  const requireSupabase = () => {
    if (isSupabaseReady) return true;
    setAlert({
      type: "error",
      message:
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in src/.env and restart Vite.",
    });
    return false;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!requireSupabase()) return;

    if (password !== confirmPassword) {
      setAlert({
        type: "warning",
        message: "Your passwords do not match yet. Please confirm them again.",
      });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setAlert({
        type: "success",
        message: "Check your email to confirm the new account.",
      });
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <>
      {alert ? (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      ) : null}

      <AuthShell
        backHref="/login"
        backLabel="Back to sign in"
        eyebrow="Create account"
        title="Start a market workspace that feels built for serious tracking."
        description="Create your account to save names, move between the dashboard and stock detail views, and keep your market context in one place."
        highlights={[
          {
            label: "Setup speed",
            value: "2 min",
            detail: "A short path from signup to live market monitoring",
            icon: Sparkles,
          },
          {
            label: "Watchlist flow",
            value: "Saved",
            detail: "Keep the companies you care about a click away",
            icon: Star,
          },
          {
            label: "Research feel",
            value: "Premium",
            detail: "Elegant surfaces for everyday market reading",
            icon: ShieldCheck,
          },
        ]}
      >
        {!isSupabaseReady ? (
          <div className="rounded-[1.45rem] border border-destructive/20 bg-destructive/10 px-4 py-4 text-sm leading-6 text-destructive">
            Supabase env vars are missing. Configure <code>src/.env</code> and
            restart the dev server.
          </div>
        ) : null}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="analyst@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="app-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="app-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="app-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="app-button-primary w-full">
            Create account
          </button>
        </form>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Already have an account? Pick up right where your board left off.</p>
          <Link
            to="/login"
            className="font-semibold text-accent-foreground hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </AuthShell>
    </>
  );
}
