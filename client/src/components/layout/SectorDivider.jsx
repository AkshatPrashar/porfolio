const SECTORS = ['bg-red', 'bg-green', 'bg-purple'];

export default function SectorDivider() {
  return (
    <div aria-hidden="true" className="container-garage flex gap-1.5 bg-black">
      {SECTORS.map((color) => (
        <span key={color} className={`neo-glow h-0.5 flex-1 -skew-x-[30deg] opacity-70 ${color}`} />
      ))}
    </div>
  );
}
