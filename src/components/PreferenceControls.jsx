import { ChevronDown, Languages, MoonStar, SunMedium } from "lucide-react";
import { getAppCopy } from "../content/appCopy";
import { usePreferencesStore } from "../../store/usePreferencesStore";

export default function PreferenceControls({
  className = "",
  showLabels = true,
}) {
  const language = usePreferencesStore((state) => state.language);
  const theme = usePreferencesStore((state) => state.theme);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme);
  const copy = getAppCopy(language);

  const nextThemeLabel =
    theme === "dark" ? copy.common.lightMode : copy.common.darkMode;
  const languageLabel = copy.common.languageLabel || "Language";
  const languageOptions = [
    { value: "en", label: copy.common.languageEnglish },
    { value: "pid", label: copy.common.languagePidgin },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      <label
        className={`app-control relative flex h-11 items-center gap-2 rounded-full px-3 text-foreground ${
          showLabels ? "min-w-[9rem]" : "min-w-[7rem]"
        }`}
      >
        <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
        {showLabels ? (
          <span className="text-sm font-medium text-foreground">
            {languageLabel}
          </span>
        ) : (
          <span className="sr-only">{languageLabel}</span>
        )}
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          aria-label={languageLabel}
          className={`min-w-0 flex-1 appearance-none bg-transparent pr-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground outline-none ${
            showLabels ? "text-right" : ""
          }`}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-muted-foreground" />
      </label>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={copy.common.switchTheme}
        title={nextThemeLabel}
        className="app-control inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground"
      >
        {theme === "dark" ? (
          <SunMedium className="h-4 w-4" />
        ) : (
          <MoonStar className="h-4 w-4" />
        )}
        <span className="sr-only">{nextThemeLabel}</span>
      </button>
    </div>
  );
}
