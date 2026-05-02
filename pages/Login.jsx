import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../services/supabase";
import { Alert } from "@/components/ui/alert";
import AuthShell from "@/components/AuthShell";
import { getAppCopy } from "@/content/appCopy";
import { useAuthStore } from "../store/useAuthStore";
import { usePreferencesStore } from "../store/usePreferencesStore";

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
  const language = usePreferencesStore((state) => state.language);
  const copy = getAppCopy(language);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      message: copy.login.supabaseMissing,
    });
    return false;
  };

  const handleGoogleLogin = async () => {
    if (!requireSupabase()) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
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
        message: copy.login.resetNeedsEmail,
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setAlert({
        type: "success",
        message: copy.login.resetSent,
      });
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
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
    <>
      {alert ? (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      ) : null}

      <AuthShell
        backHref="/"
        backLabel={copy.common.backHome}
        eyebrow={copy.login.eyebrow}
        title={copy.login.title}
        description={copy.login.description}
      >
        {!isSupabaseReady ? (
          <div className="rounded-[1.45rem] border border-destructive/20 bg-destructive/10 px-4 py-4 text-sm leading-6 text-destructive">
            {copy.login.supabaseMissing}
          </div>
        ) : null}

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="app-button-secondary w-full gap-3"
          >
            <GoogleIcon />
            {copy.common.continueWithGoogle}
          </button>

          <div className="relative py-2 text-center">
            <span className="relative z-10 bg-white/70 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground dark:bg-card">
              {copy.common.orUseEmail}
            </span>
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/80" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                {copy.common.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                placeholder={copy.common.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="app-input"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  {copy.common.passwordLabel}
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground hover:text-foreground"
                >
                  {copy.common.resetPassword}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={copy.common.passwordPlaceholder}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="app-input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword
                      ? copy.common.hidePassword
                      : copy.common.showPassword
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="app-button-primary w-full">
              {copy.common.signInButton}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.login.footerText}</p>
          <Link
            to="/signup"
            className="font-semibold text-accent-foreground hover:text-foreground"
          >
            {copy.login.footerLink}
          </Link>
        </div>
      </AuthShell>
    </>
  );
}
