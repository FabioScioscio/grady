import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/dashboard/StatCard";
import LogoutButton from "./LogoutButton";

// Icone SVG inline per le stat card
const icons = {
  media: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-8" />
    </svg>
  ),
  verifiche: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  compiti: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  streak: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
};

// Dati mockati — diventeranno reali dallo Stage 6
const mockStats = [
  { label: "Media generale", value: "7,4", sub: "su tutte le materie", icon: icons.media, accent: "blue" as const },
  { label: "Verifiche", value: "3", sub: "nei prossimi 7 giorni", icon: icons.verifiche, accent: "red" as const },
  { label: "Compiti", value: "5", sub: "da completare", icon: icons.compiti, accent: "gold" as const },
  { label: "Streak", value: "12", sub: "giorni consecutivi", icon: icons.streak, accent: "green" as const },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Prendi solo la parte prima della @ per il saluto
  const name = user?.email?.split("@")[0] ?? "studente";

  return (
    <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 font-medium">Ciao,</p>
          <h1 className="text-2xl font-extrabold text-grady-night capitalize">
            {name} 👋
          </h1>
        </div>
        <LogoutButton />
      </div>

      {/* Stat card grid 2x2 */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        Il tuo riepilogo
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {mockStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Banner prossimo step */}
      <div className="bg-grady-blue rounded-2xl p-5 text-white">
        <p className="text-xs font-semibold opacity-70 mb-1">Prossimo passo</p>
        <p className="font-bold text-base">
          Aggiungi i tuoi voti per calcolare la media reale.
        </p>
        <a
          href="/dashboard/voti"
          className="inline-block mt-3 bg-white text-grady-blue text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          Vai ai voti →
        </a>
      </div>
    </div>
  );
}
