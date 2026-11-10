import { profile } from '../../data/profile';
import { sectionIds } from '../../data/sections';
import DrsButton from '../ui/DrsButton';
import StatusDot from '../ui/StatusDot';

const SPEED_LINES = [
  { top: 'top-[22%]', size: 'w-2/5', tone: 'via-ink/50', delay: '[animation-delay:100ms]' },
  { top: 'top-[50%]', size: 'w-3/5', tone: 'via-red/80', delay: '[animation-delay:220ms]' },
  { top: 'top-[76%]', size: 'w-1/3', tone: 'via-ink/40', delay: '[animation-delay:320ms]' },
];

function HeroPhoto({ src, alt, position }) {
  return (
    <div className="mask-vignette pointer-events-none absolute right-4 top-[calc(var(--nav-height)+1.5rem)] -z-10 h-[55%] w-[70%] overflow-hidden md:inset-y-0 md:left-[28%] md:right-0 md:h-auto md:w-auto">
      <img
        src={src}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        style={{ objectPosition: position }}
        className="h-full w-full object-cover opacity-30 mix-blend-luminosity grayscale"
      />
      <div aria-hidden="true" className="bg-scanlines absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/4 animate-scan border-b border-green/30 bg-gradient-to-b from-transparent via-green/[0.06] to-transparent"
      />
    </div>
  );
}

function PitLaneIndicator() {
  return (
    <a
      href={`#${sectionIds[1]}`}
      aria-label="Scroll to next section"
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-ink"
    >
      <span aria-hidden="true">Pit Lane</span>
      <span aria-hidden="true" className="relative h-12 w-px overflow-hidden bg-line">
        <span className="absolute inset-x-0 top-0 h-1/3 animate-pit-flow bg-red" />
      </span>
      <svg aria-hidden="true" viewBox="0 0 12 8" className="h-2 w-3 text-red">
        <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </a>
  );
}

export default function About() {
  const { name, tagline, status, photo } = profile;

  return (
    <>
      {photo.src && <HeroPhoto {...photo} />}

      <div className="max-w-4xl">
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {SPEED_LINES.map(({ top, size, tone, delay }) => (
              <span
                key={top}
                className={`absolute left-0 h-px animate-speed-line bg-gradient-to-r from-transparent to-transparent ${top} ${size} ${tone} ${delay}`}
              />
            ))}
          </div>
          <h1 className="animate-speed-in break-words font-display text-[clamp(3.25rem,12vw,10rem)] font-bold uppercase leading-[0.85] tracking-tight text-ink">
            {name}
          </h1>
        </div>

        <p className="mt-6 flex animate-speed-in items-center gap-3 font-display text-lg uppercase tracking-[0.2em] text-muted [animation-delay:150ms] sm:text-2xl">
          <span aria-hidden="true" className="text-red">
            /
          </span>
          {tagline}
        </p>

        <p className="mt-8 flex animate-speed-in items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] [animation-delay:280ms]">
          <StatusDot />
          <span className="text-muted">Status:</span>
          <span className="text-green">{status}</span>
        </p>

        <div className="mt-10 animate-speed-in [animation-delay:400ms]">
          <DrsButton href="#projects">View Work</DrsButton>
        </div>
      </div>

      <PitLaneIndicator />
    </>
  );
}
