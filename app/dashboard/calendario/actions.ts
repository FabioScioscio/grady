"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── Aggiungi un evento ────────────────────────────────────
export async function addEvent(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const title = (formData.get("title") as string).trim();
  const type = formData.get("type") as string;
  const date = formData.get("date") as string;
  const subject_id = (formData.get("subject_id") as string) || null;

  if (!title || !date) return;

  const { error } = await supabase.from("events").insert({
    user_id: user.id,
    title,
    type,
    date,
    subject_id: subject_id || null,
    completed: false,
  });

  if (error) console.error("addEvent error:", error.message);
  revalidatePath("/dashboard/calendario");
}

// ── Segna evento come completato/non completato ───────────
export async function toggleEvent(eventId: string, completed: boolean): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("events")
    .update({ completed })
    .eq("id", eventId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/calendario");
}

// ── Elimina un evento ─────────────────────────────────────
export async function deleteEvent(eventId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/calendario");
}
