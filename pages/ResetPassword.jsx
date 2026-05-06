import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../services/supabase";
import { Alert } from "@/components/ui/alert";
import AuthLandingShell from "@/components/AuthLandingShell";
import { getAppCopy } from "@/content/appCopy";
import { usePreferencesStore } from "../store/usePreferencesStore";

export default function ResetPassword() {
  const navigate = useNavigate();
  const language = usePreferencesStore((state) => state.language);
  const copy = getAppCopy(language);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setAlert({
        type: "warning",
        message: copy.reset.mismatch,
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setAlert({
        type: "success",
        message: copy.reset.success,
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

      <AuthLandingShell
        backHref="/login"
        backLabel={copy.common.backSignIn}
        eyebrow={copy.reset.eyebrow}
        title={copy.reset.title}
        description={copy.reset.description}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          {/*
            Password requirements UI (simple + polished).
            We display the rules under the password field as requested.
          */}
          {(() => {
            const hasMinLength = password.length >= 8;
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecial = /[^A-Za-z0-9]/.test(password);

            return (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    {copy.common.newPasswordLabel}
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={copy.common.newPasswordPlaceholder}
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

                  <div className="rounded-[1rem] border border-border/70 bg-white/40 p-3.5 backdrop-blur-sm dark:bg-white/5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Password need to contain
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      <li className="flex items-start gap-2 text-[12px] leading-5 text-muted-foreground">
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            hasUppercase ||
                            hasLowercase ||
                            hasNumber ||
                            hasSpecial
                              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                              : "border-border bg-white/30 text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        >
                          {hasUppercase ||
                          hasLowercase ||
                          hasNumber ||
                          hasSpecial
                            ? "✓"
                            : "•"}
                        </span>
                        <span className="font-medium">
                          Uppercase, lowercase, number etc.
                        </span>
                      </li>

                      <li className="flex items-start gap-2 text-[12px] leading-5 text-muted-foreground">
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            hasMinLength
                              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                              : "border-border bg-white/30 text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        >
                          {hasMinLength ? "✓" : "•"}
                        </span>
                        <span className="font-medium">
                          At least 8 characters
                        </span>
                      </li>

                      <li className="flex items-start gap-2 text-[12px] leading-5 text-muted-foreground">
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            hasUppercase
                              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                              : "border-border bg-white/30 text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        >
                          {hasUppercase ? "✓" : "•"}
                        </span>
                        <span className="font-medium">
                          Uppercase letter (A-Z)
                        </span>
                      </li>

                      <li className="flex items-start gap-2 text-[12px] leading-5 text-muted-foreground">
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            hasLowercase
                              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                              : "border-border bg-white/30 text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        >
                          {hasLowercase ? "✓" : "•"}
                        </span>
                        <span className="font-medium">
                          Lowercase letter (a-z)
                        </span>
                      </li>

                      <li className="flex items-start gap-2 text-[12px] leading-5 text-muted-foreground">
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            hasNumber
                              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                              : "border-border bg-white/30 text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        >
                          {hasNumber ? "✓" : "•"}
                        </span>
                        <span className="font-medium">Number (0-9)</span>
                      </li>

                      <li className="flex items-start gap-2 text-[12px] leading-5 text-muted-foreground">
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            hasSpecial
                              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                              : "border-border bg-white/30 text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        >
                          {hasSpecial ? "✓" : "•"}
                        </span>
                        <span className="font-medium">
                          Special character (!@# etc.)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-foreground"
                  >
                    {copy.common.confirmNewPasswordLabel}
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={copy.common.confirmPasswordPlaceholder}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
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
                  {copy.common.updatePasswordButton}
                </button>
              </>
            );
          })()}
        </form>
      </AuthLandingShell>
    </>
  );
}
