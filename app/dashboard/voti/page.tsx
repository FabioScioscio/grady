import { createClient } from "@/lib/supabase/server";
import type { Grade, Subject } from "@/types";
import SubjectCard from "@/components/dashboard/voti/SubjectCard";
import AddSubjectForm from "@/components/dashboard/voti/AddSubjectForm";

export default async function VotiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Carica materie e voti in parallelo
  const [{ data: subjects }, { data: grades }] = await Promise.all([
    supabase
      .from("subjects")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("grades")
      .select("*")
      .eq("user_id", user!.id)
      .order("date", { ascending: false }),
  ]);

  const subjectList = (subjects ?? []) as Subject[];
  const gradeList = (grades ?? []) as Grade[];

  // Calcola media generale su tutti i voti
  const globalAvg =
    gradeList.length > 0
      ? Math.round(
          (gradeList.reduce((a, g) => a + g.value, 0) / gradeList.length) * 10
        ) / 10
      : null;

  return (
    <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-grady-night">I tuoi voti</h1>
          {globalAvg !== null && (
            <p className="text-sm text-gray-400 mt-0.5">
              Media generale:{" "}
              <span className="font-bold text-grady-night">{globalAvg}</span>
            </p>
          )}
        </div>
        {gradeList.length > 0 && (
          <div className="text-right">
            <p className="text-3xl font-extrabold text-grady-blue">{globalAvg}</p>
            <p className="text-xs text-gray-400">su 10</p>
          </div>
        )}
      </div>

      {/* Lista materie */}
      <div className="flex flex-col gap-4 mb-6">
        {subjectList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📚</p>
            <p className="font-semibold text-grady-night">Nessuna materia ancora</p>
            <p className="text-sm mt-1">Aggiungi la tua prima materia qui sotto.</p>
          </div>
        ) : (
          subjectList.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              grades={gradeList.filter((g) => g.subject_id === subject.id)}
            />
          ))
        )}
      </div>

      {/* Form aggiungi materia */}
      <AddSubjectForm />
    </div>
  );
}
