const SPEED_LINES = ['w-6 delay-0', 'w-8 delay-75', 'w-5 delay-150'];

export default function DrsButton({ href, children, ...props }) {
  const Tag = href ? 'a' : 'button';
  const tagProps = href ? { href } : { type: 'button' };

  return (
    <Tag {...tagProps} {...props} className="group inline-block">
      <span className="chamfer-br relative flex items-center gap-3 border-l-2 border-red bg-surface py-3.5 pl-5 pr-7 font-mono text-sm uppercase tracking-[0.2em] text-ink transition-[padding,background-color] duration-300 ease-out group-hover:bg-red/15 group-hover:pl-14 group-focus-visible:bg-red/15 group-focus-visible:pl-14">
        <span
          aria-hidden="true"
          className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-[3px]"
        >
          {SPEED_LINES.map((line) => (
            <span
              key={line}
              className={`block h-px max-w-0 bg-red transition-[max-width] duration-300 group-hover:max-w-8 group-focus-visible:max-w-8 ${line}`}
            />
          ))}
        </span>
        {children}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 10"
          className="h-2.5 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
        >
          <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </Tag>
  );
}
