import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { useAuthStore } from "../store/useAuthStore";

// Google SVG Icon Component
const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.9999 12.24C21.9999 11.4933 21.9333 10.76 21.8066 10.0533H12.3333V14.16H17.9533C17.7333 15.3467 17.0133 16.3733 15.9666 17.08V19.68H19.5266C21.1933 18.16 21.9999 15.4533 21.9999 12.24Z"
      fill="#4285F4"
    />
    <path
      d="M12.3333 22C15.2333 22 17.6866 21.0533 19.5266 19.68L15.9666 17.08C15.0199 17.7333 13.7933 18.16 12.3333 18.16C9.52659 18.16 7.14659 16.28 6.27992 13.84H2.59326V16.5133C4.38659 20.0267 8.05992 22 12.3333 22Z"
      fill="#34A853"
    />
    <path
      d="M6.2799 13.84C6.07324 13.2267 5.9599 12.58 5.9599 11.92C5.9599 11.26 6.07324 10.6133 6.2799 10L2.59326 7.32667C1.86659 8.78667 1.45326 10.32 1.45326 11.92C1.45326 13.52 1.86659 15.0533 2.59326 16.5133L6.2799 13.84Z"
      fill="#FBBC05"
    />
    <path
      d="M12.3333 5.68C13.8933 5.68 15.3133 6.22667 16.3866 7.24L19.6 4.02667C17.68 2.29333 15.2266 1.33333 12.3333 1.33333C8.05992 1.33333 4.38659 3.97333 2.59326 7.32667L6.27992 10C7.14659 7.56 9.52659 5.68 12.3333 5.68Z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const isSupabaseReady = Boolean(supabase);

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  const requireSupabase = () => {
    if (isSupabaseReady) return true;
    setAlert({
      type: "error",
      message:
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in src/.env and restart Vite.",
    });
    return false;
  };

  const handleGoogleLogin = async () => {
    if (!requireSupabase()) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      setAlert({ type: "error", message: error.message });
    }
  };

  const handleResetPassword = async () => {
    if (!requireSupabase()) return;

    if (!email) {
      setAlert({
        type: "warning",
        message: "Please enter your email to reset password.",
      });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setAlert({
        type: "success",
        message: "Password reset email sent. Please check your inbox.",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!requireSupabase()) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setUser(data.user || null);
      navigate("/dashboard", { replace: true });
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
              Sign in to NGX Stocks
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to access your account.
            </p>
          </div>

          {!isSupabaseReady ? (
            <div className="p-4 mt-4 text-sm border rounded-3xl border-destructive/20 bg-destructive/5 text-destructive-foreground">
              Supabase env vars are missing. Configure <code>src/.env</code> and
              restart the dev server.
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold transition border text-foreground rounded-2xl border-border bg-secondary/50 hover:bg-secondary/70 focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              <GoogleIcon />
              Sign in with Google
            </button>

            <div className="relative py-3 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="relative px-3 bg-card">or continue with</span>
              <div className="absolute inset-x-0 h-px top-1/2 bg-border" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm border rounded-2xl border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-semibold transition shadow-xl text-white rounded-2xl bg-[oklch(0.6255_0.1741_149.0136)] shadow-[oklch(0.6255_0.1741_149.0136)]/20 hover:bg-[oklch(0.6255_0.1741_149.0136)]/90 focus:outline-none focus:ring-2 focus:ring-[oklch(0.6255_0.1741_149.0136)]/40"
              >
                Sign In
              </button>
            </form>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <button
                type="button"
                onClick={handleResetPassword}
                className="transition hover:text-foreground"
              >
                Forgot password?
              </button>
              <Link
                to="/signup"
                className="transition text-primary hover:text-primary/80"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
