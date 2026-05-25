import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, BottomNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Carica profilo per controllare onboarding
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, onboarding_done")
    .eq("id", user.id)
    .single();

  // Se non ha completato l'onboarding, reindirizza (ma non in loop)
  const isOnboarding = false; // gestito dalla pagina stessa

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userName={profile?.full_name ?? null} />
      <main className="md:ml-64 pb-24 md:pb-0 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
