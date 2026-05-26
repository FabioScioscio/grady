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
  const initials = profile?.full_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) ?? "G";

  const subjectsWithAvg = subjectList.map((s) => {
    const sg = gradeList.filter(g => g.subject_id === s.id);
    const avg = sg.length > 0
      ? Math.round((sg.reduce((a, g) => a + g.value, 0) / sg.length) * 10) / 10
      : null;
    return { ...s, avg };
  });

  const subjectsWithGrades = subjectsWithAvg.filter(s => s.avg !== null);
  const worstSubject = [...subjectsWithGrades].sort((a, b) => (a.avg ?? 10) - (b.avg ?? 10)).find(s => (s.avg ?? 10) < 6);
  const bestSubject = [...subjectsWithGrades].sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))[0];
  const avgColor = globalAvg === null ? "" : globalAvg >= 7 ? "text-grady-green" : globalAvg >= 6 ? "text-grady-gold" : "text-grady-red";
  const hasGrades = gradeList.length > 0;

  return (
    <div className="max-w-2xl mx-auto">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-grady-blue via-grady-violet to-purple-700 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative px-5 pt-8 pb-4">
          {/* Greeting + avatar */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/55 text-xs font-medium">{greeting} 👋</p>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{firstName}</h1>
              {school && (
                <span className="inline-flex items-center gap-1 mt-1 bg-white/15 text-white/85 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {school.emoji} {school.shortLabel}
                </span>
              )}
            </div>
            <Link href="/dashboard/profilo">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/30 transition shrink-0">
                <span className="text-white font-extrabold text-sm">{initials}</span>
              </div>
            </Link>
          </div>

          {/* Media o empty state */}
          {hasGrades ? (
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">Media generale</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl font-extrabold leading-none tabular-nums ${avgColor}`}>{globalAvg}</span>
                  <span className="text-white/30 text-lg">/10</span>
                </div>
                <p className="text-white/35 text-[11px] mt-1">
                  {gradeList.length} vot{gradeList.length === 1 ? "o" : "i"} · {subjectList.length} materie
                </p>
              </div>
              <div className="flex gap-2 pb-0.5">
                {[
                  { n: upcomingTests, label: "verifiche" },
                  { n: eventList.filter(e => e.type === "compito").length, label: "compiti" },
                ].map(({ n, label }) => (
                  <div key={label} className="w-14 h-14 bg-white/12 rounded-2xl flex flex-col items-center justify-center gap-0.5">
                    <span className="text-white font-extrabold text-xl leading-none">{n}</span>
                    <span className="text-white/40 text-[9px] font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 mb-4">
              <span className="text-2xl shrink-0">✍️</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">Aggiungi il tuo primo voto!</p>
                <p className="text-white/50 text-xs">
                  {subjectList.length > 0 ? `${subjectList.length} materie pronte` : "Configura le materie"}
                </p>
              </div>
              <Link href="/dashboard/voti"
                className="bg-white text-grady-blue font-extrabold text-xs px-3 py-1.5 rounded-xl shrink-0 hover:bg-gray-100 transition">
                Inizia →
              </Link>
            </div>
          )}
        </div>

        {/* Azioni rapide — dentro il hero */}
        <div className="grid grid-cols-2 gap-2.5 px-5 pb-5">
          <Link href="/dashboard/voti"
            className="bg-white/15 hover:bg-white/22 text-white rounded-2xl px-4 py-3 flex items-center gap-2.5 transition active:scale-95">
            <span className="text-xl shrink-0">📝</span>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Aggiungi voto</p>
              <p className="text-white/50 text-xs">Registra risultato</p>
            </div>
          </Link>
          <Link href="/dashboard/calendario"
            className="bg-white/15 hover:bg-white/22 text-white rounded-2xl px-4 py-3 flex items-center gap-2.5 transition active:scale-95">
            <span className="text-xl shrink-0">📅</span>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Calendario</p>
              <p className="text-white/50 text-xs">Verifiche e compiti</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ══ CONTENUTO ═════════════════════════════════════════ */}
      <div className="px-4 pt-3 pb-8 flex flex-col gap-3">

        {/* Prossimi eventi */}
        {eventList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-grady-red rounded-full animate-pulse inline-block" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">In arrivo</p>
              </div>
              <Link href="/dashboard/calendario" className="text-xs font-bold text-grady-blue">Vedi tutto →</Link>
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
                return (
                  <li key={ev.id} className="flex items-center gap-2.5 px-4 py-2.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${c.color}`}>{c.emoji} {ev.type}</span>
                    <p className="text-sm font-semibold text-grady-night flex-1 truncate">{ev.title}</p>
                    <span className={`text-xs font-extrabold shrink-0 ${diff <= 1 ? "text-grady-red" : "text-gray-300"}`}>{dayLabel}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Materie scroll */}
        {subjectList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Le tue materie</p>
              <Link href="/dashboard/voti" className="text-xs font-bold text-grady-blue">Gestisci →</Link>
            </div>
            <div className="flex gap-2.5 px-4 pb-3.5 overflow-x-auto no-scrollbar">
              {subjectsWithAvg.map((s) => (
                <Link key={s.id} href="/dashboard/voti"
                  className="flex flex-col items-center gap-1 shrink-0 min-w-[52px] group">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: s.color + "20", border: `2px solid ${s.color}30` }}>
                    {s.emoji ?? "📚"}
                  </div>
                  <p className="text-[9px] font-bold text-grady-night text-center leading-tight max-w-[52px] truncate">
                    {s.name.split(" ")[0]}
                  </p>
                  {s.avg !== null
                    ? <span className="text-[10px] font-extrabold" style={{ color: s.color }}>{s.avg}</span>
                    : <span className="text-[9px] text-gray-300">—</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Andamento con barre — solo se ci sono voti */}
        {subjectsWithGrades.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Andamento</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {subjectsWithGrades
                .sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0))
                .map((s) => (
                  <li key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-lg shrink-0">{s.emoji ?? "📚"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-grady-night truncate">{s.name}</p>
                        <GradePill value={s.avg!} />
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${((s.avg ?? 0) / 10) * 100}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Insight */}
        {worstSubject && (
          <div className="bg-white border border-grady-red/20 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-lg shrink-0">⚠️</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-grady-red uppercase tracking-wide">Da migliorare</p>
              <p className="text-sm font-semibold text-grady-night truncate">
                {worstSubject.emoji} {worstSubject.name} — media <span className="text-grady-red">{worstSubject.avg}</span>
              </p>
            </div>
          </div>
        )}
        {bestSubject && (bestSubject.avg ?? 0) >= 7 && (
          <div className="bg-white border border-grady-green/20 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-lg shrink-0">⭐</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-grady-green uppercase tracking-wide">Punto di forza</p>
              <p className="text-sm font-semibold text-grady-night truncate">
                {bestSubject.emoji} {bestSubject.name} — media <span className="text-grady-green">{bestSubject.avg}</span>
              </p>
            </div>
          </div>
        )}

        {/* Simulatore promo */}
        {gradeList.length >= 3 && (
          <Link href="/dashboard/simulatore"
            className="bg-gradient-to-r from-grady-violet to-purple-600 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm hover:opacity-90 transition active:scale-[0.98]">
            <span className="text-2xl shrink-0">🎯</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">Simulatore voto</p>
              <p className="text-white/55 text-xs">Scopri che voto ti serve per la media che vuoi</p>
            </div>
            <span className="text-white/50 shrink-0">→</span>
          </Link>
        )}

        {/* ── Sezione "Inizia" per utenti senza voti ───────── */}
        {!hasGrades && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">Come usare Grady</p>

            <Link href="/dashboard/voti"
              className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm hover:border-grady-blue/30 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="w-10 h-10 bg-grady-blue/10 rounded-2xl flex items-center justify-center text-xl shrink-0">📝</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-grady-night">1. Aggiungi i tuoi voti</p>
                <p className="text-xs text-gray-400 mt-0.5">Seleziona una materia e inserisci il voto — Grady calcola la media automaticamente.</p>
              </div>
              <span className="text-gray-300 shrink-0 text-lg">→</span>
            </Link>

            <Link href="/dashboard/calendario"
              className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm hover:border-grady-violet/30 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="w-10 h-10 bg-grady-violet/10 rounded-2xl flex items-center justify-center text-xl shrink-0">📅</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-grady-night">2. Pianifica le verifiche</p>
                <p className="text-xs text-gray-400 mt-0.5">Aggiungi verifiche, interrogazioni e compiti al calendario per non dimenticare nulla.</p>
              </div>
              <span className="text-gray-300 shrink-0 text-lg">→</span>
            </Link>

            <Link href="/dashboard/simulatore"
              className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm hover:border-grady-green/30 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="w-10 h-10 bg-grady-green/10 rounded-2xl flex items-center justify-center text-xl shrink-0">🎯</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-grady-night">3. Usa il Simulatore</p>
                <p className="text-xs text-gray-400 mt-0.5">Inserisci la media che vuoi raggiungere e Grady ti dice esattamente che voto devi prendere.</p>
              </div>
              <span className="text-gray-300 shrink-0 text-lg">→</span>
            </Link>
          </div>
        )}

        {/* CTA calendario vuoto (solo con voti) */}
        {eventList.length === 0 && hasGrades && (
          <Link href="/dashboard/calendario"
            className="bg-white border border-dashed border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-grady-blue/30 transition">
            <span className="text-xl shrink-0">📅</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-grady-night">Nessuna verifica in arrivo</p>
              <p className="text-xs text-gray-400">Aggiungi verifiche al calendario →</p>
            </div>
          </Link>
        )}

      </div>
    </div>
  );
}
