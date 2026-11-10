const INTERACTIVE =
  'group transition-[transform,filter] duration-300 ease-out hover:-translate-y-1.5 hover:drop-shadow-[0_0_14px_rgb(var(--color-red)/0.35)] focus-within:-translate-y-1.5 focus-within:drop-shadow-[0_0_14px_rgb(var(--color-red)/0.35)]';
const INTERACTIVE_FRAME =
  'transition-colors duration-300 group-hover:bg-red/70 group-focus-within:bg-red/70';

export default function ChamferCard({
  as: Tag = 'div',
  interactive = false,
  className = '',
  bodyClassName = '',
  children,
}) {
  return (
    <Tag className={`${interactive ? INTERACTIVE : ''} ${className}`}>
      <div
        className={`chamfer-card h-full bg-line/70 p-px ${interactive ? INTERACTIVE_FRAME : ''}`}
      >
        <div className={`chamfer-card relative h-full bg-surface ${bodyClassName}`}>{children}</div>
      </div>
    </Tag>
  );
}
