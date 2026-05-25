// Pillola colorata per mostrare un voto
// Verde ≥ 7 | Giallo ≥ 6 | Rosso < 6

type Props = { value: number };

export default function GradePill({ value }: Props) {
  const color =
    value >= 7
      ? "bg-grady-green/15 text-grady-green"
      : value >= 6
      ? "bg-grady-gold/15 text-grady-gold"
      : "bg-grady-red/15 text-grady-red";

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-bold ${color}`}>
      {value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}
    </span>
  );
}
