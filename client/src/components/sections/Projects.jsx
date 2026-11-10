import { ExternalLink } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { projects } from '../../data/projects';

const LINKS = [
  { key: 'repo', label: 'Repo', Icon: SiGithub, describe: 'source code on GitHub' },
  { key: 'live', label: 'Live', Icon: ExternalLink, describe: 'live site' },
];

function ProjectCard({ project, index }) {
  const { title, description, tech, links, featured } = project;
  const number = String(index + 1).padStart(2, '0');

  return (
    <article
      className={`group h-full transition-[transform,filter] duration-300 ease-out hover:-translate-y-1.5 hover:drop-shadow-[0_0_14px_rgb(var(--color-red)/0.35)] focus-within:-translate-y-1.5 focus-within:drop-shadow-[0_0_14px_rgb(var(--color-red)/0.35)] ${
        featured ? 'md:col-span-2 lg:row-span-2' : ''
      }`}
    >
      <div className="chamfer-card h-full bg-line/70 p-px transition-colors duration-300 group-focus-within:bg-red/70 group-hover:bg-red/70">
        <div
          className={`chamfer-card relative flex h-full flex-col overflow-hidden bg-surface ${
            featured ? 'p-6 sm:p-10' : 'p-6'
          }`}
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
            {featured && <span className="text-red">Featured</span>}
          </div>

          <h3
            className={`mt-6 font-display font-bold uppercase leading-tight text-ink ${
              featured ? 'text-3xl sm:text-5xl' : 'text-2xl'
            }`}
          >
            {title}
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

          <div className="mt-6 flex flex-wrap gap-3">
            {LINKS.map(({ key, label, Icon, describe }) => (
              <a
                key={key}
                href={links[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} ${describe} (opens in a new tab)`}
                className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-red hover:text-ink"
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
