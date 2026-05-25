type StatCardProps = {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: "blue" | "red" | "gold" | "green";
};

const accentStyles = {
  blue: "bg-grady-blue/10 text-grady-blue",
  red: "bg-grady-red/10 text-grady-red",
  gold: "bg-grady-gold/10 text-grady-gold",
  green: "bg-grady-green/10 text-grady-green",
};

const valueStyles = {
  blue: "text-grady-blue",
  red: "text-grady-red",
  gold: "text-grady-gold",
  green: "text-grady-green",
};

export default function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${accentStyles[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className={`text-3xl font-extrabold ${valueStyles[accent]}`}>
          {value}
        </p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}
