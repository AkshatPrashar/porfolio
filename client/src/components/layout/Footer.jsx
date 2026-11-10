import { profile } from '../../data/profile';
import SectorDivider from './SectorDivider';

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' };
const isExternal = (href) => /^https?:\/\//.test(href);
const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-black pb-10">
      <SectorDivider />
      <div className="container-garage mt-10 flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          © {YEAR} <span className="text-ink">{profile.name}</span>. All rights reserved.
        </p>
        <ul aria-label="Social links" className="flex gap-3">
          {profile.socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                {...(isExternal(href) ? EXTERNAL : {})}
                className="flex h-10 w-10 items-center justify-center border border-line text-muted transition-colors hover:border-red hover:text-ink"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
