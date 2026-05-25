import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Grade, GradyEvent, Subject } from "@/types";
import Link from "next/link";
import GradePill from "@/components/dashboard/voti/GradePill";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().split("T")[0];
  const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [{ data: profile }, { data: grades }, { data: subjects }, { data: events }] = await Promise.all([
    supabase.from("profiles").select("full_name, school_type, onboarding_done").eq("id", user.id).single(),
    supabase.from("grades").select("*").eq("user_id", user.id).order("date", { ascending: false }),
    supabase.from("subjects").select("*").eq("user_id", user.id).order("name"),
    supabase.from("events").select("*").eq("user_id", user.id).eq("completed", false).gte("date", today).order("date"),
  ]);

  // Reindirizza all'onboarding se non completato
  if (!profile?.onboarding_done && !profile?.full_name) {
    redirect("/dashboard/onboarding");
  }

  const gradeList = (grades ?? []) as Grade[];
  const subjectList = (subjects ?? []) as Subject[];
  const eventList = (events ?? []) as GradyEvent[];

  const firstName = profile?.full_name?.split(" ")[0] ?? "Studente";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buongiorno" : hour < 18 ? "Buon pomeriggio" : "Buonasera";

  const globalAvg = gradeList.length > 0
    ? Math.round((gradeList.reduce((a, g) => a + g.value, 0) / gradeList.length) * 10) / 10
    : null;

  const upcomingTests = eventList.filter(
    (e) => (e.type === "verifica" || e.type === "interrogazione") && e.date <= in7days
  ).length;

  // Materie con medie
  const subjectsWithAvg = subjectList.map((s) => {
    const sg = gradeList.filter((g) => g.subject_id === s.id);
    const avg = sg.length > 0 ? Math.round((sg.reduce((a, g) => a + g.value, 0) / sg.length) * 10) / 10 : null;
    return { ...s, avg, gradeCount: sg.length };
  }).sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0)); // ordina dal più basso al più alto

  const worstSubject = subjectsWithAvg.find((s) => s.avg !== null && s.avg < 6);
  const bestSubject = [...subjectsWithAvg].reverse().find((s) => s.avg !== null && s.avg >= 7);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-grady-blue to-grady-violet px-5 pt-10 pb-16 relative overflow-hidden">
        {/* Cerchi decorativi */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute top-20 -right-4 w-24 h-24 bg-white/5 rounded-full" />

        <p className="text-white/70 text-sm font-medium">{greeting},</p>
        <h1 className="text-3xl font-extrabold text-white mt-1">{firstName} 👋</h1>

        {globalAvg !== null && (
          <div className="mt-4 inline-flex items-baseline gap-1.5 bg-white/15 backdrop-blur rounded-2xl px-4 py-2">
            <span className="text-4xl font-extrabold text-white">{globalAvg}</span>
            <span className="text-white/70 text-sm">media generale</span>
          </div>
        )}
      </div>

      {/* Cards flottanti sopra il gradient */}
      <div className="px-5 -mt-8 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Materie */}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-50">
            <div className="w-9 h-9 bg-grady-blue/10 rounded-xl flex items-center justify-center mb-3">
              <span className="text-lg">📚</span>
            </div>
            <p className="text-2xl font-extrabold text-grady-night">{subjectList.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Materie attive</p>
          </div>

          {/* Voti */}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-50">
            <div className="w-9 h-9 bg-grady-violet/10 rounded-xl flex items-center justify-center mb-3">
              <span className="text-lg">📝</span>
            </div>
            <p className="text-2xl font-extrabold text-grady-night">{gradeList.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Voti inseriti</p>
          </div>

          {/* Verifiche */}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-50">
            <div className="w-9 h-9 bg-grady-red/10 rounded-xl flex items-center justify-center mb-3">
              <span className="text-lg">📅</span>
            </div>
            <p className="text-2xl font-extrabold text-grady-night">{upcomingTests}</p>
            <p className="text-xs text-gray-400 mt-0.5">Verifiche in 7gg</p>
          </div>

          {/* Compiti */}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-50">
            <div className="w-9 h-9 bg-grady-gold/10 rounded-xl flex items-center justify-center mb-3">
              <span className="text-lg">✏️</span>
            </div>
            <p className="text-2xl font-extrabold text-grady-night">
              {eventList.filter((e) => e.type === "compito").length}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Compiti pendenti</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6 flex flex-col gap-5">

        {/* Prossimi eventi */}
        {eventList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">In arrivo</p>
              <Link href="/dashboard/calendario" className="text-xs font-bold text-grady-blue hover:underline">Vedi tutto</Link>
            </div>
            <ul className="divide-y divide-gray-50">
              {eventList.slice(0, 3).map((ev) => {
                const colors: Record<string, string> = {
                  verifica: "bg-grady-blue/10 text-grady-blue",
                  interrogazione: "bg-grady-violet/10 text-grady-violet",
                  compito: "bg-grady-gold/10 text-grady-gold",
                };
                const emojis: Record<string, string> = { verifica: "📝", interrogazione: "🎤", compito: "📚" };
                return (
                  <li key={ev.id} className="flex items-center gap-3 px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${colors[ev.type]}`}>
                      {emojis[ev.type]} {ev.type}
                    </span>
                    <p className="text-sm font-semibold text-grady-night flex-1 truncate">{ev.title}</p>
                    <span className="text-xs text-gray-300 shrink-0">
                      {new Date(ev.date + "T12:00:00").toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Materie con medie */}
        {subjectsWithAvg.filter((s) => s.gradeCount > 0).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Le tue medie</p>
              <Link href="/dashboard/voti" className="text-xs font-bold text-grady-blue hover:underline">Gestisci</Link>
            </div>
            <ul className="divide-y divide-gray-50">
              {subjectsWithAvg.filter((s) => s.avg !== null).map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                  {s.emoji && <span className="text-lg shrink-0">{s.emoji}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-grady-night truncate">{s.name}</p>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${((s.avg ?? 0) / 10) * 100}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                  <GradePill value={s.avg!} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Insight intelligenti */}
        {(worstSubject || bestSubject) && (
          <div className="flex flex-col gap-3">
            {worstSubject && (
              <div className="bg-grady-red/5 border border-grady-red/15 rounded-2xl p-4">
                <p className="text-xs font-bold text-grady-red mb-1">⚠️ Da migliorare</p>
                <p className="text-sm font-semibold text-grady-night">
                  {worstSubject.emoji} {worstSubject.name} ha una media di {worstSubject.avg} — concentrati qui!
                </p>
              </div>
            )}
            {bestSubject && (
              <div className="bg-grady-green/5 border border-grady-green/15 rounded-2xl p-4">
                <p className="text-xs font-bold text-grady-green mb-1">⭐ Punto di forza</p>
                <p className="text-sm font-semibold text-grady-night">
                  {bestSubject.emoji} {bestSubject.name} è la tua materia migliore con {bestSubject.avg}!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {subjectList.length === 0 && (
          <div className="bg-gradient-to-br from-grady-blue to-grady-violet rounded-2xl p-6 text-white text-center">
            <p className="text-3xl mb-2">🚀</p>
            <p className="font-bold text-lg mb-1">Inizia ad aggiungere i tuoi voti!</p>
            <p className="text-sm text-white/70 mb-4">Tieni traccia di tutte le tue materie in un posto solo.</p>
            <Link href="/dashboard/voti" className="inline-block bg-white text-grady-blue font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
              Vai ai voti →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
