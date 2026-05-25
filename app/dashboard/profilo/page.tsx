import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSchoolById } from "@/lib/schoolData";
import LogoutButton from "@/app/dashboard/LogoutButton";

export default async function ProfiloPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  const { data: grades } = await supabase
    .from("grades")
    .select("value")
    .eq("user_id", user.id);

  const school = getSchoolById(profile?.school_type ?? "");
  const gradeList = grades ?? [];
  const avg = gradeList.length > 0
    ? Math.round((gradeList.reduce((a, g) => a + g.value, 0) / gradeList.length) * 10) / 10
    : null;

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "G";

  return (
    <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-grady-night mb-6">Profilo</h1>

      {/* Avatar + info */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4 flex items-center gap-5">
        <div className="w-20 h-20 bg-gradient-to-br from-grady-blue to-grady-violet rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-white font-extrabold text-3xl">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-extrabold text-grady-night truncate">
            {profile?.full_name ?? "—"}
          </h2>
          <p className="text-sm text-gray-400">{user.email}</p>
          {school && (
            <span className="inline-flex items-center gap-1.5 mt-2 bg-grady-blue/10 text-grady-blue text-xs font-bold px-3 py-1 rounded-full">
              {school.emoji} {school.label}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-grady-blue">{avg ?? "—"}</p>
          <p className="text-xs text-gray-400 mt-0.5">Media generale</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-grady-violet">{gradeList.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Voti inseriti</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-grady-green">{(subjects ?? []).length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Materie</p>
        </div>
      </div>

      {/* Materie */}
      {(subjects ?? []).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Le tue materie</p>
          <div className="flex flex-wrap gap-2">
            {(subjects ?? []).map((s: { id: string; name: string; emoji?: string; color: string }) => (
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

      {/* Link onboarding se vuole cambiare scuola */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Account</p>
        <a
          href="/onboarding"
          className="flex items-center justify-between py-2 text-sm font-semibold text-grady-night hover:text-grady-blue transition"
        >
          <span>Cambia scuola o materie</span>
          <span className="text-gray-300">→</span>
        </a>
      </div>

      <LogoutButton />
    </div>
  );
}
