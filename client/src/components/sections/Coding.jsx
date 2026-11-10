import { codingProfiles } from '../../data/coding';
import ChamferCard from '../ui/ChamferCard';

export default function Coding() {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {codingProfiles.map(({ id, platform, username, href, icon: Icon, monogram }, index) => (
        <li key={id}>
          <ChamferCard
            as="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${platform} profile: ${username} (opens in a new tab)`}
            interactive
            className="block h-full"
            bodyClassName="flex h-full flex-col overflow-hidden p-6"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full border-r border-red/40 bg-gradient-to-r from-transparent to-red/10 group-focus-visible:animate-sweep group-hover:animate-sweep"
            />
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
              <span className="text-muted">
                C<span className="text-line">/</span>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-ink">{platform}</span>
            </div>

            <span
              aria-hidden="true"
              className="mt-8 flex h-14 w-14 items-center justify-center border border-line text-ink transition-colors group-hover:border-red group-hover:text-red group-focus-visible:border-red group-focus-visible:text-red"
            >
              {Icon ? (
                <Icon className="h-7 w-7" />
              ) : (
                <span className="font-mono text-sm font-medium tracking-widest">{monogram}</span>
              )}
            </span>

            <p className="mt-6 break-all font-display text-2xl font-bold leading-tight text-ink">
              {username}
            </p>

            <p className="mt-auto flex items-center gap-2 pt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors group-hover:text-ink group-focus-visible:text-ink">
              View Profile
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
              >
                →
              </span>
            </p>
          </ChamferCard>
        </li>
      ))}
    </ul>
  );
}
