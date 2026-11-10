import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ExternalLink } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { projects } from '../../data/projects';
import ChamferCard from '../ui/ChamferCard';

const LINKS = [
  { key: 'repo', label: 'Repo', Icon: SiGithub, describe: 'source code on GitHub' },
  { key: 'live', label: 'Live', Icon: ExternalLink, describe: 'live site' },
];
const PROJECTS_BY_ID = Object.fromEntries(
  projects.map((project, i) => [
    project.id,
    { ...project, number: String(i + 1).padStart(2, '0') },
  ]),
);

function ProjectCard({ project, featured, onFeature, headingRef }) {
  const { id, title, description, tech, links, number } = project;

  return (
    <ChamferCard
      as="article"
      interactive
      className={`h-full ${featured ? 'md:col-span-2 lg:row-span-2' : ''}`}
      bodyClassName={`flex flex-col overflow-hidden ${featured ? 'p-6 sm:p-10' : 'p-6'}`}
      style={{ viewTransitionName: `project-${id}` }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full border-r border-red/40 bg-gradient-to-r from-transparent to-red/10 group-focus-within:animate-sweep group-hover:animate-sweep"
      />
      {featured && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 right-4 select-none font-display text-[12rem] font-bold leading-none text-ink/[0.03] sm:text-[16rem]"
        >
          {number}
        </span>
      )}

      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
        <span className="text-muted">
          P<span className="text-line">/</span>
          {number}
        </span>
        {featured ? (
          <span className="text-red">Featured</span>
        ) : (
          <span aria-hidden="true" className="text-muted transition-colors group-hover:text-ink">
            Expand ↗
          </span>
        )}
      </div>

      <h3
        ref={headingRef}
        tabIndex={-1}
        className={`mt-6 font-display font-bold uppercase leading-tight text-ink focus:outline-none ${
          featured ? 'text-3xl sm:text-5xl' : 'text-2xl'
        }`}
      >
        {featured ? (
          title
        ) : (
          <button
            type="button"
            onClick={() => onFeature(id)}
            className="text-left uppercase after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {title}
            <span className="sr-only">, show as featured build</span>
          </button>
        )}
      </h3>
      <p className={`mt-3 max-w-xl ${featured ? 'sm:text-lg' : 'text-sm'}`}>{description}</p>

      <ul aria-label="Tech stack" className="mt-6 flex flex-wrap gap-2 md:mt-auto md:pt-8">
        {tech.map((item) => (
          <li
            key={item}
            className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/80"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-6 flex flex-wrap gap-3">
        {LINKS.map(({ key, label, Icon, describe }) => (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} ${describe} (opens in a new tab)`}
            className="inline-flex items-center gap-2 border border-line bg-surface px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-red hover:text-ink"
          >
            <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            {label}
          </a>
        ))}
      </div>
    </ChamferCard>
  );
}

export default function Projects() {
  const [order, setOrder] = useState(() => projects.map(({ id }) => id));
  const featuredId = order[0];
  const headingRefs = useRef({});
  const focusFeaturedRef = useRef(false);

  useEffect(() => {
    if (!focusFeaturedRef.current) return;
    focusFeaturedRef.current = false;
    headingRefs.current[featuredId]?.focus();
  }, [featuredId]);

  const feature = (id) => {
    const swap = () =>
      setOrder((current) => {
        const next = [...current];
        const slot = next.indexOf(id);
        [next[0], next[slot]] = [next[slot], next[0]];
        return next;
      });

    focusFeaturedRef.current = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduceMotion) {
      document.startViewTransition(() => flushSync(swap));
    } else {
      swap();
    }
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
      {order.map((id) => (
        <ProjectCard
          key={id}
          project={PROJECTS_BY_ID[id]}
          featured={id === featuredId}
          onFeature={feature}
          headingRef={(node) => {
            headingRefs.current[id] = node;
          }}
        />
      ))}
    </div>
  );
}
