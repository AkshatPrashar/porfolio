import { skillCategories, skillRows } from '../../data/skills';

const SECONDS_PER_ITEM = 3.5;
const totalSkills = skillCategories.reduce((sum, { items }) => sum + items.length, 0);

function SkillChip({ name, category, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 border border-line/70 bg-surface/90 px-4 py-3 transition-colors duration-200 hover:border-red/60">
      {Icon && <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-ink/90" />}
      <span className="flex flex-col gap-1 leading-none">
        <span
          className={
            Icon
              ? 'whitespace-nowrap font-display text-sm font-semibold uppercase tracking-wide text-ink'
              : 'whitespace-nowrap font-mono text-sm uppercase tracking-wider text-ink'
          }
        >
          {name}
        </span>
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {category}
        </span>
      </span>
    </div>
  );
}

function MarqueeRow({ items, reverse }) {
  const categories = [...new Set(items.map(({ category }) => category))].join(', ');
  const chips = items.map((skill) => (
    <li key={skill.name} className="shrink-0 pr-3">
      <SkillChip {...skill} />
    </li>
  ));

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label={`Skills: ${categories}`}
      className="marquee mask-fade-x"
    >
      <div
        className={`marquee-track flex w-max animate-marquee ${reverse ? '[animation-direction:reverse]' : ''}`}
        style={{ '--marquee-duration': `${items.length * SECONDS_PER_ITEM}s` }}
      >
        <ul className="flex">{chips}</ul>
        <ul aria-hidden="true" className="flex">
          {chips}
        </ul>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <>
      <p className="-mt-6 mb-10 font-mono text-xs uppercase tracking-[0.25em] text-muted md:-mt-10">
        <span className="text-ink">{totalSkills}</span> components
        <span aria-hidden="true" className="mx-3 text-line">
          /
        </span>
        <span className="text-ink">{skillCategories.length}</span> systems
        <span aria-hidden="true" className="mx-3 text-line">
          /
        </span>
        hover to pit
      </p>

      <div className="ml-[calc(50%-50vw)] w-screen space-y-4">
        {skillRows.map((items, i) => (
          <MarqueeRow key={items[0].category} items={items} reverse={i === 0} />
        ))}
      </div>
    </>
  );
}
