import AICoach from "@/components/dashboard/coach/AICoach";

export default function AICoachPage() {
  return (
    <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-grady-night">AI Coach</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Consigli personalizzati basati sui tuoi voti
        </p>
      </div>

      <AICoach />
    </div>
  );
}
