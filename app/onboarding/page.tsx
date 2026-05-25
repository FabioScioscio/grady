import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/dashboard/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Se ha già fatto l'onboarding, vai alla dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_done")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_done) redirect("/dashboard");

  return <OnboardingFlow />;
}
