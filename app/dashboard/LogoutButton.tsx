"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-4 border border-gray-200 text-grady-night font-semibold py-2.5 px-6 rounded-xl hover:bg-gray-50 transition text-sm"
    >
      Esci dall&apos;account
    </button>
  );
}
