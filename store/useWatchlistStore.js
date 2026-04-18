import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWatchlistStore = create(
    persist(
        (set) => ({
            watchlist: [],
            addStock: (stock) =>
                set((state) => {
                    if (state.watchlist.some((item) => item.symbol === stock.symbol)) {
                        return state;
                    }
                    return { watchlist: [...state.watchlist, stock] };
                }),
            removeStock: (symbol) =>
                set((state) => ({
                    watchlist: state.watchlist.filter((item) => item.symbol !== symbol),
                })),
            toggleStock: (stock) =>
                set((state) => {
                    if (state.watchlist.some((item) => item.symbol === stock.symbol)) {
                        return {
                            watchlist: state.watchlist.filter((item) => item.symbol !== stock.symbol),
                        };
                    }
                    return { watchlist: [...state.watchlist, stock] };
                }),
        }),
        {
            name: "ngx-watchlist",
        },
    ),
);
