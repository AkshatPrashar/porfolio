import { Moon, Sun, Zap } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

const THEME_META = {
  black: { label: 'Black', Icon: Moon },
  light: { label: 'White', Icon: Sun },
  neo: { label: 'Neo', Icon: Zap },
};

export default function ThemeToggle() {
  const { theme, nextTheme, cycleTheme } = useTheme();
  const { label, Icon } = THEME_META[theme];
  const description = `Theme: ${label}. Switch to ${THEME_META[nextTheme].label}`;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={description}
      title={description}
      className="flex items-center gap-2 border border-line/70 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:border-red hover:text-ink"
    >
      <Icon aria-hidden="true" size={14} strokeWidth={1.75} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
