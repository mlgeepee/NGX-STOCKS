import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isSupabaseReady = Boolean(supabase);

  const requireSupabase = () => {
    if (isSupabaseReady) return true;
    alert(
      "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in src/.env and restart Vite.",
    );
    return false;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!requireSupabase()) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm signup");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-slate-950 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-[0_40px_120px_-20px_rgba(15,23,42,0.75)] backdrop-blur-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-sm text-slate-400">
            Enter your email below to create your account.
          </p>
        </div>

        {!isSupabaseReady ? (
          <div className="p-4 text-sm border rounded-3xl border-rose-500/20 bg-rose-500/5 text-rose-200">
            Supabase env vars are missing. Configure <code>src/.env</code> and
            restart the dev server.
          </div>
        ) : null}

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
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
              placeholder="Create your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm border rounded-2xl border-slate-700 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-slate-200"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm border rounded-2xl border-slate-700 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-semibold text-white transition shadow-xl rounded-2xl bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          >
            Create account
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
          <span className="text-slate-500">Already have an account?</span>
          <Link
            to="/login"
            className="transition text-emerald-400 hover:text-emerald-300"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
