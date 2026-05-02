import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../services/supabase";
import { Alert } from "@/components/ui/alert";
import AuthShell from "@/components/AuthShell";
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

      <AuthShell
        backHref="/login"
        backLabel={copy.common.backSignIn}
        eyebrow={copy.reset.eyebrow}
        title={copy.reset.title}
        description={copy.reset.description}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
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
            {copy.common.updatePasswordButton}
          </button>
        </form>
      </AuthShell>
    </>
  );
}
