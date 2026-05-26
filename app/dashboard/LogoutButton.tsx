"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 bg-white border-2 border-grady-red/20 text-grady-red font-bold py-3.5 rounded-2xl hover:bg-grady-red/5 hover:border-grady-red/40 transition text-sm"
    >
      <span>🚪</span>
      Esci dall&apos;account
    </button>
  );
}
