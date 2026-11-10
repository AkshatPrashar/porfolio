export default function SectionHeader({ headingId, index, label, title }) {
  return (
    <header className="mb-12 md:mb-16">
      <p className="neo-glow-bottom inline-flex items-center gap-3 border-b border-red pb-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">
        <span className="text-ink">{index}</span>
        <span aria-hidden="true" className="text-line">
          /
        </span>
        {label}
      </p>
      {title && (
        <h2
          id={headingId}
          className="mt-6 font-display text-4xl font-bold uppercase leading-none tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          {title}
        </h2>
      )}
    </header>
  );
}
