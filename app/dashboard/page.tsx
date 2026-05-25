import { createClient } from "@/lib/supabase/server";
import type { Grade, GradyEvent } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

// Icone SVG inline
const icons = {
  media: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-8" />
    </svg>
  ),
  verifiche: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  compiti: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  materie: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];
  const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Carica tutto in parallelo
  const [
    { data: grades },
    { data: subjects },
    { data: events },
  ] = await Promise.all([
    supabase.from("grades").select("*").eq("user_id", user!.id),
    supabase.from("subjects").select("id").eq("user_id", user!.id),
    supabase.from("events").select("*").eq("user_id", user!.id).eq("completed", false).gte("date", today),
  ]);

  const gradeList = (grades ?? []) as Grade[];
  const eventList = (events ?? []) as GradyEvent[];
  const subjectCount = (subjects ?? []).length;

  // Media generale
  const globalAvg =
    gradeList.length > 0
      ? Math.round((gradeList.reduce((a, g) => a + g.value, 0) / gradeList.length) * 10) / 10
      : null;

  // Verifiche + interrogazioni nei prossimi 7 giorni
  const upcomingTests = eventList.filter(
    (e) => (e.type === "verifica" || e.type === "interrogazione") && e.date <= in7days
  ).length;

  // Compiti pendenti
  const pendingCompiti = eventList.filter((e) => e.type === "compito").length;

  // Saluto: usa la parte prima della @ dell'email
  const name = user?.email?.split("@")[0] ?? "studente";

  // Ora del giorno per il saluto
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buongiorno" : hour < 18 ? "Buon pomeriggio" : "Buonasera";

  // CTA dinamico
  const hasGrades = gradeList.length > 0;
  const hasEvents = eventList.length > 0;

  return (
    <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 font-medium">{greeting},</p>
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
        <StatCard
          label="Media generale"
          value={globalAvg !== null ? String(globalAvg) : "—"}
          sub={gradeList.length > 0 ? `su ${gradeList.length} vot${gradeList.length === 1 ? "o" : "i"}` : "nessun voto ancora"}
          icon={icons.media}
          accent="blue"
        />
        <StatCard
          label="Verifiche"
          value={String(upcomingTests)}
          sub="nei prossimi 7 giorni"
          icon={icons.verifiche}
          accent="red"
        />
        <StatCard
          label="Compiti"
          value={String(pendingCompiti)}
          sub="da completare"
          icon={icons.compiti}
          accent="gold"
        />
        <StatCard
          label="Materie"
          value={String(subjectCount)}
          sub={subjectCount === 1 ? "materia attiva" : "materie attive"}
          icon={icons.materie}
          accent="green"
        />
      </div>

      {/* Banner CTA dinamico */}
      {!hasGrades ? (
        <div className="bg-grady-blue rounded-2xl p-5 text-white">
          <p className="text-xs font-semibold opacity-70 mb-1">Inizia da qui</p>
          <p className="font-bold text-base">
            Aggiungi i tuoi voti per calcolare la media reale.
          </p>
          <Link
            href="/dashboard/voti"
            className="inline-block mt-3 bg-white text-grady-blue text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            Vai ai voti →
          </Link>
        </div>
      ) : !hasEvents ? (
        <div className="bg-gradient-to-br from-grady-violet to-grady-blue rounded-2xl p-5 text-white">
          <p className="text-xs font-semibold opacity-70 mb-1">Prossimo passo</p>
          <p className="font-bold text-base">
            Aggiungi verifiche e compiti al calendario per non dimenticare nulla.
          </p>
          <Link
            href="/dashboard/calendario"
            className="inline-block mt-3 bg-white text-grady-violet text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            Apri calendario →
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-grady-green/20 to-grady-blue/10 border border-grady-green/20 rounded-2xl p-5">
          <p className="text-xs font-bold text-grady-green mb-1">✓ Tutto aggiornato</p>
          <p className="font-bold text-base text-grady-night">
            Stai andando alla grande{globalAvg !== null ? `, media ${globalAvg}` : ""}! Continua così 💪
          </p>
          {upcomingTests > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Hai {upcomingTests} {upcomingTests === 1 ? "verifica" : "verifiche"} in arrivo questa settimana.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
