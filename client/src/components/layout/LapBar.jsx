import useScrollProgress from '../../hooks/useScrollProgress';

export default function LapBar() {
  const progress = useScrollProgress();

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-line/40">
      <div
        className="neo-glow h-full origin-left bg-red will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
      <span className="absolute inset-y-0 left-1/3 w-0.5 bg-black" />
      <span className="absolute inset-y-0 left-2/3 w-0.5 bg-black" />
    </div>
  );
}
