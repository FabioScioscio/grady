"use client";

import { useState, useMemo } from "react";
import type { Subject, Grade } from "@/types";
import GradePill from "@/components/dashboard/voti/GradePill";

type Props = {
  subjects: Subject[];
  grades: Grade[];
};

export default function GradeSimulator({ subjects, grades }: Props) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id ?? ""
  );
  const [target, setTarget] = useState<string>("");

  // Voti della materia selezionata
  const subjectGrades = useMemo(
    () => grades.filter((g) => g.subject_id === selectedSubjectId),
    [grades, selectedSubjectId]
  );

  const subject = subjects.find((s) => s.id === selectedSubjectId);

  // Media attuale
  const currentAvg = useMemo(() => {
    if (subjectGrades.length === 0) return null;
    const sum = subjectGrades.reduce((a, g) => a + g.value, 0);
    return Math.round((sum / subjectGrades.length) * 10) / 10;
  }, [subjectGrades]);

  // Voto necessario
  const result = useMemo(() => {
    const t = parseFloat(target);
    if (isNaN(t) || t < 1 || t > 10) return null;

    const n = subjectGrades.length;
    const sum = subjectGrades.reduce((a, g) => a + g.value, 0);
    // voto_necessario = target * (n + 1) - sum
    const needed = t * (n + 1) - sum;
    return Math.round(needed * 100) / 100;
  }, [target, subjectGrades]);

  // Messaggio risultato
  const resultMessage = useMemo(() => {
    if (result === null) return null;
    if (result > 10) return { text: "Impossibile raggiungerla con un solo voto", color: "text-grady-red", bg: "bg-grady-red/10" };
    if (result < 1) return { text: "L'hai già superata! Stai andando benissimo 🎉", color: "text-grady-green", bg: "bg-grady-green/10" };
    return null;
  }, [result]);

  if (subjects.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📊</p>
        <p className="font-semibold text-grady-night">Nessuna materia ancora</p>
        <p className="text-sm mt-1">Aggiungi materie e voti nella sezione Voti.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Selezione materia */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">
          Seleziona materia
        </label>
        <div className="flex flex-col gap-2">
          {subjects.map((s) => {
            const sGrades = grades.filter((g) => g.subject_id === s.id);
            const avg =
              sGrades.length > 0
                ? Math.round((sGrades.reduce((a, g) => a + g.value, 0) / sGrades.length) * 10) / 10
                : null;
            const isSelected = s.id === selectedSubjectId;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSelectedSubjectId(s.id); setTarget(""); }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition text-left ${
                  isSelected
                    ? "border-grady-blue bg-grady-blue/5"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className={`text-sm font-semibold ${isSelected ? "text-grady-blue" : "text-grady-night"}`}>
                    {s.name}
                  </span>
                </div>
                {avg !== null ? (
                  <GradePill value={avg} />
                ) : (
                  <span className="text-xs text-gray-400">nessun voto</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Situazione attuale */}
      {subject && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
            Situazione attuale — {subject.name}
          </p>

          {subjectGrades.length === 0 ? (
            <p className="text-sm text-gray-400">Nessun voto ancora per questa materia.</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-grady-night">{currentAvg}</p>
                <p className="text-xs text-gray-400 mt-0.5">media attuale</p>
              </div>
              <div className="flex-1 border-l border-gray-100 pl-4">
                <p className="text-xs text-gray-500 mb-1.5">Voti inseriti</p>
                <div className="flex flex-wrap gap-1.5">
                  {subjectGrades.map((g) => (
                    <GradePill key={g.id} value={g.value} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calcolatore */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
          Calcola il voto necessario
        </p>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Media obiettivo
            </label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="es. 7.5"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-grady-night focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue"
            />
          </div>
          {result !== null && !resultMessage && (
            <div className="text-center pb-0.5">
              <p className="text-xs text-gray-400 mb-1">Devi prendere</p>
              <div className="w-20">
                <GradePill value={Math.min(10, Math.max(1, result))} />
              </div>
            </div>
          )}
        </div>

        {/* Risultato */}
        {result !== null && (
          <div className="mt-4">
            {resultMessage ? (
              <div className={`rounded-xl px-4 py-3 ${resultMessage.bg}`}>
                <p className={`text-sm font-semibold ${resultMessage.color}`}>
                  {resultMessage.text}
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-grady-blue/5 border border-grady-blue/20 px-4 py-4">
                <p className="text-xs text-gray-500 mb-1">Per raggiungere la media di {target} devi prendere:</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-grady-blue">
                    {result % 1 === 0 ? result.toFixed(0) : result.toFixed(2)}
                  </span>
                  <span className="text-gray-400 text-sm">/ 10</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  al prossimo voto in {subject?.name}
                  {subjectGrades.length > 0 && ` (su ${subjectGrades.length} vot${subjectGrades.length === 1 ? "o" : "i"} esistenti)`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
