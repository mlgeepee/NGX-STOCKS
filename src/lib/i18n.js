const TRANSLATIONS = {
    en: {
        sidebar: {
            brandTitle: "NGX Stocks",
            brandSubtitle: "Analytics cockpit",
            languageLabel: "Language",
            logout: "Logout",
            nav: {
                dashboard: {
                    label: "Dashboard",
                    description: "Market pulse",
                },
                watchlist: {
                    label: "Watchlist",
                    description: "Saved names",
                },
                learn: {
                    label: "Learn",
                    description: "Guides & signals",
                },
            },
        },
        header: {
            marketIntelligence: "Market Intelligence",
            searchPlaceholder: "Search by company or ticker",
            searchLabel: "Search stocks",
            analystTitle: "Market Analyst",
        },
        common: {
            refresh: "Refresh",
            noDataTitle: "No data found",
        },
        dashboard: {
            title: "Financial Analytics Dashboard",
            subtitle:
                "Track live NGX movers, scan sector momentum, and jump straight into price details from a single market workspace.",
            totalStocksLabel: "Total stocks",
            totalStocksDetail: "Tracked NGX equities in this view",
            gainersLabel: "Gainers",
            gainersDetail: "Names closing in positive territory",
            losersLabel: "Losers",
            losersDetail: "Names under pressure today",
            marketTrendLabel: "Market trend",
            marketBoardTitle: "Market board",
            marketBoardDescription:
                "Live pricing in Nigerian naira with watchlist shortcuts and quick drill-down access.",
            noStocksTitle: "No stocks matched your search",
            noStocksDescription: "Try a company name, ticker, or sector instead.",
            boardLoadingTitle: "Preparing market board",
            boardLoadingDescription:
                "Loading the latest stock rows and getting the board ready for you.",
            marketSummary: "{count} symbols • {average} average move",
            errorTitle: "Unable to load stocks",
            fetchingError: "Unable to load stock data.",
        },
        watchlist: {
            title: "Watchlist",
            subtitle:
                "Stay close to the companies you care about most and remove names the moment they fall out of your focus.",
            savedCount: "{count} saved",
            emptyTitle: "Your watchlist is empty",
            emptyDescription:
                "Bookmark stocks from the dashboard or a detail page to keep your shortlist one click away.",
            browseDashboard: "Browse the dashboard",
            noSearchTitle: "No saved stocks matched your search",
            noSearchDescription: "Try another company name or ticker.",
            savedNamesTitle: "Saved names",
            savedNamesDescription:
                "The same market table, narrowed to the stocks you chose to keep in focus.",
        },
        learn: {
            title: "Learn",
            subtitle:
                "A lightweight learning hub for market concepts that pair with the analytics views across the dashboard.",
            cards: {
                breadth: {
                    title: "Reading Market Breadth",
                    description:
                        "Learn how gainers, losers, and average market change combine into a fast view of sentiment.",
                },
                watchlists: {
                    title: "Building Better Watchlists",
                    description:
                        "Use sector balance, liquidity, and volatility to create watchlists that stay useful under pressure.",
                },
                risk: {
                    title: "Risk Management Basics",
                    description:
                        "Review position sizing, stop discipline, and the signals that matter before acting on a move.",
                },
            },
            glossaryTitle: "Quick glossary",
            glossary: {
                marketTrend: {
                    title: "Market trend",
                    description:
                        "A snapshot of the average percentage move across tracked stocks.",
                },
                volume: {
                    title: "Volume",
                    description:
                        "The number of shares traded over the selected market session.",
                },
                watchlist: {
                    title: "Watchlist",
                    description:
                        "A saved shortlist for quicker monitoring and faster follow-up.",
                },
            },
        },
        stockDetail: {
            fallbackTitle: "Stock detail",
            subtitle:
                "Review recent price action, compare short-term timeframes, and keep key trading stats in view.",
            back: "Back to dashboard",
            fetchError: "Unable to load {symbol} details right now.",
            unableLoadHistoryTitle: "Unable to load history",
            savedToWatchlist: "Saved to watchlist",
            addToWatchlist: "Add to watchlist",
            heroDescription:
                "Track price action, switch between D1, 1W, and 1M views, and scan the latest company-specific updates from one focused screen.",
            currentPrice: "Current price",
            priceHistoryTitle: "Price history",
            priceHistoryDescription:
                "Switch between intraday, weekly, and monthly movements.",
            periodLabel: "Period: {value}",
            priceLabel: "Price",
            rangeMove: "Range move",
            rangeHigh: "Range high",
            rangeLow: "Range low",
            marketStatsTitle: "Market stats",
            marketStatsDescription:
                "Key trading levels and liquidity markers for the current stock.",
            newsTitle: "Latest news",
            newsDescription:
                "Recent headlines and stock-specific updates connected to this company.",
            newsFallbackDescription:
                "A live news feed is not connected here yet, so these briefings keep the stock context visible.",
            liveNewsLabel: "Live feed",
            newsBriefingLabel: "Stock briefings",
            updatedOn: "Updated {value}",
            updatedOnFallback: "Recently updated",
            readMore: "Read more",
            noNewsTitle: "No recent updates yet",
            noNewsDescription:
                "There are no news items for this stock at the moment.",
            openPrice: "Open price",
            sessionHigh: "Session high",
            sessionLow: "Session low",
            volume: "Volume",
            errorFallback: "Unable to load stock history.",
        },
        table: {
            company: "Company",
            price: "Price",
            change: "Change",
            volume: "Volume",
            save: "Save",
            action: "Action",
            actionRemove: "Remove from watchlist",
            actionToggle: "Toggle watchlist",
            tapForDetails: "Tap to open full stock details",
        },
    },
    pid: {
        sidebar: {
            brandTitle: "NGX Stocks",
            brandSubtitle: "Analytics cockpit",
            languageLabel: "Language",
            logout: "Logout",
            nav: {
                dashboard: {
                    label: "Dashboard",
                    description: "Market gist",
                },
                watchlist: {
                    label: "Watchlist",
                    description: "Saved names",
                },
                learn: {
                    label: "Learn",
                    description: "Guides & signals",
                },
            },
        },
        header: {
            marketIntelligence: "Market gist",
            searchPlaceholder: "Search company or ticker",
            searchLabel: "Search stocks",
            analystTitle: "Market Analyst",
        },
        common: {
            refresh: "Refresh",
            noDataTitle: "No data",
        },
        dashboard: {
            title: "Financial Analytics Dashboard",
            subtitle:
                "See live NGX movers, sector momentum, and jump quick into price details.",
            totalStocksLabel: "Total stocks",
            totalStocksDetail: "NGX stocks wey dey for this view",
            gainersLabel: "Gainers",
            gainersDetail: "Names wey dey up today",
            losersLabel: "Losers",
            losersDetail: "Names wey dey fall today",
            marketTrendLabel: "Market trend",
            marketBoardTitle: "Market board",
            marketBoardDescription:
                "Live naira price with watchlist shortcuts and fast drill-down.",
            noStocksTitle: "No stock match your search",
            noStocksDescription: "Try company name, ticker, or sector again.",
            boardLoadingTitle: "Dey prepare market board",
            boardLoadingDescription:
                "Loading latest stock rows and setting the board for you.",
            marketSummary: "{count} symbols • {average} average move",
            errorTitle: "No fit load stocks",
            fetchingError: "Unable to load stock data.",
        },
        watchlist: {
            title: "Watchlist",
            subtitle:
                "Keep eye for companies wey you care about and remove them once dem no dey your focus.",
            savedCount: "{count} saved",
            emptyTitle: "Your watchlist empty",
            emptyDescription:
                "Bookmark stocks for dashboard or detail page make your shortlist dey quick.",
            browseDashboard: "Go dashboard",
            noSearchTitle: "No saved stock match your search",
            noSearchDescription: "Try another company name or ticker.",
            savedNamesTitle: "Saved names",
            savedNamesDescription:
                "Same market table, but only the stocks wey you choose.",
        },
        learn: {
            title: "Learn",
            subtitle:
                "Small learning hub for market concepts wey go help your analytics views.",
            cards: {
                breadth: {
                    title: "Reading Market Breadth",
                    description:
                        "See how gainers, losers, and average move join body to show market mood.",
                },
                watchlists: {
                    title: "Building Better Watchlists",
                    description:
                        "Use sector balance, liquidity and volatility to build watchlist wey still dey sharp.",
                },
                risk: {
                    title: "Risk Management Basics",
                    description:
                        "Check position sizing, stop discipline, and signals wey matter before you move.",
                },
            },
            glossaryTitle: "Quick glossary",
            glossary: {
                marketTrend: {
                    title: "Market trend",
                    description:
                        "Snapshot of average percentage move for tracked stocks.",
                },
                volume: {
                    title: "Volume",
                    description:
                        "How many shares don change hand for this market session.",
                },
                watchlist: {
                    title: "Watchlist",
                    description:
                        "Saved shortlist for quicker monitoring and quick follow-up.",
                },
            },
        },
        stockDetail: {
            fallbackTitle: "Stock detail",
            subtitle:
                "See recent price action, compare short-term timeframes, and keep key stats for eye.",
            back: "Go back dashboard",
            fetchError: "No fit load {symbol} details right now.",
            unableLoadHistoryTitle: "No fit load history",
            savedToWatchlist: "Don save for watchlist",
            addToWatchlist: "Add to watchlist",
            heroDescription:
                "Check price action, switch between D1, 1W, and 1M view, and see latest company gist from one page.",
            currentPrice: "Current price",
            priceHistoryTitle: "Price history",
            priceHistoryDescription:
                "Change between intraday, weekly, and monthly moves.",
            periodLabel: "Period: {value}",
            priceLabel: "Price",
            rangeMove: "Range move",
            rangeHigh: "Range high",
            rangeLow: "Range low",
            marketStatsTitle: "Market stats",
            marketStatsDescription:
                "Main trading levels and liquidity markers for this stock.",
            newsTitle: "Latest news",
            newsDescription:
                "Recent headline and stock gist wey connect to this company.",
            newsFallbackDescription:
                "Live news feed never connect here yet, so these briefings go still give you stock context.",
            liveNewsLabel: "Live feed",
            newsBriefingLabel: "Stock briefing",
            updatedOn: "Updated {value}",
            updatedOnFallback: "Recently updated",
            readMore: "Read more",
            noNewsTitle: "No recent update yet",
            noNewsDescription:
                "No news item dey for this stock for now.",
            openPrice: "Open price",
            sessionHigh: "Session high",
            sessionLow: "Session low",
            volume: "Volume",
            errorFallback: "Unable to load stock history.",
        },
        table: {
            company: "Company",
            price: "Price",
            change: "Change",
            volume: "Volume",
            save: "Save",
            action: "Action",
            actionRemove: "Remove from watchlist",
            actionToggle: "Toggle watchlist",
            tapForDetails: "Tap to open full stock details",
        },
    },
};

export function translate(language, path, variables = {}) {
    const keys = path.split(".");
    let value = TRANSLATIONS[language];

    for (const key of keys) {
        if (value == null) break;
        value = value[key];
    }

    if (typeof value !== "string") {
        return path;
    }

    return Object.entries(variables).reduce(
        (text, [variable, replacement]) =>
            text.replace(new RegExp(`\\{${variable}\\}`, "g"), replacement),
        value,
    );
}
