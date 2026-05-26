import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSchoolById } from "@/lib/schoolData";
import LogoutButton from "@/app/dashboard/LogoutButton";
import Link from "next/link";

export default async function ProfiloPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: subjects }, { data: grades }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subjects").select("*").eq("user_id", user.id).order("name"),
    supabase.from("grades").select("value").eq("user_id", user.id),
  ]);

  const school = getSchoolById(profile?.school_type ?? "");
  const gradeList = grades ?? [];
  const subjectList = subjects ?? [];

  const avg = gradeList.length > 0
    ? Math.round((gradeList.reduce((a: number, g: { value: number }) => a + g.value, 0) / gradeList.length) * 10) / 10
    : null;

  const avgColor = avg === null ? "text-gray-300"
    : avg >= 7 ? "text-grady-green"
    : avg >= 6 ? "text-grady-gold"
    : "text-grady-red";

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "G";

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("it-IT", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50">

      {/* ── HEADER HERO ───────────────────────────────── */}
      <div className="bg-gradient-to-br from-grady-blue via-grady-violet to-purple-700 px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative flex items-center gap-5">
          {/* Avatar con iniziali */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0 border-2 border-white/30">
            <span className="text-white font-extrabold text-3xl">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold text-white truncate">{profile?.full_name ?? "Profilo"}</h1>
            <p className="text-white/60 text-sm truncate">{user.email}</p>
            {memberSince && <p className="text-white/40 text-xs mt-0.5">Membro da {memberSince}</p>}
            {school && (
              <span className="inline-flex items-center gap-1.5 mt-2 bg-white/15 text-white/90 text-xs font-bold px-3 py-1 rounded-full">
                {school.emoji} {school.shortLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">

        {/* ── Stats ─────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className={`text-3xl font-extrabold ${avgColor}`}>{avg ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-1">Media</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-grady-blue">{gradeList.length}</p>
            <p className="text-xs text-gray-400 mt-1">Voti</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-3xl font-extrabold text-grady-violet">{subjectList.length}</p>
            <p className="text-xs text-gray-400 mt-1">Materie</p>
          </div>
        </div>

        {/* ── Materie ───────────────────────────────────── */}
        {subjectList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Le tue materie</p>
            <div className="flex flex-wrap gap-2">
              {subjectList.map((s: { id: string; name: string; emoji?: string; color: string }) => (
                <span
                  key={s.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: s.color }}
                >
                  {s.emoji && <span>{s.emoji}</span>}
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Impostazioni account ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Impostazioni</p>
          </div>

          <Link
            href="/onboarding"
            className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-grady-blue/10 rounded-xl flex items-center justify-center text-lg">🏫</div>
              <div>
                <p className="text-sm font-semibold text-grady-night">Cambia scuola o materie</p>
                <p className="text-xs text-gray-400">Riconfigura il tuo profilo scolastico</p>
              </div>
            </div>
            <span className="text-gray-300">→</span>
          </Link>

          <Link
            href="/dashboard/voti"
            className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-grady-violet/10 rounded-xl flex items-center justify-center text-lg">📊</div>
              <div>
                <p className="text-sm font-semibold text-grady-night">Gestisci voti</p>
                <p className="text-xs text-gray-400">Visualizza e modifica i tuoi voti</p>
              </div>
            </div>
            <span className="text-gray-300">→</span>
          </Link>

          <Link
            href="/dashboard/simulatore"
            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-grady-green/10 rounded-xl flex items-center justify-center text-lg">🎯</div>
              <div>
                <p className="text-sm font-semibold text-grady-night">Simulatore voto</p>
                <p className="text-xs text-gray-400">Calcola il voto che ti serve</p>
              </div>
            </div>
            <span className="text-gray-300">→</span>
          </Link>
        </div>

        {/* ── Logout ───────────────────────────────────── */}
        <LogoutButton />

        <p className="text-center text-xs text-gray-300 pb-2">
          Grady v1.0 · I tuoi dati sono privati e sicuri 🔒
        </p>
      </div>
    </div>
  );
}
