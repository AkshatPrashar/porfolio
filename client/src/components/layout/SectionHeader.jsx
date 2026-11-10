export default function SectionHeader({ headingId, label, title }) {
  return (
    <header className="mb-12 md:mb-16">
      <p className="neo-glow-bottom inline-block border-b border-red pb-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">
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
