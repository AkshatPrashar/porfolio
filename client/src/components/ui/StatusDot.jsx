export default function StatusDot() {
  return (
    <span aria-hidden="true" className="relative inline-flex h-2 w-2">
      <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-75" />
      <span className="relative h-2 w-2 rounded-full bg-green" />
    </span>
  );
}
