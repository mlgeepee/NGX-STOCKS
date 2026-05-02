import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Sparkles, Star } from "lucide-react";
import { supabase } from "../services/supabase";
import { Alert } from "@/components/ui/alert";
import AuthShell from "@/components/AuthShell";
import { getAppCopy } from "@/content/appCopy";
import { usePreferencesStore } from "../store/usePreferencesStore";

export default function SignUp() {
  const navigate = useNavigate();
  const language = usePreferencesStore((state) => state.language);
  const copy = getAppCopy(language);
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
      message: copy.signup.supabaseMissing,
    });
    return false;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!requireSupabase()) return;

    if (password !== confirmPassword) {
      setAlert({
        type: "warning",
        message: copy.signup.passwordMismatch,
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
        message: copy.signup.success,
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
        backLabel={copy.common.backSignIn}
        eyebrow={copy.signup.eyebrow}
        title={copy.signup.title}
        description={copy.signup.description}
        highlights={copy.signup.highlights.map((item, index) => ({
          ...item,
          icon: [Sparkles, Star, ShieldCheck][index],
        }))}
      >
        {!isSupabaseReady ? (
          <div className="rounded-[1.45rem] border border-destructive/20 bg-destructive/10 px-4 py-4 text-sm leading-6 text-destructive">
            {copy.signup.supabaseMissing}
          </div>
        ) : null}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
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
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              {copy.common.passwordLabel}
            </label>
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

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              {copy.common.confirmPasswordLabel}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={copy.common.confirmPasswordPlaceholder}
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
                  showConfirmPassword
                    ? copy.common.hidePassword
                    : copy.common.showPassword
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
            {copy.common.createAccountButton}
          </button>
        </form>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.signup.footerText}</p>
          <Link
            to="/login"
            className="font-semibold text-accent-foreground hover:text-foreground"
          >
            {copy.signup.footerLink}
          </Link>
        </div>
      </AuthShell>
    </>
  );
}
