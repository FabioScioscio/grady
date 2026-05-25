"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSchoolById } from "@/lib/schoolData";

export async function completeOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = (formData.get("full_name") as string).trim();
  const school_type = formData.get("school_type") as string;
  const selectedSubjects = formData.getAll("subjects") as string[];

  if (!full_name || !school_type) return;

  // Salva profilo
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name,
    school_type,
    onboarding_done: true,
  });

  // Carica materie selezionate con colori ed emoji dalla scuola
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
  redirect("/dashboard");
}
