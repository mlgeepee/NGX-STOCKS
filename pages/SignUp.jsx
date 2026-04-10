import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);
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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!requireSupabase()) return;

    if (password !== confirmPassword) {
      setAlert({
        type: "warning",
        message: "Passwords do not match.",
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
        message: "Check your email to confirm signup",
      });
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Top Navigation */}
      <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium transition text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO HOME
        </Link>
      </div>

      {/* Centered Form */}
      <div className="flex items-center justify-center flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-xl backdrop-blur-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account.
            </p>
          </div>

          {!isSupabaseReady ? (
            <div className="p-4 mt-4 text-sm border rounded-3xl border-destructive/20 bg-destructive/5 text-destructive-foreground">
              Supabase env vars are missing. Configure <code>src/.env</code> and
              restart the dev server.
            </div>
          ) : null}

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm border rounded-2xl border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm border rounded-2xl border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm border rounded-2xl border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-sm font-semibold transition shadow-xl text-white rounded-2xl bg-[oklch(0.6255_0.1741_149.0136)] shadow-[oklch(0.6255_0.1741_149.0136)]/20 hover:bg-[oklch(0.6255_0.1741_149.0136)]/90 focus:outline-none focus:ring-2 focus:ring-[oklch(0.6255_0.1741_149.0136)]/40"
            >
              Create account
            </button>
          </form>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span className="text-muted-foreground">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="transition text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
