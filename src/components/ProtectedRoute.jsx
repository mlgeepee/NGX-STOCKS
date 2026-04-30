import { Navigate } from "react-router-dom";
import { Component as LumaSpin } from "@/components/ui/luma-spin";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background text-foreground">
        <LumaSpin />
        <p className="text-sm font-medium text-muted-foreground">
          Restoring your market session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
