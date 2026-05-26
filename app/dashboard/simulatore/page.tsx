import { createClient } from "@/lib/supabase/server";
import type { Grade, Subject } from "@/types";
import GradeSimulator from "@/components/dashboard/simulatore/GradeSimulator";

export default async function SimulatorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: subjects }, { data: grades }] = await Promise.all([
    supabase.from("subjects").select("*").eq("user_id", user!.id).order("name"),
    supabase.from("grades").select("*").eq("user_id", user!.id),
  ]);

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50">

      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-grady-violet/10 rounded-2xl flex items-center justify-center text-xl">🎯</div>
          <h1 className="text-2xl font-extrabold text-grady-night">Simulatore</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Inserisci la media che vuoi raggiungere e scopri che voto ti serve al prossimo compito.
        </p>
      </div>

      <div className="px-4 py-5">
        <GradeSimulator
          subjects={(subjects ?? []) as Subject[]}
          grades={(grades ?? []) as Grade[]}
        />
      </div>
    </div>
  );
}
