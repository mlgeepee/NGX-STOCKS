import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../services/supabase";
import { Alert } from "@/components/ui/alert";
import AuthShell from "@/components/AuthShell";

export default function ResetPassword() {
  const navigate = useNavigate();
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
        message: "The new passwords do not match yet. Please confirm them again.",
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
        message: "Password updated successfully. Redirecting you to sign in.",
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
        eyebrow="Reset password"
        title="Set a new password and get back to the board."
        description="Choose a fresh password for your NGX Stocks account and continue tracking the exchange without losing your flow."
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter a new password"
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
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
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
            Update password
          </button>
        </form>
      </AuthShell>
    </>
  );
}
