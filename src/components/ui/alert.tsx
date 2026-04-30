import * as React from "react";
import { X } from "lucide-react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose?: () => void;
  duration?: number;
}

export function Alert({
  message,
  type = "info",
  onClose,
  duration = 5000,
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.819-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-accent-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "border-emerald-200/80 bg-emerald-50/90 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100";
      case "error":
        return "border-rose-200/80 bg-rose-50/90 text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100";
      case "warning":
        return "border-amber-200/80 bg-amber-50/90 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100";
      default:
        return "border-primary/20 bg-card/95 text-foreground dark:bg-card/95";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 top-4 z-50 w-[min(26rem,calc(100vw-2rem))] duration-300 animate-in slide-in-from-right-full">
      <div
        className={`relative overflow-hidden rounded-[1.5rem] border p-4 shadow-panel backdrop-blur-xl ${getBackgroundColor()}`}
      >
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium leading-6">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 inline-flex rounded-full p-1.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useAlert() {
  const [alerts, setAlerts] = React.useState<
    Array<{ id: string; message: string; type: any; duration: number }>
  >([]);

  const showAlert = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    duration = 5000,
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const AlertContainer = () => (
    <div className="fixed z-50 space-y-2 top-4 right-4">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );

  return { showAlert, AlertContainer };
}
