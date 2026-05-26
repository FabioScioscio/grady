// Pillola colorata per mostrare un voto
// Verde ≥ 7 | Giallo ≥ 6 | Rosso < 6

type Props = { value: number; size?: "sm" | "md" };

export default function GradePill({ value, size = "sm" }: Props) {
  const color =
    value >= 7
      ? "bg-grady-green/15 text-grady-green"
      : value >= 6
      ? "bg-grady-gold/15 text-grady-gold"
      : "bg-grady-red/15 text-grady-red";

  const sizeClass = size === "md"
    ? "px-3.5 py-1 text-base"
    : "px-2.5 py-0.5 text-sm";

  return (
    <span className={`inline-block rounded-full font-extrabold ${color} ${sizeClass}`}>
      {value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}
    </span>
  );
}
