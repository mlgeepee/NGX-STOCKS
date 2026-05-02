import { create } from "zustand";
import { persist } from "zustand/middleware";

function createAlertId() {
  return `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeAlert(alert = {}) {
  return {
    id: alert.id || createAlertId(),
    symbol: String(alert.symbol || "").toUpperCase(),
    name: alert.name || "",
    sector: alert.sector || "",
    direction: alert.direction === "below" ? "below" : "above",
    targetPrice: Number(alert.targetPrice) || 0,
    createdAt: alert.createdAt || new Date().toISOString(),
  };
}

export const useAlertsStore = create(
  persist(
    (set) => ({
      alerts: [],
      addAlert: (alert) =>
        set((state) => ({
          alerts: [...state.alerts, normalizeAlert(alert)],
        })),
      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((item) => item.id !== id),
        })),
      clearAlerts: () => set({ alerts: [] }),
    }),
    {
      name: "ngx-alerts",
    },
  ),
);
