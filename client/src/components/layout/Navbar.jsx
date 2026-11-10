import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { profile } from '../../data/profile';
import { sectionIds, sections } from '../../data/sections';
import useActiveSection from '../../hooks/useActiveSection';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const links = sections.map(({ id, index, label }) => (
    <li key={id}>
      <a
        href={`#${id}`}
        className="nav-link"
        aria-current={activeId === id ? 'true' : undefined}
        onClick={() => setOpen(false)}
      >
        <span className="mr-2 text-red">{index}</span>
        {label}
      </a>
    </li>
  ));

  return (
    <header className="neo-glow-bottom fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-black/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="container-garage flex h-[var(--nav-height)] items-center justify-between gap-4"
      >
        <a href={`#${sectionIds[0]}`} className="flex shrink-0 items-center gap-3">
          <span aria-hidden="true" className="h-5 w-1.5 -skew-x-12 bg-red" />
          <span className="font-display text-lg font-semibold uppercase tracking-wider text-ink">
            {profile.name}
          </span>
        </a>

        <div className="flex items-center gap-2">
          <ul className="hidden items-center xl:flex">{links}</ul>
          <ThemeToggle />
          <button
            type="button"
            className="-mr-2 p-2 text-ink xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      <ul
        id="mobile-nav"
        hidden={!open}
        className="container-garage border-t border-line/60 bg-black py-3 xl:hidden"
      >
        {links}
      </ul>
    </header>
  );
}
