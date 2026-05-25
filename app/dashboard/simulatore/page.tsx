import { createClient } from "@/lib/supabase/server";
import type { Grade, Subject } from "@/types";
import GradeSimulator from "@/components/dashboard/simulatore/GradeSimulator";

export default async function SimulatorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: subjects }, { data: grades }] = await Promise.all([
    supabase
      .from("subjects")
      .select("*")
      .eq("user_id", user!.id)
      .order("name", { ascending: true }),
    supabase
      .from("grades")
      .select("*")
      .eq("user_id", user!.id),
  ]);

  return (
    <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-grady-night">Simulatore</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Calcola il voto che ti serve per raggiungere la media che vuoi
        </p>
      </div>

      <GradeSimulator
        subjects={(subjects ?? []) as Subject[]}
        grades={(grades ?? []) as Grade[]}
      />
    </div>
  );
}
