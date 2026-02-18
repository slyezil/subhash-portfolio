import useTheme from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-btn"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Activate ${nextTheme} mode`}
    >
      {theme === "dark" ? "☀" : "🌙"}
      <span className="hidden-mobile" style={{ fontSize: '0.85rem' }}>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
