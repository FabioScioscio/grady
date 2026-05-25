"use client";

import { useState } from "react";
import { SCHOOL_TYPES } from "@/lib/schoolData";
import { completeOnboarding } from "@/app/dashboard/onboarding/actions";

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  const school = SCHOOL_TYPES.find((s) => s.id === schoolType);

  // Quando si sceglie la scuola, preseleziona tutte le materie
  function handleSchoolSelect(id: string) {
    setSchoolType(id);
    const found = SCHOOL_TYPES.find((s) => s.id === id);
    if (found) setSelectedSubjects(found.subjects.map((s) => s.name));
  }

  function toggleSubject(name: string) {
    setSelectedSubjects((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  }

  async function handleSubmit() {
    setPending(true);
    const fd = new FormData();
    fd.set("full_name", fullName);
    fd.set("school_type", schoolType);
    selectedSubjects.forEach((s) => fd.append("subjects", s));
    await completeOnboarding(fd);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-grady-blue via-grady-violet to-purple-700 flex items-center justify-center p-5">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold text-white tracking-tight">Grady</span>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100">
            <div
              className="h-full bg-grady-blue transition-all duration-500 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-6 md:p-8">
            {/* Step 1 — Nome e cognome */}
            {step === 1 && (
              <div>
                <div className="text-4xl mb-4">👋</div>
                <h2 className="text-2xl font-extrabold text-grady-night mb-1">
                  Ciao! Come ti chiami?
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Il tuo nome apparirà nella dashboard.
                </p>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Es. Marco Rossi"
                  autoFocus
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg font-semibold text-grady-night placeholder:text-gray-300 focus:outline-none focus:border-grady-blue transition"
                />

                <button
                  onClick={() => setStep(2)}
                  disabled={!fullName.trim()}
                  className="w-full mt-5 bg-grady-blue text-white font-bold py-4 rounded-2xl text-base hover:bg-grady-violet transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continua →
                </button>
              </div>
            )}

            {/* Step 2 — Tipo di scuola */}
            {step === 2 && (
              <div>
                <div className="text-4xl mb-4">🏫</div>
                <h2 className="text-2xl font-extrabold text-grady-night mb-1">
                  Che scuola frequenti?
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                  Caricheremo automaticamente le tue materie dal Ministero dell&apos;Istruzione.
                </p>

                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                  {SCHOOL_TYPES.map((school) => (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => handleSchoolSelect(school.id)}
                      className={`flex items-center gap-4 text-left px-4 py-3.5 rounded-2xl border-2 transition ${
                        schoolType === school.id
                          ? "border-grady-blue bg-grady-blue/5"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-2xl shrink-0">{school.emoji}</span>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold leading-tight ${schoolType === school.id ? "text-grady-blue" : "text-grady-night"}`}>
                          {school.label}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{school.description}</p>
                      </div>
                      <span className="ml-auto text-xs text-gray-300 shrink-0">{school.ageRange}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50"
                  >
                    ← Indietro
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!schoolType}
                    className="flex-1 bg-grady-blue text-white font-bold py-3 rounded-2xl text-sm hover:bg-grady-violet transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continua →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Conferma materie */}
            {step === 3 && school && (
              <div>
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-2xl font-extrabold text-grady-night mb-1">
                  Le tue materie
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                  Tutte già selezionate per <strong>{school.label}</strong>. Togli quelle che non hai.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {school.subjects.map((subj) => {
                    const isSelected = selectedSubjects.includes(subj.name);
                    return (
                      <button
                        key={subj.name}
                        type="button"
                        onClick={() => toggleSubject(subj.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition ${
                          isSelected
                            ? "border-transparent text-white"
                            : "border-gray-200 text-gray-400 bg-white"
                        }`}
                        style={isSelected ? { backgroundColor: subj.color, borderColor: subj.color } : {}}
                      >
                        <span>{subj.emoji}</span>
                        <span>{subj.name}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  {selectedSubjects.length} materie selezionate
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50"
                  >
                    ← Indietro
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={pending || selectedSubjects.length === 0}
                    className="flex-1 bg-grady-blue text-white font-bold py-3 rounded-2xl text-sm hover:bg-grady-violet transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {pending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Configurazione…
                      </>
                    ) : (
                      "🚀 Inizia con Grady!"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`rounded-full transition-all ${s === step ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
