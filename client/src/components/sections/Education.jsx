import { education } from '../../data/education';
import useInView from '../../hooks/useInView';
import StatusDot from '../ui/StatusDot';

const STAGGER_MS = 140;

function TimelineEntry({ entry, index }) {
  const [ref, inView] = useInView();
  const { institution, location, start, end, note, current } = entry;

  return (
    <li
      ref={ref}
      style={{ transitionDelay: `${index * STAGGER_MS}ms` }}
      className={`relative transition-[opacity,transform] duration-700 ease-out ${
        inView ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute -left-[calc(2rem+5px)] top-7 h-2.5 w-2.5 rotate-45 md:-left-[calc(3rem+5px)] ${
          current ? 'bg-green' : 'bg-red'
        }`}
      />
      <span
        aria-hidden="true"
        className="absolute -left-8 top-[33px] h-px w-8 bg-line md:-left-12 md:w-12"
      />

      <div className={`border bg-surface/90 p-6 ${current ? 'border-green/40' : 'border-line/70'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.2em]">
          <span className="text-ink">
            <time dateTime={String(start)}>{start}</time>
            <span aria-hidden="true" className="mx-2 text-line">
              —
            </span>
            <time dateTime={String(end)}>{end}</time>
          </span>
          {current && (
            <span className="inline-flex items-center gap-2 text-green">
              <StatusDot />
              In Progress
            </span>
          )}
        </div>
        <h3 className="mt-4 font-display text-xl font-bold uppercase leading-tight text-ink sm:text-2xl">
          {institution}
        </h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {location}
        </p>
        <p className="mt-4 text-ink/90">{note}</p>
      </div>
    </li>
  );
}

export default function Education() {
  return (
    <ol className="neo-glow-left relative ml-1 max-w-3xl space-y-8 border-l border-red/80 pl-8 md:pl-12">
      {education.map((entry, index) => (
        <TimelineEntry key={entry.institution} entry={entry} index={index} />
      ))}
    </ol>
  );
}
