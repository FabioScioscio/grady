import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, BottomNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar visibile solo da md in su */}
      <Sidebar />

      {/* Contenuto principale — su mobile occupa tutto, su desktop lascia spazio alla sidebar */}
      <main className="md:ml-56 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Bottom nav visibile solo su mobile */}
      <BottomNav />
    </div>
  );
}
