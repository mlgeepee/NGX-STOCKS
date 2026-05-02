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
                    description: "Names wey you save",
                },
                portfolio: {
                    label: "Portfolio",
                    description: "Holdings and P/L",
                },
                learn: {
                    label: "Stocks101 (Learn)",
                    description: "Investor learn hub",
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
            savedNamesTitle: "Names wey you save",
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
            loadingHistory: "Loading stock history",
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
            brandSubtitle: "Market control room",
            languageLabel: "Language",
            logout: "Log out",
            nav: {
                dashboard: {
                    label: "Dashboard",
                    description: "Market gist",
                },
                watchlist: {
                    label: "Watchlist",
                    description: "Saved names",
                },
                portfolio: {
                    label: "Portfolio",
                    description: "Holdings and P/L",
                },
                learn: {
                    label: "Stocks101 (Learn)",
                    description: "How market take work",
                },
            },
        },
        header: {
            marketIntelligence: "Market gist",
            searchPlaceholder: "Find company name or ticker",
            searchLabel: "Search stocks",
            analystTitle: "Market watcher",
        },
        common: {
            refresh: "Refresh am",
            noDataTitle: "No data",
        },
        dashboard: {
            title: "NGX market dashboard",
            subtitle:
                "See NGX movers, sector movement, and jump quick quick enter company detail from one board.",
            totalStocksLabel: "Total stocks",
            totalStocksDetail: "NGX stocks wey show for this view",
            gainersLabel: "Gainers",
            gainersDetail: "Names wey green for today",
            losersLabel: "Losers",
            losersDetail: "Names wey red for today",
            marketTrendLabel: "Market direction",
            marketBoardTitle: "Market board",
            marketBoardDescription:
                "Naira price, watchlist shortcut, and quick road enter company detail.",
            noStocksTitle: "No stock match wetin you search",
            noStocksDescription: "Try another company name, ticker, or sector.",
            boardLoadingTitle: "Dey prepare market board",
            boardLoadingDescription:
                "We dey load latest stock rows and set the board for you.",
            marketSummary: "{count} symbols • {average} average move",
            errorTitle: "No fit load stocks",
            fetchingError: "No fit load stock data.",
        },
        watchlist: {
            title: "Watchlist",
            subtitle:
                "Keep eye on the companies wey matter to you and remove any one wey comot for your focus.",
            savedCount: "{count} saved",
            emptyTitle: "Your watchlist never get anything yet",
            emptyDescription:
                "Save stocks from dashboard or detail page make your shortlist dey handy anytime.",
            browseDashboard: "Go dashboard",
            noSearchTitle: "No saved stock match wetin you search",
            noSearchDescription: "Try another company name or ticker.",
            savedNamesTitle: "Saved names",
            savedNamesDescription:
                "Na the same market table, but only the stocks wey you choose.",
        },
        learn: {
            title: "Plan and learn",
            subtitle:
                "Small learning hub for market concepts and product plan wey support the analytics views.",
            cards: {
                breadth: {
                    title: "How to read market breadth",
                    description:
                        "See how gainers, losers, and average move join body show market mood.",
                },
                watchlists: {
                    title: "How to build better watchlists",
                    description:
                        "Use sector balance, liquidity, and volatility take build watchlist wey still sharp.",
                },
                risk: {
                    title: "Risk management basics",
                    description:
                        "Check position sizing, stop discipline, and the signals wey matter before you move.",
                },
            },
            glossaryTitle: "Quick glossary",
            glossary: {
                marketTrend: {
                    title: "Market direction",
                    description:
                        "Short snapshot of average percentage move for the tracked stocks.",
                },
                volume: {
                    title: "Volume",
                    description:
                        "How many shares don change hand for this market session.",
                },
                watchlist: {
                    title: "Watchlist",
                    description:
                        "Saved shortlist wey help you monitor and follow up fast.",
                },
            },
        },
        stockDetail: {
            fallbackTitle: "Stock detail",
            subtitle:
                "Check recent price action, compare short time view, and keep key stats for eye.",
            back: "Go back to dashboard",
            loadingHistory: "Dey load stock history",
            fetchError: "No fit load {symbol} details right now.",
            unableLoadHistoryTitle: "No fit load history",
            savedToWatchlist: "Don save for watchlist",
            addToWatchlist: "Add to watchlist",
            heroDescription:
                "Check price action, switch between D1, 1W, and 1M view, and see latest company gist for one page.",
            currentPrice: "Current price",
            priceHistoryTitle: "Price history",
            priceHistoryDescription:
                "Switch between intraday, weekly, and monthly move.",
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
                "Live news feed never connect here yet, so these briefings go still give you company context.",
            liveNewsLabel: "Live feed",
            newsBriefingLabel: "Stock briefing",
            updatedOn: "Updated {value}",
            updatedOnFallback: "Just update am now now",
            readMore: "Read more",
            noNewsTitle: "No recent update yet",
            noNewsDescription:
                "No news item dey for this stock for now.",
            openPrice: "Open price",
            sessionHigh: "Session high",
            sessionLow: "Session low",
            volume: "Volume",
            errorFallback: "No fit load stock history.",
        },
        table: {
            company: "Company",
            price: "Price",
            change: "Change",
            volume: "Volume",
            save: "Save am",
            action: "Action",
            actionRemove: "Comot from watchlist",
            actionToggle: "Add or comot watchlist",
            tapForDetails: "Tap am make full stock details open",
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
