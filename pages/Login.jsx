import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSupabaseReady = Boolean(supabase);

  const requireSupabase = () => {
    if (isSupabaseReady) return true;
    alert(
      "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in src/.env and restart Vite.",
    );
    return false;
  };

  const handleGoogleLogin = async () => {
    if (!requireSupabase()) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/app",
      },
    });
  };

  const handleResetPassword = async () => {
    if (!requireSupabase()) return;

    if (!email) {
      alert("Please enter your email to reset password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Password reset email sent. Please check your inbox.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!requireSupabase()) return;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate("/app");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-slate-950 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-[0_40px_120px_-20px_rgba(15,23,42,0.75)] backdrop-blur-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Sign in to NGX Stocks
          </h1>
          <p className="text-sm text-slate-400">
            Enter your email below to access your account.
          </p>
        </div>

        {!isSupabaseReady ? (
          <div className="p-4 text-sm border rounded-3xl border-rose-500/20 bg-rose-500/5 text-rose-200">
            Supabase env vars are missing. Configure <code>src/.env</code> and
            restart the dev server.
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold text-white transition border rounded-2xl border-white/10 bg-white/10 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>

          <div className="relative py-3 text-center text-xs uppercase tracking-[0.25em] text-slate-500">
            <span className="relative px-3 bg-slate-900">or continue with</span>
            <div className="absolute inset-x-0 h-px top-1/2 bg-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-slate-200"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm border rounded-2xl border-slate-700 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm border rounded-2xl border-slate-700 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-sm font-semibold text-white transition shadow-xl rounded-2xl bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <button
              type="button"
              onClick={handleResetPassword}
              className="transition hover:text-white"
            >
              Forgot password?
            </button>
            <Link
              to="/signup"
              className="transition text-emerald-400 hover:text-emerald-300"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
