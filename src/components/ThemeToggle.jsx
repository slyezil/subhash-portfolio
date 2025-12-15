import useTheme from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        background: "var(--card)",
        color: "var(--text)",
        border: "1px solid var(--accent)",
        cursor: "pointer",
        marginLeft: 14
      }}
      aria-label={`Activate ${nextTheme} mode`}
    >
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
