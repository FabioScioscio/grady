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
    e => (e.type === "verifica" || e.type === "interrogazione") && e.date <= in7days
  ).length;

  const school = getSchoolById(profile?.school_type ?? "");

  const subjectsWithAvg = subjectList.map((s) => {
    const sg = gradeList.filter(g => g.subject_id === s.id);
    const avg = sg.length > 0
      ? Math.round((sg.reduce((a, g) => a + g.value, 0) / sg.length) * 10) / 10
      : null;
    return { ...s, avg, count: sg.length };
  });

  const subjectsWithGrades = subjectsWithAvg.filter(s => s.avg !== null);
  const worstSubject = [...subjectsWithGrades].sort((a, b) => (a.avg ?? 10) - (b.avg ?? 10)).find(s => (s.avg ?? 10) < 6);
  const bestSubject = [...subjectsWithGrades].sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0];

  // Colore media
  const avgBgColor = globalAvg === null ? "" : globalAvg >= 7 ? "text-grady-green" : globalAvg >= 6 ? "text-grady-gold" : "text-grady-red";

  const hasGrades = gradeList.length > 0;

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-grady-blue via-grady-violet to-purple-700 relative overflow-hidden">
        {/* Cerchi decorativi */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-20 -right-8 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative px-5 pt-10 pb-7">

          {/* Greeting row */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-white/55 text-sm font-medium">{greeting} 👋</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">{firstName}</h1>
              {school && (
                <span className="inline-flex items-center gap-1.5 mt-1.5 bg-white/15 text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {school.emoji} {school.shortLabel}
                </span>
              )}
            </div>

            {/* Avatar */}
            <Link href="/dashboard/profilo">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/30 transition">
                <span className="text-white font-extrabold text-sm">
                  {profile?.full_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) ?? "G"}
                </span>
              </div>
            </Link>
          </div>

          {/* ─ Stato CON voti ─ */}
          {hasGrades ? (
            <div className="flex items-end gap-0">
              {/* Numero media grande */}
              <div className="flex-1">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Media generale</p>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-7xl font-extrabold leading-none tabular-nums ${avgBgColor}`}>
                    {globalAvg}
                  </span>
                  <span className="text-white/30 text-xl mb-1">/10</span>
                </div>
                <p className="text-white/35 text-xs mt-1.5">
                  {gradeList.length} vot{gradeList.length === 1 ? "o" : "i"} · {subjectList.length} materie
                </p>
              </div>

              {/* Mini stats */}
              <div className="flex gap-4 pb-1">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/12 rounded-2xl flex flex-col items-center justify-center mb-1">
                    <span className="text-white font-extrabold text-lg leading-none">{upcomingTests}</span>
                  </div>
                  <p className="text-white/40 text-[10px] font-medium">verifiche</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/12 rounded-2xl flex flex-col items-center justify-center mb-1">
                    <span className="text-white font-extrabold text-lg leading-none">{eventList.filter(e => e.type === "compito").length}</span>
                  </div>
                  <p className="text-white/40 text-[10px] font-medium">compiti</p>
                </div>
              </div>
            </div>
          ) : (
            /* ─ Stato SENZA voti ─ */
            <div className="bg-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                ✍️
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">
                  Aggiungi il tuo primo voto!
                </p>
                <p className="text-white/55 text-xs mt-0.5">
                  {subjectList.length > 0
                    ? `Hai ${subjectList.length} materie pronte`
                    : "Configura le tue materie"}
                </p>
              </div>
              <Link
                href="/dashboard/voti"
                className="bg-white text-grady-blue font-extrabold text-sm px-4 py-2 rounded-xl shrink-0 hover:bg-gray-100 transition"
              >
                Inizia →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ══ CONTENUTO ═════════════════════════════════════════ */}
      <div className="px-4 pt-4 pb-10 flex flex-col gap-4">

        {/* ── Azioni rapide ──────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/voti"
            className="bg-grady-blue text-white rounded-2xl p-4 flex items-center gap-3 shadow-md shadow-grady-blue/20 hover:bg-grady-violet transition-all active:scale-95"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shrink-0">📝</div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Aggiungi voto</p>
              <p className="text-white/55 text-xs mt-0.5">Registra un risultato</p>
            </div>
          </Link>
          <Link
            href="/dashboard/calendario"
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-grady-blue/20 transition-all active:scale-95"
          >
            <div className="w-10 h-10 bg-grady-blue/8 rounded-xl flex items-center justify-center text-xl shrink-0">📅</div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-grady-night leading-tight">Calendario</p>
              <p className="text-gray-400 text-xs mt-0.5">Verifiche e compiti</p>
            </div>
          </Link>
        </div>

        {/* ── Prossimi eventi ────────────────────────────── */}
        {eventList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-grady-red rounded-full animate-pulse" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">In arrivo</p>
              </div>
              <Link href="/dashboard/calendario" className="text-xs font-bold text-grady-blue hover:text-grady-violet transition">
                Vedi tutto →
              </Link>
            </div>
            <ul className="divide-y divide-gray-50">
              {eventList.map((ev) => {
                const cfg: Record<string, { color: string; emoji: string }> = {
                  verifica:       { color: "bg-grady-blue/10 text-grady-blue",     emoji: "📝" },
                  interrogazione: { color: "bg-grady-violet/10 text-grady-violet", emoji: "🎤" },
                  compito:        { color: "bg-grady-gold/10 text-grady-gold",     emoji: "📚" },
                };
                const c = cfg[ev.type];
                const diff = Math.round((new Date(ev.date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
                const dayLabel = diff === 0 ? "Oggi" : diff === 1 ? "Domani" : `${diff}g`;
                const urgent = diff <= 1;
                return (
                  <li key={ev.id} className="flex items-center gap-3 px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${c.color}`}>
                      {c.emoji} {ev.type}
                    </span>
                    <p className="text-sm font-semibold text-grady-night flex-1 truncate">{ev.title}</p>
                    <span className={`text-xs font-extrabold shrink-0 px-2 py-0.5 rounded-full ${urgent ? "bg-grady-red/10 text-grady-red" : "text-gray-300"}`}>
                      {dayLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ── Materie scroll orizzontale ─────────────────── */}
        {subjectList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Le tue materie</p>
              <Link href="/dashboard/voti" className="text-xs font-bold text-grady-blue hover:text-grady-violet transition">Gestisci →</Link>
            </div>
            <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
              {subjectsWithAvg.map((s) => (
                <Link
                  key={s.id}
                  href="/dashboard/voti"
                  className="flex flex-col items-center gap-1.5 shrink-0 min-w-[60px] group"
                >
                  <div
                    className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: s.color + "20", border: `2px solid ${s.color}35` }}
                  >
                    {s.emoji ?? "📚"}
                  </div>
                  <p className="text-[10px] font-bold text-grady-night text-center leading-tight max-w-[56px] truncate">
                    {s.name.split(" ")[0]}
                  </p>
                  {s.avg !== null
                    ? <span className="text-[11px] font-extrabold" style={{ color: s.color }}>{s.avg}</span>
                    : <span className="text-[10px] text-gray-300 font-medium">—</span>
                  }
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Andamento con barre ────────────────────────── */}
        {subjectsWithGrades.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-gray-50 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Andamento</p>
              <p className="text-xs text-gray-300">{subjectsWithGrades.length} materie</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {subjectsWithGrades
                .sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0))
                .map((s) => (
                  <li key={s.id} className="flex items-center gap-3 px-4 py-3.5">
                    <span className="text-xl shrink-0">{s.emoji ?? "📚"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
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

        {/* ── Insight intelligenti ───────────────────────── */}
        {(worstSubject || (bestSubject && (bestSubject.avg ?? 0) >= 7)) && (
          <div className="flex flex-col gap-3">
            {worstSubject && (
              <div className="bg-white border border-grady-red/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-grady-red/10 rounded-xl flex items-center justify-center text-xl shrink-0">⚠️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-grady-red uppercase tracking-wide mb-0.5">Da migliorare</p>
                  <p className="text-sm font-semibold text-grady-night truncate">
                    {worstSubject.emoji} {worstSubject.name} — media{" "}
                    <span className="text-grady-red">{worstSubject.avg}</span>. Concentrati qui!
                  </p>
                </div>
              </div>
            )}
            {bestSubject && (bestSubject.avg ?? 0) >= 7 && (
              <div className="bg-white border border-grady-green/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-grady-green/10 rounded-xl flex items-center justify-center text-xl shrink-0">⭐</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-grady-green uppercase tracking-wide mb-0.5">Punto di forza</p>
                  <p className="text-sm font-semibold text-grady-night truncate">
                    {bestSubject.emoji} {bestSubject.name} — media{" "}
                    <span className="text-grady-green">{bestSubject.avg}</span>. Ottimo lavoro!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Simulatore promo ───────────────────────────── */}
        {gradeList.length >= 3 && (
          <Link
            href="/dashboard/simulatore"
            className="bg-gradient-to-r from-grady-violet to-purple-600 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">🎯</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">Usa il Simulatore</p>
              <p className="text-white/55 text-xs mt-0.5">Scopri che voto ti serve per raggiungere la media che vuoi</p>
            </div>
            <span className="text-white/50 text-xl shrink-0">→</span>
          </Link>
        )}

        {/* ── Empty state calendario ─────────────────────── */}
        {eventList.length === 0 && hasGrades && (
          <Link
            href="/dashboard/calendario"
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:border-grady-blue/20 hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 bg-grady-blue/8 rounded-2xl flex items-center justify-center text-2xl shrink-0">📅</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-grady-night">Nessuna verifica in arrivo</p>
              <p className="text-gray-400 text-xs mt-0.5">Aggiungi verifiche e compiti al calendario →</p>
            </div>
          </Link>
        )}

      </div>
    </div>
  );
}
