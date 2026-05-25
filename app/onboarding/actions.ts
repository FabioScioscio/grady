"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSchoolById } from "@/lib/schoolData";

export async function completeOnboarding(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non autenticato" };

  const full_name = (formData.get("full_name") as string).trim();
  const school_type = formData.get("school_type") as string;
  const selectedSubjects = formData.getAll("subjects") as string[];

  if (!full_name || !school_type) return { ok: false, error: "Dati mancanti" };

  // Salva profilo (il trigger ha già creato la riga, usiamo update)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name, school_type, onboarding_done: true })
    .eq("id", user.id);

  if (profileError) return { ok: false, error: profileError.message };

  // Elimina materie esistenti per ricominciare pulito
  await supabase.from("subjects").delete().eq("user_id", user.id);

  // Inserisci materie selezionate
  const school = getSchoolById(school_type);
  if (school && selectedSubjects.length > 0) {
    const subjectsToInsert = school.subjects
      .filter((s) => selectedSubjects.includes(s.name))
      .map((s) => ({
        user_id: user.id,
        name: s.name,
        color: s.color,
        emoji: s.emoji,
      }));

    if (subjectsToInsert.length > 0) {
      await supabase.from("subjects").insert(subjectsToInsert);
    }
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
