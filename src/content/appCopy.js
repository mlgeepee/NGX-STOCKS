const APP_COPY = {
  en: {
    common: {
      login: "Log in",
      createAccount: "Create account",
      goToDashboard: "Go to dashboard",
      loadingWorkspace: "Loading workspace",
      backHome: "Back to home",
      backSignIn: "Back to sign in",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      switchTheme: "Switch the workspace atmosphere",
      menu: "Menu",
      languageEnglish: "English",
      languagePidgin: "Pidgin",
      workspace: "Workspace",
      emailLabel: "Email address",
      emailPlaceholder: "investor@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      newPasswordLabel: "New password",
      newPasswordPlaceholder: "Enter a new password",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Confirm your password",
      confirmNewPasswordLabel: "Confirm new password",
      continueWithGoogle: "Continue with Google",
      orUseEmail: "Or use email",
      resetPassword: "Forgot password?",
      readMore: "Read more",
      signInButton: "Open my dashboard",
      createAccountButton: "Create my account",
      updatePasswordButton: "Update password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      closeSidebar: "Close sidebar",
    },
    authShell: {
      brandSubtitle: "NGX market board, watchlist, alerts, and portfolio flow",
      heroKicker: "Built for NGX investors and active market watchers",
      heroTitle:
        "Track Nigerian stocks, company news, alerts, and portfolio moves from one clear workspace.",
      heroDescription:
        "Use one account to follow NGX price action, save names, review company detail, monitor valuation signals, and prepare for the next session.",
      spotlightRows: [
        "Live or delayed NGX price board with company drill-down",
        "Watchlist, alerts, and portfolio tracking in one flow",
        "Charts, P/E, market cap, dividend, and sector context",
      ],
      highlights: [
        {
          label: "Coverage",
          value: "140+",
          detail: "Tracked NGX names ready for dashboard and detail views.",
        },
        {
          label: "Core tools",
          value: "Board",
          detail:
            "Watchlist, price moves, basic charts, and company-level market stats.",
        },
        {
          label: "Next layer",
          value: "Alerts",
          detail:
            "Portfolio P/L, valuation, sector analysis, and dividend planning.",
        },
      ],
      unlockLabel: "What this account gives you",
      unlockTitle:
        "A single place to watch prices, save stocks, plan alerts, and follow company updates.",
      unlockChip:
        "Watchlist, charts, portfolio P/L, alerts, valuation, and NGX news flow",
    },
    login: {
      eyebrow: "Sign in",
      title: "Open your NGX workspace and continue from your watchlist.",
      description:
        "Use email or Google sign-in to enter the market board, check live or delayed prices, and jump back into the stocks you are tracking.",
      supabaseMissing:
        "Supabase env vars are missing. Configure src/.env and restart the dev server.",
      resetNeedsEmail:
        "Enter your email first so the reset link goes to the right inbox.",
      resetSent:
        "Password reset email sent. Check your inbox and continue from the reset screen.",
      footerText: "New here? Create a market workspace for your NGX flow.",
      footerLink: "Create account",
    },
    signup: {
      eyebrow: "Create account",
      title: "Set up a workspace for NGX prices, watchlists, and portfolio tracking.",
      description:
        "Create your account to save favorite stocks, follow company detail, and prepare for alerts, valuation, and portfolio features as the platform grows.",
      supabaseMissing:
        "Supabase env vars are missing. Configure src/.env and restart the dev server.",
      passwordMismatch:
        "Your passwords do not match yet. Confirm both fields and try again.",
      success: "Check your email to confirm the new account.",
      footerText: "Already have an account? Return to your market board.",
      footerLink: "Sign in",
      highlights: [
        {
          label: "Fast start",
          value: "2 min",
          detail: "A short route from signup to NGX price tracking.",
        },
        {
          label: "Watchlist flow",
          value: "Saved",
          detail: "Keep the stocks you care about one click away.",
        },
        {
          label: "Feature path",
          value: "Ready",
          detail: "Prepared for alerts, portfolio P/L, and valuation tools.",
        },
      ],
    },
    reset: {
      eyebrow: "Reset password",
      title: "Set a new password and return to your NGX market board.",
      description:
        "Choose a fresh password so you can get back to charts, watchlists, and company detail without losing your flow.",
      mismatch:
        "The new passwords do not match yet. Confirm them and try again.",
      success: "Password updated successfully. Redirecting you to sign in.",
    },
    landing: {
      brandSubtitle: "NGX price board, watchlist, alerts, and portfolio planning",
      heroKicker: "Nigerian stock market analytics built around actual NGX workflows",
      heroTitle:
        "Track NGX prices, follow company detail, and line up your next move from one board.",
      heroDescription:
        "NGX Stocks helps Nigerian investors and traders read market breadth, save favorite names, inspect company charts, track portfolio P/L, and stay close to dividend and sector signals.",
      secondaryCta: "Enter the sign-in flow",
      trustStrip: [
        "Watchlist and company detail built around NGX names",
        "Price board, charts, market stats, and company briefings",
        "Portfolio P/L, sector radar, dividends, and investor education",
      ],
      stats: [
        {
          label: "Tracked names",
          value: "140+",
          detail: "NGX stocks organized for repeat daily monitoring.",
        },
        {
          label: "Core tools",
          value: "5",
          detail: "Board, watchlist, stock detail, charts, and learn hub.",
        },
        {
          label: "Live features",
          value: "Portfolio",
          detail: "Portfolio P/L, alerts, dividend calendar, and sector radar.",
        },
      ],
      preview: {
        kicker: "Market pulse",
        title: "Dashboard built around real NGX monitoring",
        avgMove: "+0.84% average move",
        researchTitle: "Platform coverage",
        researchCards: [
          {
            title: "Dashboard",
            detail: "Prices, breadth, volume, and quick company search.",
          },
          {
            title: "Stock detail",
            detail: "Charts, market stats, news, and valuation-ready slots.",
          },
          {
            title: "Alerts and portfolio",
            detail: "Portfolio P/L, target price alerts, and saved holdings.",
          },
        ],
        boardTitle: "Live board preview",
        boardSubtitle: "Quick scan of active NGX names",
        commandKicker: "Next on the board",
        commandText:
          "Search a company, move into stock detail, and prepare for alerts, P/E, market cap, and portfolio follow-up.",
      },
      features: [
        {
          title: "Watchlist, alerts, and price follow-up",
          description:
            "Save NGX names, prepare target-price alerts, and keep the right stocks close before the next session starts.",
        },
        {
          title: "Company detail with charts and market stats",
          description:
            "Move from the board into one stock page with price history, latest news, session stats, and room for valuation metrics.",
        },
        {
          title: "Portfolio, dividends, sectors, and signals",
          description:
            "Track holdings, watch dividend dates, compare sector leadership, and keep valuation context close before you act.",
        },
      ],
      roadmap: {
        kicker: "Inside the workspace",
        title: "Use real tools for prices, holdings, alerts, sectors, and learning.",
        description:
          "The app already brings market breadth, portfolio P/L, alert tracking, dividend dates, sector monitoring, and a learn hub into one NGX workflow.",
        cta: "Open the learn hub",
        cards: [
          {
            title: "Portfolio tracker",
            detail:
              "Save holdings, track cost basis, review market value, and monitor unrealized P/L as prices move.",
          },
          {
            title: "Sector radar",
            detail:
              "Compare NGX sector leadership, breadth, and the names driving today's market direction.",
          },
          {
            title: "Learn hub",
            detail:
              "Understand P/E, market cap, dividends, risk, and how to build conviction before you invest.",
          },
        ],
      },
      final: {
        kicker: "Ready to begin?",
        title: "Start with the board and grow your conviction from data.",
        description:
          "Create an account, save your names, follow price action, track your holdings, and keep learning the market from inside the app.",
      },
    },
    dashboard: {
      leadKicker: "Market breadth",
      leadTitle:
        "Read today’s NGX movement from one board before you drill into any stock.",
      leadDescription:
        "Use the lead card to spot trend, top gainer, most active name, and watchlist focus before you scan the full market table.",
      trendLabel: "Trend",
      topGainerLabel: "Top gainer",
      topGainerEmpty: "Waiting for the strongest move to settle.",
      mostActiveLabel: "Most active",
      mostActiveEmpty: "Volume signal still loading.",
      sharesSuffix: "shares",
      watchlistFocusLabel: "Watchlist focus",
      watchlistFocusDetail:
        "Saved names ready for faster follow-up when price action changes.",
      watchlistReady: "Watchlist ready",
      savedNamesLabel: "Saved names",
      savedNamesDetail: "Stocks already pinned to your personal watchlist.",
      boardKicker: "Market board",
      portfolioKicker: "Portfolio snapshot",
      portfolioTitle: "Track saved holdings, market value, and unrealized P/L.",
      portfolioDescription:
        "Save holdings from stock detail to see current value, sector mix, and unrealized performance.",
      portfolioEmptyTitle: "No holdings saved yet",
      portfolioEmptyDescription:
        "Open a stock detail page and save your shares plus average cost to start tracking your portfolio.",
      portfolioStartCta: "Open a stock page",
      portfolioValueLabel: "Market value",
      portfolioPnLLabel: "Unrealized P/L",
      portfolioDayMoveLabel: "Day move",
      portfolioHoldingsLabel: "Holdings",
      portfolioTopHoldingLabel: "Top holding",
      alertKicker: "Alerts board",
      alertTitle: "Watch target prices before they hit.",
      alertDescription:
        "Track above and below target prices from one board before the market gets there.",
      alertEmptyTitle: "No alerts yet",
      alertEmptyDescription:
        "Create above or below price alerts from any stock page and this board will keep them in view.",
      alertActiveLabel: "Active",
      alertTriggeredLabel: "Triggered",
      alertNearestLabel: "Closest",
      alertTargetLabel: "Target",
      alertCurrentLabel: "Current",
      sectorKicker: "Sector radar",
      sectorTitle: "See which NGX sectors are leading the session.",
      sectorDescription:
        "Average move, breadth, and the strongest stock in each active sector.",
      sectorLeaderLabel: "Leader",
      sectorBreadthLabel: "Breadth",
      sectorVolumeLabel: "Volume",
      dividendKicker: "Dividend radar",
      dividendTitle: "Upcoming dividend dates and income watchpoints.",
      dividendDescription:
        "Ex-dividend and payment dates from names with scheduled distributions.",
      dividendEmptyTitle: "Dividend dates will appear here",
      dividendEmptyDescription:
        "As more company distributions are loaded, this panel will highlight the next income events.",
      dividendExDateLabel: "Ex-date",
      dividendPayDateLabel: "Pay date",
    },
    watchlist: {
      shortlistKicker: "Saved shortlist",
    },
    learn: {
      heroKicker: "Product roadmap and build plan",
      heroTitle: "How NGX Stocks grows from MVP into a full Nigerian market platform.",
      heroDescription:
        "This page turns the roadmap into a working product plan: what ships first, what comes next, which data entities matter, and which APIs and assumptions need to be confirmed.",
      heroBadge: "Dashboard-first, responsive, accessible, and NGX-specific",
      mustLabel: "Must-have",
      shouldLabel: "Should-have",
      niceLabel: "Nice-to-have",
      techLabel: "Technical approach and data",
      uiLabel: "UI, UX, and accessibility",
      deliverablesLabel: "Deliverables",
      userStoryLabel: "User story and acceptance",
      phases: [
        {
          name: "MVP",
          summary:
            "Ship the first usable NGX workspace with watchlist, price board, starter charts, market stats, portfolio P/L, and alerts.",
          must: [
            "Watchlist with saved NGX names",
            "Live or delayed price board with volume and change",
            "Basic line or candlestick chart for 1D, 1W, and 1M",
            "Starter metrics: P/E, Market Cap, price change, and volume",
            "Portfolio P/L summary for holdings and cost basis",
            "Price alert setup for target up or down levels",
          ],
          should: [
            "Company news and NGX announcements feed",
            "Sector grouping and filter",
            "Starter corporate-action panel for dividend and bonus events",
          ],
          nice: [
            "Simple email or push alert delivery",
            "Market sentiment banner for overall board direction",
          ],
          tech:
            "React frontend, delayed or best-effort streaming price feed, local storage for MVP watchlist and portfolio, Supabase auth optional.",
          ui:
            "Dashboard-first layout, mobile-friendly table cards, clear a11y contrast, focus states, and charts that stay readable on small screens.",
          charts: "Price line/candlestick, volume bars, and gainers/losers snapshot.",
          deliverables:
            "Landing, auth, dashboard, watchlist, stock detail, portfolio card, alerts modal, price API, news API, and local persistence.",
          userStory:
            "As an NGX investor, I want to save stocks, see price movement, and know my current portfolio P/L so I can react faster every day.",
          acceptance:
            "When I add a stock to watchlist or portfolio, it should remain after refresh and update price-based P/L correctly.",
        },
        {
          name: "Phase 2",
          summary:
            "Deepen research with indicators, sectors, dividends, stronger portfolio analytics, and richer company coverage.",
          must: [
            "Advanced charts with RSI, MACD, moving averages, and zoom ranges",
            "Sector analysis dashboard with leaders, laggards, and heatmap",
            "Dividend calendar and corporate-action timeline",
            "Expanded valuation metrics and company fundamentals",
            "Backend persistence for user profiles, watchlists, and portfolios",
          ],
          should: [
            "Custom alert rules based on percentage move or indicator trigger",
            "Broker-style transaction history with audit trail",
            "News tagging by stock, sector, and event type",
          ],
          nice: [
            "Peer comparison table",
            "Income estimate for dividend-paying portfolios",
          ],
          tech:
            "Move persistence into a backend DB, add scheduled sync jobs for dividends and corporate actions, and formalize data ingestion from NGX-specific feeds.",
          ui:
            "Add comparison views, deeper filters, responsive data tables, and chart settings that stay keyboard-accessible.",
          charts:
            "Indicator overlays, sector heatmap, portfolio allocation donut, and dividend timeline.",
          deliverables:
            "Portfolio pages, sector dashboard, dividend calendar, advanced chart components, alerts engine, and authenticated APIs.",
          userStory:
            "As an active trader, I want indicators and sector leadership data so I can compare signal quality before entering a position.",
          acceptance:
            "When I open a stock or sector screen, I can switch indicators and see the chart update without breaking mobile usability.",
        },
        {
          name: "Phase 3",
          summary:
            "Turn the platform into a deeper intelligence and operations product with AI, exports, reporting, and multi-device coverage.",
          must: [
            "AI insight summaries for board movement and company-level anomalies",
            "Backtesting workspace for alert and strategy review",
            "Tax and dividend reporting exports",
            "CSV/PDF export for watchlists, portfolio, and trade logs",
            "Native mobile apps or installable PWA path",
          ],
          should: [
            "Scenario analysis and watchlist scoring",
            "Conversational search across NGX stocks and news",
            "Institutional-style dashboard presets",
          ],
          nice: [
            "Broker integrations for trade import",
            "Collaboration mode for teams or clubs",
          ],
          tech:
            "Add model-powered summarization, reporting services, background jobs, and stronger audit logging for user activity and generated insights.",
          ui:
            "Preserve dashboard-first simplicity while introducing richer workflows, mobile sync, and export actions without clutter.",
          charts:
            "Backtest equity curves, signal hit-rate charts, and tax or income summaries.",
          deliverables:
            "AI insight service, export tools, backtesting UI, mobile shell, and reporting endpoints.",
          userStory:
            "As a serious investor, I want AI summaries, exports, and backtests so I can review decisions and share performance cleanly.",
          acceptance:
            "When I request an export or AI summary, the result should match the selected stocks, date range, and portfolio state.",
        },
      ],
      schemaTitle: "Suggested data schema",
      schema: [
        "Stock: symbol, name, sector, price, changePercent, volume, marketCap, peRatio, dividendYield",
        "Portfolio: id, ownerId, name, baseCurrency, totalValue, totalPnL",
        "Trade: id, portfolioId, stockSymbol, side, quantity, price, fees, tradedAt",
        "Alert: id, userId, stockSymbol, ruleType, targetValue, channel, status",
        "News: id, stockSymbol, source, headline, summary, publishedAt, category",
        "Dividend: id, stockSymbol, amount, exDate, paymentDate, status",
        "Sector: id, name, breadth, avgMove, leaders, laggards",
      ],
      apiTitle: "Minimal API outline",
      api: [
        "GET /api/stocks - list NGX stocks with price, change, volume, and sector",
        "GET /api/stocks/:symbol - stock detail, chart points, metrics, and news",
        "GET /api/sectors - sector breadth, leaders, laggards, and summaries",
        "GET /api/news - NGX announcements and company news",
        "GET /api/dividends - dividend and corporate-action calendar",
        "GET /api/portfolio - user holdings, total value, and P/L summary",
        "POST /api/alerts - create target-price or signal alerts",
      ],
      assumptionsTitle: "Assumptions to confirm",
      assumptions: [
        "React plus TypeScript stays the frontend direction",
        "Price feed may be delayed first if licensed real-time data is not available yet",
        "Authentication can remain optional for read-only users but required for portfolios and alerts",
        "MVP persistence can use local storage, then backend DB for multi-user data later",
        "Corporate actions, NGX announcements, and news sources need licensing and freshness checks",
      ],
      starterTitle: "MVP starter checklist",
      starterChecklist: [
        "Dashboard with top KPIs and price board",
        "Watchlist add and remove flow",
        "Basic stock chart and company detail page",
        "P/E, Market Cap, and Volume slots on stock detail",
        "Portfolio P/L card with total value and daily move",
        "Price alert setup and trigger persistence",
      ],
    },
    stockDetail: {
      priceActionKicker: "Price action",
      statsKicker: "Market stats",
      valuationKicker: "Valuation and income",
      valuationTitle: "Valuation, dividend, and range context",
      valuationDescription:
        "Read basic fundamentals and price position before you chase a move.",
      positionKicker: "Portfolio builder",
      positionTitle: "Save your holding and track cost basis.",
      positionDescription:
        "Enter your number of shares and average cost. The dashboard will keep market value and unrealized P/L up to date.",
      sharesLabel: "Shares",
      averageCostLabel: "Average cost",
      savePosition: "Save holding",
      updatePosition: "Update holding",
      removePosition: "Remove holding",
      invalidPosition: "Enter valid shares and average cost before saving.",
      holdingSaved: "Holding saved to portfolio.",
      holdingRemoved: "Holding removed from portfolio.",
      holdingTitle: "Your holding",
      holdingDescription:
        "Current value and unrealized P/L based on your saved position.",
      currentValueLabel: "Current value",
      unrealizedPnLLabel: "Unrealized P/L",
      alertKicker: "Price alerts",
      alertTitle: "Set a target and let the board watch it.",
      alertDescription:
        "Use above or below alerts to track your planned entry, exit, or profit-taking levels.",
      targetPriceLabel: "Target price",
      alertDirectionLabel: "Condition",
      alertWhenAbove: "When price is above",
      alertWhenBelow: "When price is below",
      createAlert: "Create alert",
      invalidAlert: "Enter a valid target price before creating an alert.",
      alertCreated: "Alert saved.",
      activeAlertsTitle: "Active alerts for this stock",
      noAlertsTitle: "No active alerts for this stock yet.",
      removeAlertLabel: "Remove alert",
      marketCapLabel: "Market cap",
      peRatioLabel: "P/E ratio",
      dividendYieldLabel: "Dividend yield",
      epsLabel: "EPS",
      priceToBookLabel: "Price to book",
      yearRangeLabel: "52-week range",
      betaLabel: "Beta",
      average5Label: "5-day average",
      average20Label: "20-day average",
      quickReadTitle: "Quick read",
      quickReadDescription:
        "These cues are not buy or sell calls. They help you judge valuation, income, and where price sits inside its one-year range.",
    },
    sidebar: {
      workspaceTitle: "Follow your NGX names clearly",
      workspaceSummary: "Board, watchlist, alerts, and stock detail in one place.",
    },
  },
  pid: {
    common: {
      login: "Sign in",
      createAccount: "Open account",
      goToDashboard: "Enter dashboard",
      loadingWorkspace: "Dey open workspace",
      backHome: "Go back home",
      backSignIn: "Go back make you sign in",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      switchTheme: "Change how the workspace dey look",
      menu: "Menu",
      languageEnglish: "English",
      languagePidgin: "Pidgin",
      workspace: "Workspace",
      emailLabel: "Email address",
      emailPlaceholder: "investor@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Put your password",
      newPasswordLabel: "New password",
      newPasswordPlaceholder: "Put new password",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Confirm your password",
      confirmNewPasswordLabel: "Confirm new password",
      continueWithGoogle: "Continue with Google",
      orUseEmail: "Or use email",
      resetPassword: "Forget password?",
      readMore: "Read more",
      signInButton: "Open my dashboard",
      createAccountButton: "Open my account",
      updatePasswordButton: "Update password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      closeSidebar: "Close sidebar",
    },
    authShell: {
      brandSubtitle: "NGX board, watchlist, alerts, and portfolio flow",
      heroKicker: "Built for NGX investors and traders wey wan clear market gist",
      heroTitle:
        "Follow Nigerian stocks, company gist, alerts, and portfolio movement from one clean workspace.",
      heroDescription:
        "Use one account take watch NGX price action, save names, open company detail, check valuation signal, and prepare for the next market session.",
      spotlightRows: [
        "Live or delayed NGX price board with company drill-down",
        "Watchlist, alerts, and portfolio tracking for one place",
        "Charts, P/E, market cap, dividend, and sector gist",
      ],
      highlights: [
        {
          label: "Coverage",
          value: "140+",
          detail: "NGX names wey don ready for dashboard and detail page.",
        },
        {
          label: "Core tools",
          value: "Board",
          detail:
            "Watchlist, price move, basic chart, and company market stats.",
        },
        {
          label: "Next layer",
          value: "Alerts",
          detail:
            "Portfolio P/L, valuation, sector analysis, and dividend planning.",
        },
      ],
      unlockLabel: "Wetin this account go give you",
      unlockTitle:
        "One place to watch prices, save stocks, set alerts, and follow company updates.",
      unlockChip:
        "Watchlist, charts, portfolio P/L, alerts, valuation, and NGX news flow",
    },
    login: {
      eyebrow: "Sign in",
      title: "Enter your NGX workspace and continue from your watchlist.",
      description:
        "Use email or Google sign-in make you enter the market board, check live or delayed price, and jump back to the stocks wey you dey watch.",
      supabaseMissing:
        "Supabase env vars no dey. Configure src/.env and restart the dev server.",
      resetNeedsEmail:
        "Put your email first make the reset link fit land for the correct inbox.",
      resetSent:
        "Password reset email don send. Check your inbox and continue from the reset screen.",
      footerText: "You never get account? Create workspace for your NGX flow.",
      footerLink: "Open account",
    },
    signup: {
      eyebrow: "Open account",
      title: "Set up your workspace for NGX prices, watchlist, and portfolio tracking.",
      description:
        "Create your account make you save favorite stocks, follow company detail, and prepare for alerts, valuation, and portfolio features as the platform dey grow.",
      supabaseMissing:
        "Supabase env vars no dey. Configure src/.env and restart the dev server.",
      passwordMismatch:
        "Your passwords never match. Check both field well and try again.",
      success: "Check your email make you confirm the new account.",
      footerText: "You already get account? Return to your market board.",
      footerLink: "Sign in",
      highlights: [
        {
          label: "Fast start",
          value: "2 min",
          detail: "Short route from signup to NGX price tracking.",
        },
        {
          label: "Watchlist flow",
          value: "Saved",
          detail: "Keep the stocks wey matter to you one click away.",
        },
        {
          label: "Feature path",
          value: "Ready",
          detail: "Ground don ready for alerts, portfolio P/L, and valuation tools.",
        },
      ],
    },
    reset: {
      eyebrow: "Reset password",
      title: "Set new password and return to your NGX market board.",
      description:
        "Choose fresh password make you fit go back to charts, watchlists, and company detail without losing your flow.",
      mismatch:
        "The new passwords never match. Confirm them well and try again.",
      success: "Password don update well. We dey carry you go sign in.",
    },
    landing: {
      brandSubtitle: "NGX price board, watchlist, alerts, and portfolio planning",
      heroKicker: "Nigerian stock market analytics wey follow real NGX workflow",
      heroTitle:
        "Track NGX prices, follow company detail, and line up your next move from one board.",
      heroDescription:
        "NGX Stocks dey help Nigerian investors and traders read market breadth, save favorite names, inspect company charts, track portfolio P/L, and stay close to dividend and sector signal.",
      secondaryCta: "Go sign in",
      trustStrip: [
        "Watchlist and company detail wey fit NGX names well",
        "Price board, charts, market stats, and company briefings",
        "Portfolio P/L, sector radar, dividend dates, and learn hub",
      ],
      stats: [
        {
          label: "Tracked names",
          value: "140+",
          detail: "NGX stocks wey arrange well for everyday monitoring.",
        },
        {
          label: "Core tools",
          value: "5",
          detail: "Board, watchlist, stock detail, charts, and learn hub.",
        },
        {
          label: "Live features",
          value: "Portfolio",
          detail: "Portfolio P/L, alerts, dividend calendar, and sector radar.",
        },
      ],
      preview: {
        kicker: "Market pulse",
        title: "Dashboard wey dey built around real NGX monitoring",
        avgMove: "+0.84% average move",
        researchTitle: "Platform coverage",
        researchCards: [
          {
            title: "Dashboard",
            detail: "Prices, breadth, volume, and quick company search.",
          },
          {
            title: "Stock detail",
            detail: "Charts, market stats, news, and valuation-ready slots.",
          },
          {
            title: "Alerts and portfolio",
            detail: "Portfolio P/L, target price alerts, and saved holdings.",
          },
        ],
        boardTitle: "Live board preview",
        boardSubtitle: "Quick scan of active NGX names",
        commandKicker: "Next on the board",
        commandText:
          "Search company, enter stock detail, and prepare for alerts, P/E, market cap, and portfolio follow-up.",
      },
      features: [
        {
          title: "Watchlist, alerts, and price follow-up",
          description:
            "Save NGX names, prepare target-price alerts, and keep the right stocks close before the next session start.",
        },
        {
          title: "Company detail with charts and market stats",
          description:
            "Move from the board enter one stock page with price history, latest news, session stats, and room for valuation metrics.",
        },
        {
          title: "Portfolio, dividends, sectors, and signals",
          description:
            "Track holdings, watch dividend dates, compare sector leadership, and keep valuation context close before you act.",
        },
      ],
      roadmap: {
        kicker: "Inside the workspace",
        title: "Use real tools for price, holdings, alerts, sectors, and learning.",
        description:
          "The app don already bring market breadth, portfolio P/L, alert tracking, dividend dates, sector monitoring, and learn hub join body for one NGX workflow.",
        cta: "Open learn hub",
        cards: [
          {
            title: "Portfolio tracker",
            detail:
              "Save holdings, track cost basis, review market value, and monitor unrealized P/L as price dey move.",
          },
          {
            title: "Sector radar",
            detail:
              "Compare NGX sector leadership, breadth, and the names wey dey push market direction today.",
          },
          {
            title: "Learn hub",
            detail:
              "Understand P/E, market cap, dividend, risk, and how to build conviction before you invest.",
          },
        ],
      },
      final: {
        kicker: "You don ready?",
        title: "Start with the board, then grow enter full NGX analytics workspace.",
        description:
          "Open account, save your names, follow price action, track your holdings, and keep learning the market from inside the app.",
      },
    },
    dashboard: {
      leadKicker: "Market breadth",
      leadTitle:
        "Read today NGX movement from one board before you drill into any stock.",
      leadDescription:
        "Use the lead card take spot trend, top gainer, most active name, and watchlist focus before you scan the full market table.",
      trendLabel: "Trend",
      topGainerLabel: "Top gainer",
      topGainerEmpty: "We still dey wait make the strongest move settle.",
      mostActiveLabel: "Most active",
      mostActiveEmpty: "Volume signal still dey load.",
      sharesSuffix: "shares",
      watchlistFocusLabel: "Watchlist focus",
      watchlistFocusDetail:
        "Saved names don ready for faster follow-up any time price action change.",
      watchlistReady: "Watchlist ready",
      savedNamesLabel: "Names wey you save",
      savedNamesDetail: "Stocks wey you don pin for your personal watchlist.",
      boardKicker: "Market board",
      portfolioKicker: "Portfolio snapshot",
      portfolioTitle: "Track saved holdings, market value, and unrealized P/L.",
      portfolioDescription:
        "Save holdings from stock detail make you fit see current value, sector mix, and unrealized performance.",
      portfolioEmptyTitle: "You never save any holding yet",
      portfolioEmptyDescription:
        "Open any stock detail page and save your shares plus average cost make the app fit track your portfolio.",
      portfolioStartCta: "Open stock page",
      portfolioValueLabel: "Market value",
      portfolioPnLLabel: "Unrealized P/L",
      portfolioDayMoveLabel: "Day move",
      portfolioHoldingsLabel: "Holdings",
      portfolioTopHoldingLabel: "Top holding",
      alertKicker: "Alerts board",
      alertTitle: "Watch target price before e touch.",
      alertDescription:
        "Track above and below target price from one board before market reach there.",
      alertEmptyTitle: "No alert yet",
      alertEmptyDescription:
        "Create above or below price alert from any stock page and this board go keep am for eye.",
      alertActiveLabel: "Active",
      alertTriggeredLabel: "Triggered",
      alertNearestLabel: "Closest",
      alertTargetLabel: "Target",
      alertCurrentLabel: "Current",
      sectorKicker: "Sector radar",
      sectorTitle: "See which NGX sectors dey lead this session.",
      sectorDescription:
        "Average move, breadth, and the strongest stock for each active sector.",
      sectorLeaderLabel: "Leader",
      sectorBreadthLabel: "Breadth",
      sectorVolumeLabel: "Volume",
      dividendKicker: "Dividend radar",
      dividendTitle: "Upcoming dividend dates and income watchpoint.",
      dividendDescription:
        "Ex-dividend and payment dates from names wey get scheduled distribution.",
      dividendEmptyTitle: "Dividend dates go show here",
      dividendEmptyDescription:
        "As more company distribution load, this panel go highlight the next income events.",
      dividendExDateLabel: "Ex-date",
      dividendPayDateLabel: "Pay date",
    },
    watchlist: {
      shortlistKicker: "Shortlist wey you save",
    },
    learn: {
      heroKicker: "Roadmap and build plan",
      heroTitle: "How NGX Stocks fit grow from MVP enter full Nigerian market platform.",
      heroDescription:
        "This page turn the roadmap into working product plan: wetin dey ship first, wetin dey come next, which data entities matter, and which APIs and assumptions we still need confirm.",
      heroBadge: "Dashboard-first, mobile-ready, accessible, and NGX-specific",
      mustLabel: "Must get",
      shouldLabel: "Should get",
      niceLabel: "E good make e dey",
      techLabel: "Tech approach and data",
      uiLabel: "UI, UX, and accessibility",
      deliverablesLabel: "Deliverables",
      userStoryLabel: "User story and acceptance",
      phases: [
        {
          name: "MVP",
          summary:
            "Ship the first usable NGX workspace with watchlist, price board, starter charts, market stats, portfolio P/L, and alerts.",
          must: [
            "Watchlist with saved NGX names",
            "Live or delayed price board with volume and change",
            "Basic line or candlestick chart for 1D, 1W, and 1M",
            "Starter metrics like P/E, Market Cap, price change, and volume",
            "Portfolio P/L summary for holdings and cost basis",
            "Price alert setup for target up or down levels",
          ],
          should: [
            "Company news and NGX announcement feed",
            "Sector grouping and filter",
            "Starter corporate-action panel for dividend and bonus events",
          ],
          nice: [
            "Simple email or push alert delivery",
            "Market sentiment banner for overall board direction",
          ],
          tech:
            "React frontend, delayed or best-effort streaming price feed, local storage for MVP watchlist and portfolio, Supabase auth optional.",
          ui:
            "Dashboard-first layout, mobile-friendly table cards, clear a11y contrast, focus states, and charts wey still readable for small screen.",
          charts: "Price line or candlestick, volume bars, and gainers/losers snapshot.",
          deliverables:
            "Landing, auth, dashboard, watchlist, stock detail, portfolio card, alerts modal, price API, news API, and local persistence.",
          userStory:
            "As NGX investor, I want save stocks, see price movement, and know my current portfolio P/L so I fit react faster every day.",
          acceptance:
            "When I add stock to watchlist or portfolio, e suppose remain after refresh and update price-based P/L correctly.",
        },
        {
          name: "Phase 2",
          summary:
            "Deepen research with indicators, sectors, dividends, stronger portfolio analytics, and richer company coverage.",
          must: [
            "Advanced charts with RSI, MACD, moving averages, and zoom ranges",
            "Sector analysis dashboard with leaders, laggards, and heatmap",
            "Dividend calendar and corporate-action timeline",
            "Expanded valuation metrics and company fundamentals",
            "Backend persistence for user profiles, watchlists, and portfolios",
          ],
          should: [
            "Custom alert rules based on percentage move or indicator trigger",
            "Broker-style transaction history with audit trail",
            "News tagging by stock, sector, and event type",
          ],
          nice: [
            "Peer comparison table",
            "Income estimate for dividend-paying portfolios",
          ],
          tech:
            "Move persistence enter backend DB, add scheduled sync jobs for dividends and corporate actions, and formalize ingestion from NGX-specific feeds.",
          ui:
            "Add comparison views, deeper filters, responsive data tables, and chart settings wey remain keyboard-friendly.",
          charts:
            "Indicator overlays, sector heatmap, portfolio allocation donut, and dividend timeline.",
          deliverables:
            "Portfolio pages, sector dashboard, dividend calendar, advanced chart components, alerts engine, and authenticated APIs.",
          userStory:
            "As active trader, I want indicators and sector leadership data so I fit compare signal quality before I enter position.",
          acceptance:
            "When I open stock or sector screen, I fit switch indicators and see the chart update without mobile usability break.",
        },
        {
          name: "Phase 3",
          summary:
            "Turn the platform into deeper intelligence and operations product with AI, exports, reporting, and multi-device coverage.",
          must: [
            "AI insight summaries for board movement and company-level anomalies",
            "Backtesting workspace for alert and strategy review",
            "Tax and dividend reporting exports",
            "CSV or PDF export for watchlists, portfolio, and trade logs",
            "Native mobile apps or installable PWA path",
          ],
          should: [
            "Scenario analysis and watchlist scoring",
            "Conversational search across NGX stocks and news",
            "Institutional-style dashboard presets",
          ],
          nice: [
            "Broker integrations for trade import",
            "Collaboration mode for teams or clubs",
          ],
          tech:
            "Add model-powered summarization, reporting services, background jobs, and stronger audit logging for user activity and generated insights.",
          ui:
            "Keep dashboard-first simplicity while introducing richer workflow, mobile sync, and export actions without clutter.",
          charts:
            "Backtest equity curves, signal hit-rate charts, and tax or income summaries.",
          deliverables:
            "AI insight service, export tools, backtesting UI, mobile shell, and reporting endpoints.",
          userStory:
            "As serious investor, I want AI summaries, exports, and backtests so I fit review decisions and share performance cleanly.",
          acceptance:
            "When I request export or AI summary, the result suppose match the selected stocks, date range, and portfolio state.",
        },
      ],
      schemaTitle: "Suggested data schema",
      schema: [
        "Stock: symbol, name, sector, price, changePercent, volume, marketCap, peRatio, dividendYield",
        "Portfolio: id, ownerId, name, baseCurrency, totalValue, totalPnL",
        "Trade: id, portfolioId, stockSymbol, side, quantity, price, fees, tradedAt",
        "Alert: id, userId, stockSymbol, ruleType, targetValue, channel, status",
        "News: id, stockSymbol, source, headline, summary, publishedAt, category",
        "Dividend: id, stockSymbol, amount, exDate, paymentDate, status",
        "Sector: id, name, breadth, avgMove, leaders, laggards",
      ],
      apiTitle: "Minimal API outline",
      api: [
        "GET /api/stocks - list NGX stocks with price, change, volume, and sector",
        "GET /api/stocks/:symbol - stock detail, chart points, metrics, and news",
        "GET /api/sectors - sector breadth, leaders, laggards, and summaries",
        "GET /api/news - NGX announcements and company news",
        "GET /api/dividends - dividend and corporate-action calendar",
        "GET /api/portfolio - user holdings, total value, and P/L summary",
        "POST /api/alerts - create target-price or signal alerts",
      ],
      assumptionsTitle: "Assumptions to confirm",
      assumptions: [
        "React plus TypeScript still be the frontend direction",
        "Price feed fit start delayed if licensed real-time data never full ready",
        "Authentication fit remain optional for read-only users but e suppose dey mandatory for portfolio and alerts",
        "MVP persistence fit use local storage first, then backend DB for multi-user data later",
        "Corporate actions, NGX announcements, and news sources need licensing and freshness check",
      ],
      starterTitle: "MVP starter checklist",
      starterChecklist: [
        "Dashboard with top KPIs and price board",
        "Watchlist add and remove flow",
        "Basic stock chart and company detail page",
        "P/E, Market Cap, and Volume slots on stock detail",
        "Portfolio P/L card with total value and daily move",
        "Price alert setup and trigger persistence",
      ],
    },
    stockDetail: {
      priceActionKicker: "Price action",
      statsKicker: "Market stats",
      valuationKicker: "Valuation and income",
      valuationTitle: "Valuation, dividend, and range context",
      valuationDescription:
        "Read basic fundamental and price position before you chase move.",
      positionKicker: "Portfolio builder",
      positionTitle: "Save your holding and track cost basis.",
      positionDescription:
        "Put your share quantity and average cost. Dashboard go keep market value and unrealized P/L up to date.",
      sharesLabel: "Shares",
      averageCostLabel: "Average cost",
      savePosition: "Save holding",
      updatePosition: "Update holding",
      removePosition: "Remove holding",
      invalidPosition: "Put correct shares and average cost before you save am.",
      holdingSaved: "Holding don save for portfolio.",
      holdingRemoved: "Holding don comot from portfolio.",
      holdingTitle: "Your holding",
      holdingDescription:
        "Current value and unrealized P/L based on your saved position.",
      currentValueLabel: "Current value",
      unrealizedPnLLabel: "Unrealized P/L",
      alertKicker: "Price alerts",
      alertTitle: "Set target and make board watch am.",
      alertDescription:
        "Use above or below alert take track your planned entry, exit, or profit-taking level.",
      targetPriceLabel: "Target price",
      alertDirectionLabel: "Condition",
      alertWhenAbove: "When price pass above",
      alertWhenBelow: "When price drop below",
      createAlert: "Create alert",
      invalidAlert: "Put correct target price before you create alert.",
      alertCreated: "Alert don save.",
      activeAlertsTitle: "Active alerts for this stock",
      noAlertsTitle: "No active alert for this stock yet.",
      removeAlertLabel: "Comot alert",
      marketCapLabel: "Market cap",
      peRatioLabel: "P/E ratio",
      dividendYieldLabel: "Dividend yield",
      epsLabel: "EPS",
      priceToBookLabel: "Price to book",
      yearRangeLabel: "52-week range",
      betaLabel: "Beta",
      average5Label: "5-day average",
      average20Label: "20-day average",
      quickReadTitle: "Quick read",
      quickReadDescription:
        "These cues no be buy or sell call. Dem just help you judge valuation, income, and where price dey inside one-year range.",
    },
    sidebar: {
      workspaceTitle: "Follow your NGX names well well",
      workspaceSummary: "Board, watchlist, alerts, and stock detail dey here.",
    },
  },
};

export function getAppCopy(language = "en") {
  return APP_COPY[language] || APP_COPY.en;
}
