import { createClient } from "@/lib/supabase/server";
import type { Grade, Subject } from "@/types";
import SubjectCard from "@/components/dashboard/voti/SubjectCard";
import AddSubjectForm from "@/components/dashboard/voti/AddSubjectForm";

export default async function VotiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: subjects }, { data: grades }] = await Promise.all([
    supabase.from("subjects").select("*").eq("user_id", user!.id).order("name"),
    supabase.from("grades").select("*").eq("user_id", user!.id).order("date", { ascending: false }),
  ]);

  const subjectList = (subjects ?? []) as Subject[];
  const gradeList = (grades ?? []) as Grade[];

  const globalAvg = gradeList.length > 0
    ? Math.round((gradeList.reduce((a, g) => a + g.value, 0) / gradeList.length) * 10) / 10
    : null;

  const avgColor = globalAvg === null ? "text-gray-300"
    : globalAvg >= 7 ? "text-grady-green"
    : globalAvg >= 6 ? "text-grady-gold"
    : "text-grady-red";

  // Ordina materie: prima quelle con media peggiore, poi senza voti
  const subjectsWithAvg = subjectList.map((s) => {
    const sg = gradeList.filter((g) => g.subject_id === s.id);
    const avg = sg.length > 0
      ? Math.round((sg.reduce((a, g) => a + g.value, 0) / sg.length) * 10) / 10
      : null;
    return { ...s, avg };
  });

  const withGrades = subjectsWithAvg.filter(s => s.avg !== null).sort((a, b) => (a.avg ?? 0) - (b.avg ?? 0));
  const withoutGrades = subjectsWithAvg.filter(s => s.avg === null);
  const sortedSubjects = [...withGrades, ...withoutGrades];

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50">

      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-10 pb-6">
        <h1 className="text-2xl font-extrabold text-grady-night mb-4">I tuoi voti</h1>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className={`text-2xl font-extrabold ${avgColor}`}>{globalAvg ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-0.5">Media generale</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold text-grady-blue">{gradeList.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Voti totali</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold text-grady-violet">{subjectList.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Materie</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Lista materie */}
        {subjectList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-3">📚</p>
            <p className="font-bold text-grady-night mb-1">Nessuna materia ancora</p>
            <p className="text-sm text-gray-400">Le materie vengono create durante l&apos;onboarding,<br />oppure aggiungile qui sotto.</p>
          </div>
        ) : (
          sortedSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              grades={gradeList.filter((g) => g.subject_id === subject.id)}
            />
          ))
        )}

        {/* Form aggiungi materia */}
        <AddSubjectForm />
      </div>
    </div>
  );
}
