"use client";

import { useState, useMemo } from "react";
import type { Subject, Grade } from "@/types";
import GradePill from "@/components/dashboard/voti/GradePill";

type Props = {
  subjects: Subject[];
  grades: Grade[];
};

const PRESETS = [6, 7, 8, 9, 10];

export default function GradeSimulator({ subjects, grades }: Props) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id ?? "");
  const [target, setTarget] = useState<string>("");

  const subjectGrades = useMemo(
    () => grades.filter((g) => g.subject_id === selectedSubjectId),
    [grades, selectedSubjectId]
  );

  const subject = subjects.find((s) => s.id === selectedSubjectId);

  const currentAvg = useMemo(() => {
    if (subjectGrades.length === 0) return null;
    return Math.round((subjectGrades.reduce((a, g) => a + g.value, 0) / subjectGrades.length) * 10) / 10;
  }, [subjectGrades]);

  const result = useMemo(() => {
    const t = parseFloat(target);
    if (isNaN(t) || t < 1 || t > 10) return null;
    const n = subjectGrades.length;
    const sum = subjectGrades.reduce((a, g) => a + g.value, 0);
    return Math.round((t * (n + 1) - sum) * 100) / 100;
  }, [target, subjectGrades]);

  const resultStatus = useMemo(() => {
    if (result === null) return null;
    if (result > 10) return "impossible";
    if (result < 1) return "already";
    if (result >= 9) return "hard";
    if (result >= 7) return "medium";
    return "easy";
  }, [result]);

  if (subjects.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <p className="text-5xl mb-3">📊</p>
        <p className="font-bold text-grady-night mb-1">Nessuna materia ancora</p>
        <p className="text-sm text-gray-400">Aggiungi materie e voti nella sezione Voti.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Selezione materia ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Seleziona materia</p>
        <div className="flex flex-col gap-2">
          {subjects.map((s) => {
            const sGrades = grades.filter((g) => g.subject_id === s.id);
            const avg = sGrades.length > 0
              ? Math.round((sGrades.reduce((a, g) => a + g.value, 0) / sGrades.length) * 10) / 10
              : null;
            const isSelected = s.id === selectedSubjectId;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSelectedSubjectId(s.id); setTarget(""); }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition text-left ${
                  isSelected ? "border-grady-blue bg-grady-blue/5" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {s.emoji && <span className="text-xl">{s.emoji}</span>}
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className={`text-sm font-semibold ${isSelected ? "text-grady-blue" : "text-grady-night"}`}>
                    {s.name}
                  </span>
                </div>
                {avg !== null
                  ? <GradePill value={avg} />
                  : <span className="text-xs text-gray-300">nessun voto</span>
                }
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Situazione attuale ─────────────────────── */}
      {subject && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            {subject.emoji && <span className="text-lg">{subject.emoji}</span>}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{subject.name}</p>
          </div>

          {subjectGrades.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm text-gray-400">Nessun voto ancora per questa materia.</p>
              <p className="text-xs text-gray-300 mt-1">Vai su Voti per inserire il primo voto.</p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="text-center shrink-0">
                <p className="text-5xl font-extrabold text-grady-night">{currentAvg}</p>
                <p className="text-xs text-gray-400 mt-1">media attuale</p>
                <p className="text-xs text-gray-300">{subjectGrades.length} vot{subjectGrades.length === 1 ? "o" : "i"}</p>
              </div>
              <div className="flex-1 border-l border-gray-100 pl-5">
                <p className="text-xs text-gray-400 mb-2">Voti inseriti</p>
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

      {/* ── Calcolatore ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Media obiettivo</p>

        {/* Preset rapidi */}
        <div className="flex gap-2 mb-4">
          {PRESETS.map((p) => {
            const isActive = target === String(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => setTarget(String(p))}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
                  isActive
                    ? "bg-grady-blue text-white shadow-md shadow-grady-blue/20"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Input manuale */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">O inserisci un valore preciso</label>
          <input
            type="number"
            min="1"
            max="10"
            step="0.1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="es. 7.5"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-xl font-bold text-grady-night focus:outline-none focus:border-grady-blue transition bg-gray-50"
          />
        </div>

        {/* Risultato */}
        {result !== null && (
          <div className="mt-2">
            {resultStatus === "impossible" && (
              <div className="rounded-2xl bg-grady-red/8 border border-grady-red/20 px-5 py-4 text-center">
                <p className="text-3xl mb-2">😔</p>
                <p className="font-bold text-grady-red">Impossibile con un solo voto</p>
                <p className="text-xs text-gray-500 mt-1">Servirebbe {result.toFixed(1)}/10, che supera il massimo.</p>
              </div>
            )}
            {resultStatus === "already" && (
              <div className="rounded-2xl bg-grady-green/8 border border-grady-green/20 px-5 py-4 text-center">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-bold text-grady-green">Obiettivo già raggiunto!</p>
                <p className="text-xs text-gray-500 mt-1">La tua media attuale è già sopra il target. Ottimo lavoro!</p>
              </div>
            )}
            {(resultStatus === "easy" || resultStatus === "medium" || resultStatus === "hard") && (
              <div className={`rounded-2xl px-5 py-5 border ${
                resultStatus === "hard"
                  ? "bg-grady-red/5 border-grady-red/20"
                  : resultStatus === "medium"
                  ? "bg-grady-gold/5 border-grady-gold/20"
                  : "bg-grady-green/5 border-grady-green/20"
              }`}>
                <p className="text-xs text-gray-500 mb-2">
                  Per raggiungere <strong>{target}</strong> in {subject?.name} devi prendere:
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-6xl font-extrabold ${
                    resultStatus === "hard" ? "text-grady-red"
                    : resultStatus === "medium" ? "text-grady-gold"
                    : "text-grady-green"
                  }`}>
                    {result % 1 === 0 ? result.toFixed(0) : result.toFixed(2)}
                  </span>
                  <span className="text-gray-400 text-lg">/10</span>
                </div>
                <p className="text-xs text-gray-400">
                  {resultStatus === "hard" && "⚠️ Difficile ma possibile — studia bene!"}
                  {resultStatus === "medium" && "👍 Alla tua portata — ce la puoi fare!"}
                  {resultStatus === "easy" && "✅ Facile — sei sulla strada giusta!"}
                </p>
                {subjectGrades.length > 0 && (
                  <p className="text-xs text-gray-300 mt-1">
                    Su {subjectGrades.length} vot{subjectGrades.length === 1 ? "o" : "i"} esistenti
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {!target && subjectGrades.length === 0 && (
          <p className="text-xs text-center text-gray-300 mt-2">
            Inserisci prima dei voti per questa materia
          </p>
        )}
      </div>
    </div>
  );
}
