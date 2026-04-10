import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert } from "@/components/ui/alert";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlert({
        type: "warning",
        message: "Passwords do not match.",
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
        message: "Password updated successfully!",
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
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium transition text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO LOGIN
        </Link>
      </div>

      {/* Centered Form */}
      <div className="flex items-center justify-center flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-xl backdrop-blur-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Set New Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-foreground"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
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
                placeholder="Confirm new password"
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
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
