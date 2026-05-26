import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Grade, GradyEvent, Subject } from "@/types";
import Link from "next/link";
import GradePill from "@/components/dashboard/voti/GradePill";
import { getSchoolById } from "@/lib/schoolData";

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
    supabase.from("events").select("*").eq("user_id", user.id).eq("completed", false).gte("date", today).order("date").limit(5),
  ]);

  if (!profile?.onboarding_done && !profile?.full_name) redirect("/onboarding");

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

  const school = getSchoolById(profile?.school_type ?? "");

  // Materie con medie calcolate
  const subjectsWithAvg = subjectList.map((s) => {
    const sg = gradeList.filter((g) => g.subject_id === s.id);
    const avg = sg.length > 0
      ? Math.round((sg.reduce((a, g) => a + g.value, 0) / sg.length) * 10) / 10
      : null;
    return { ...s, avg, count: sg.length };
  });

  const subjectsWithGrades = subjectsWithAvg.filter(s => s.avg !== null);
  const worstSubject = [...subjectsWithGrades].sort((a, b) => (a.avg ?? 10) - (b.avg ?? 10)).find(s => (s.avg ?? 10) < 6);
  const bestSubject = [...subjectsWithGrades].sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0];

  const avgColor = globalAvg === null ? "text-white" : globalAvg >= 7 ? "text-grady-green" : globalAvg >= 6 ? "text-grady-gold" : "text-grady-red";

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50">

      {/* ── HERO HEADER ───────────────────────────────────── */}
      <div className="bg-gradient-to-br from-grady-blue via-grady-violet to-purple-700 px-5 pt-12 pb-8 relative overflow-hidden">
        {/* Cerchi decorativi */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-16 -right-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

        {/* Greeting */}
        <div className="relative">
          <p className="text-white/60 text-sm font-medium tracking-wide">{greeting} 👋</p>
          <h1 className="text-4xl font-extrabold text-white mt-1 tracking-tight">{firstName}</h1>
          {school && (
            <span className="inline-flex items-center gap-1.5 mt-2 bg-white/15 backdrop-blur text-white/90 text-xs font-semibold px-3 py-1 rounded-full">
              {school.emoji} {school.shortLabel}
            </span>
          )}
        </div>

        {/* Media grande */}
        <div className="mt-6 flex items-end gap-6">
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">Media generale</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-extrabold leading-none ${globalAvg !== null ? avgColor : "text-white/30"}`}>
                {globalAvg ?? "—"}
              </span>
              {globalAvg !== null && <span className="text-white/40 text-lg">/10</span>}
            </div>
            {gradeList.length > 0 && (
              <p className="text-white/40 text-xs mt-1">{gradeList.length} vot{gradeList.length === 1 ? "o" : "i"} inseriti</p>
            )}
          </div>

          {/* Mini stats verticali */}
          <div className="flex gap-4 ml-auto mb-1">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">{subjectList.length}</p>
              <p className="text-white/50 text-xs">materie</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">{upcomingTests}</p>
              <p className="text-white/50 text-xs">verifiche</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">{eventList.filter(e => e.type === "compito").length}</p>
              <p className="text-white/50 text-xs">compiti</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENUTO ──────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-8 flex flex-col gap-5">

        {/* Azioni rapide */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/voti"
            className="bg-grady-blue text-white rounded-2xl p-4 flex items-center gap-3 shadow-sm shadow-grady-blue/20 hover:bg-grady-violet transition active:scale-95"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shrink-0">📝</div>
            <div>
              <p className="font-bold text-sm">Aggiungi voto</p>
              <p className="text-white/60 text-xs">Registra un risultato</p>
            </div>
          </Link>
          <Link
            href="/dashboard/calendario"
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:border-grady-blue/30 transition active:scale-95"
          >
            <div className="w-10 h-10 bg-grady-blue/10 rounded-xl flex items-center justify-center text-xl shrink-0">📅</div>
            <div>
              <p className="font-bold text-sm text-grady-night">Calendario</p>
              <p className="text-gray-400 text-xs">Verifiche e compiti</p>
            </div>
          </Link>
        </div>

        {/* Materie — scroll orizzontale */}
        {subjectList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Le tue materie</p>
              <Link href="/dashboard/voti" className="text-xs font-bold text-grady-blue">Gestisci →</Link>
            </div>
            <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
              {subjectsWithAvg.map((s) => (
                <Link
                  key={s.id}
                  href="/dashboard/voti"
                  className="flex flex-col items-center gap-1.5 shrink-0 min-w-[64px]"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: s.color + "25", border: `2px solid ${s.color}30` }}
                  >
                    {s.emoji ?? "📚"}
                  </div>
                  <p className="text-[10px] font-bold text-grady-night text-center leading-tight">{s.name.split(" ")[0]}</p>
                  {s.avg !== null
                    ? <span className="text-[10px] font-extrabold" style={{ color: s.color }}>{s.avg}</span>
                    : <span className="text-[10px] text-gray-300">—</span>
                  }
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Medie materie con barre */}
        {subjectsWithGrades.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Andamento</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {subjectsWithGrades
                .sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0))
                .map((s) => (
                  <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl shrink-0">{s.emoji ?? "📚"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-grady-night truncate">{s.name}</p>
                        <GradePill value={s.avg!} />
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${((s.avg ?? 0) / 10) * 100}%`, backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Prossimi eventi */}
        {eventList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">In arrivo</p>
              <Link href="/dashboard/calendario" className="text-xs font-bold text-grady-blue">Vedi tutto →</Link>
            </div>
            <ul className="divide-y divide-gray-50">
              {eventList.map((ev) => {
                const cfg: Record<string, { color: string; emoji: string }> = {
                  verifica:       { color: "bg-grady-blue/10 text-grady-blue",   emoji: "📝" },
                  interrogazione: { color: "bg-grady-violet/10 text-grady-violet", emoji: "🎤" },
                  compito:        { color: "bg-grady-gold/10 text-grady-gold",   emoji: "📚" },
                };
                const c = cfg[ev.type];
                const isToday = ev.date === today;
                return (
                  <li key={ev.id} className="flex items-center gap-3 px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${c.color}`}>
                      {c.emoji} {ev.type}
                    </span>
                    <p className="text-sm font-semibold text-grady-night flex-1 truncate">{ev.title}</p>
                    <span className={`text-xs font-bold shrink-0 ${isToday ? "text-grady-red" : "text-gray-300"}`}>
                      {isToday ? "Oggi" : new Date(ev.date + "T12:00:00").toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Insight intelligenti */}
        {(worstSubject || bestSubject) && (
          <div className="flex flex-col gap-3">
            {worstSubject && (
              <div className="bg-white border border-grady-red/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-grady-red/10 rounded-xl flex items-center justify-center text-xl shrink-0">⚠️</div>
                <div>
                  <p className="text-xs font-bold text-grady-red mb-0.5">Da migliorare</p>
                  <p className="text-sm font-semibold text-grady-night">
                    {worstSubject.emoji} {worstSubject.name} — media <span className="text-grady-red">{worstSubject.avg}</span>. Concentrati qui!
                  </p>
                </div>
              </div>
            )}
            {bestSubject && bestSubject.avg! >= 7 && (
              <div className="bg-white border border-grady-green/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-grady-green/10 rounded-xl flex items-center justify-center text-xl shrink-0">⭐</div>
                <div>
                  <p className="text-xs font-bold text-grady-green mb-0.5">Punto di forza</p>
                  <p className="text-sm font-semibold text-grady-night">
                    {bestSubject.emoji} {bestSubject.name} — media <span className="text-grady-green">{bestSubject.avg}</span>. Ottimo lavoro!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state — nessun voto */}
        {subjectList.length > 0 && gradeList.length === 0 && (
          <div className="bg-gradient-to-br from-grady-blue/5 to-grady-violet/5 border border-grady-blue/10 rounded-2xl p-6 text-center">
            <p className="text-3xl mb-2">✍️</p>
            <p className="font-bold text-grady-night mb-1">Inizia ad aggiungere i tuoi voti</p>
            <p className="text-sm text-gray-400 mb-4">Le tue {subjectList.length} materie sono pronte — aggiungi il primo voto!</p>
            <Link
              href="/dashboard/voti"
              className="inline-block bg-grady-blue text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-grady-violet transition"
            >
              Vai ai voti →
            </Link>
          </div>
        )}

        {/* Simulatore promo */}
        {gradeList.length >= 3 && (
          <Link
            href="/dashboard/simulatore"
            className="bg-gradient-to-r from-grady-violet to-purple-600 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:opacity-90 transition active:scale-95"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">🎯</div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">Usa il Simulatore</p>
              <p className="text-white/60 text-xs mt-0.5">Scopri che voto ti serve per raggiungere la media che vuoi</p>
            </div>
            <span className="text-white/60 text-lg shrink-0">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
