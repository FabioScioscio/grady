"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error: string } | null;

export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: "Email o password errati. Riprova." };
  }

  redirect("/dashboard");
}

export async function signup(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    // Supabase può restituire messaggi diversi in base alla versione
    const msg = error.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("user already")) {
      return { error: "Questa email è già registrata. Prova ad accedere." };
    }
    // Restituiamo il messaggio reale di Supabase per debug
    return { error: `Errore: ${error.message}` };
  }

  // Supabase crea l'utente ma potrebbe richiedere conferma email.
  // Se identities è vuoto, l'utente esiste già (ma non confermato).
  if (data.user && data.user.identities?.length === 0) {
    return { error: "Questa email è già registrata. Prova ad accedere." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
