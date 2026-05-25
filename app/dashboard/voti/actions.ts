"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── Aggiungi una materia ──────────────────────────────────
export async function addSubject(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const name = (formData.get("name") as string).trim();
  const color = formData.get("color") as string;
  if (!name) return;

  const { error } = await supabase.from("subjects").insert({ user_id: user.id, name, color });
  if (error) console.error("addSubject error:", error.message, error.details, error.hint);
  revalidatePath("/dashboard/voti");
}

// ── Elimina una materia (e tutti i voti collegati) ────────
export async function deleteSubject(subjectId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("subjects")
    .delete()
    .eq("id", subjectId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/voti");
}

// ── Aggiungi un voto ──────────────────────────────────────
export async function addGrade(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const subject_id = formData.get("subject_id") as string;
  const value = parseFloat(formData.get("value") as string);
  const type = formData.get("type") as string;
  const description = (formData.get("description") as string).trim() || null;
  const date = formData.get("date") as string;

  if (isNaN(value) || value < 1 || value > 10) return;

  await supabase.from("grades").insert({
    user_id: user.id,
    subject_id,
    value,
    type,
    description,
    date,
  });

  revalidatePath("/dashboard/voti");
}

// ── Elimina un voto ───────────────────────────────────────
export async function deleteGrade(gradeId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("grades")
    .delete()
    .eq("id", gradeId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/voti");
}
