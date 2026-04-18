export default function Component() {
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle 560px at 50% 200px, oklch(var(--primary) / 0.3), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[size:18px_18px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(var(--primary) / 0.1) 1px, transparent 1px), linear-gradient(to bottom, oklch(var(--primary) / 0.1) 1px, transparent 1px)",
        }}
      />
    </div>
  );
}
