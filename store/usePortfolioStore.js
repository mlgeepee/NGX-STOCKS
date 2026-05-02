import { create } from "zustand";
import { persist } from "zustand/middleware";

function normalizePosition(position = {}) {
  return {
    symbol: String(position.symbol || "").toUpperCase(),
    name: position.name || "",
    sector: position.sector || "",
    logo: position.logo || "",
    shares: Number(position.shares) || 0,
    averageCost: Number(position.averageCost) || 0,
    updatedAt: position.updatedAt || new Date().toISOString(),
  };
}

export const usePortfolioStore = create(
  persist(
    (set) => ({
      positions: [],
      upsertPosition: (position) =>
        set((state) => {
          const normalized = normalizePosition(position);
          const existingIndex = state.positions.findIndex(
            (item) => item.symbol === normalized.symbol,
          );

          if (existingIndex === -1) {
            return { positions: [...state.positions, normalized] };
          }

          const nextPositions = [...state.positions];
          nextPositions[existingIndex] = {
            ...nextPositions[existingIndex],
            ...normalized,
          };

          return { positions: nextPositions };
        }),
      removePosition: (symbol) =>
        set((state) => ({
          positions: state.positions.filter(
            (item) => item.symbol !== String(symbol || "").toUpperCase(),
          ),
        })),
      clearPortfolio: () => set({ positions: [] }),
    }),
    {
      name: "ngx-portfolio",
    },
  ),
);
