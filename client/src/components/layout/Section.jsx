import SectionHeader from './SectionHeader';

export default function Section({ id, label, title, hero = false, children }) {
  const headingId = `${id}-heading`;
  const layout = hero
    ? 'flex min-h-svh flex-col justify-center pb-32 pt-[calc(var(--nav-height)+4rem)]'
    : 'py-24 md:py-32';

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      aria-label={title ? undefined : label}
      className={`relative isolate overflow-hidden bg-carbon-fiber ${layout}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-track-grid"
      />
      <div className="container-garage">
        <SectionHeader headingId={headingId} label={label} title={title} />
        {children}
      </div>
    </section>
  );
}
