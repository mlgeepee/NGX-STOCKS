import { create } from "zustand";
import { supabase } from "../services/supabase";

export const useWatchlistStore = create((set, get) => ({
    userId: null,
    watchlist: [],

    setUserId: (userId) => set({ userId }),

    setWatchlist: (watchlist) => set({ watchlist }),

    loadWatchlistForUser: async (userIdOverride) => {
        const userId = userIdOverride ?? get().userId;
        if (!userId || !supabase) return;

        const { data, error } = await supabase
            .from("watchlist")
            .select("stock_symbol")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Failed to load watchlist:", error);
            return;
        }

        const symbols = Array.isArray(data) ? data.map((row) => row.stock_symbol) : [];
        // Store shape matches existing UI: [{ symbol: string, ...optionalEnrichment }]
        set({
            watchlist: symbols
                .filter(Boolean)
                .map((symbol) => ({ symbol: String(symbol) })),
        });
    },

    addStock: async (stock) => {
        const symbol = stock?.symbol;
        if (!symbol) return;

        // Update local state first (optimistic)
        set((state) => {
            if (state.watchlist.some((item) => item.symbol === symbol)) return state;
            return { watchlist: [...state.watchlist, stock] };
        });

        const { userId } = get();
        if (!userId || !supabase) return;

        // Ensure one row per (user, symbol)
        // If there's a unique constraint, upsert is the safest.
        await supabase
            .from("watchlist")
            .upsert(
                { user_id: userId, stock_symbol: symbol },
                { onConflict: "user_id,stock_symbol" },
            );
    },

    removeStock: async (symbol) => {
        if (!symbol) return;

        set((state) => ({
            watchlist: state.watchlist.filter((item) => item.symbol !== symbol),
        }));

        const { userId } = get();
        if (!userId || !supabase) return;

        await supabase
            .from("watchlist")
            .delete()
            .eq("user_id", userId)
            .eq("stock_symbol", symbol);
    },

    toggleStock: async (stock) => {
        const symbol = stock?.symbol;
        if (!symbol) return;

        const exists = get().watchlist.some((item) => item.symbol === symbol);
        if (exists) {
            await get().removeStock(symbol);
        } else {
            await get().addStock(stock);
        }
    },
}));
