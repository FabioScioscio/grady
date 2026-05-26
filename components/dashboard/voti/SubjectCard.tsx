"use client";

import { useState } from "react";
import type { Grade, Subject } from "@/types";
import GradePill from "./GradePill";
import { deleteSubject, deleteGrade, addGrade } from "@/app/dashboard/voti/actions";

type Props = {
  subject: Subject;
  grades: Grade[];
};

function calcAverage(grades: Grade[]): number | null {
  if (grades.length === 0) return null;
  return Math.round((grades.reduce((acc, g) => acc + g.value, 0) / grades.length) * 10) / 10;
}

const today = new Date().toISOString().split("T")[0];

export default function SubjectCard({ subject, grades }: Props) {
  const [showForm, setShowForm] = useState(false);
  const avg = calcAverage(grades);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Header materia ─────────────────────────────── */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ backgroundColor: subject.color + "12", borderLeft: `4px solid ${subject.color}` }}
      >
        {/* Emoji */}
        <span className="text-2xl shrink-0">{subject.emoji ?? "📚"}</span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-grady-night text-base truncate">{subject.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {grades.length === 0
              ? "Nessun voto ancora"
              : `${grades.length} vot${grades.length === 1 ? "o" : "i"} · media `}
            {avg !== null && (
              <span className="font-bold" style={{ color: subject.color }}>{avg}</span>
            )}
          </p>
        </div>

        {/* Azioni */}
        <div className="flex items-center gap-2 shrink-0">
          {avg !== null && <GradePill value={avg} />}
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg hover:opacity-80 transition shrink-0"
            style={{ backgroundColor: subject.color }}
            title="Aggiungi voto"
          >
            {showForm ? "−" : "+"}
          </button>
          <form action={deleteSubject.bind(null, subject.id)}>
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-grady-red/10 hover:text-grady-red transition text-xs"
              title="Elimina materia"
              onClick={(e) => {
                if (!confirm(`Eliminare "${subject.name}" e tutti i suoi voti?`)) {
                  e.preventDefault();
                }
              }}
            >
              ✕
            </button>
          </form>
        </div>
      </div>

      {/* ── Barra media ────────────────────────────────── */}
      {avg !== null && (
        <div className="h-1 bg-gray-100">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${(avg / 10) * 100}%`, backgroundColor: subject.color }}
          />
        </div>
      )}

      {/* ── Form aggiungi voto ─────────────────────────── */}
      {showForm && (
        <form
          action={async (fd: FormData) => {
            await addGrade(fd);
            setShowForm(false);
          }}
          className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3"
        >
          <input type="hidden" name="subject_id" value={subject.id} />
          <p className="text-xs font-bold text-gray-500">Nuovo voto in {subject.name}</p>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Voto</label>
              <input
                name="value"
                type="number"
                min="1"
                max="10"
                step="0.25"
                required
                placeholder="7.5"
                autoFocus
                className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-base font-bold focus:outline-none focus:border-grady-blue transition bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Tipo</label>
              <select name="type" className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-grady-blue bg-white transition">
                <option value="scritto">✏️ Scritto</option>
                <option value="orale">🎤 Orale</option>
                <option value="pratico">🔧 Pratico</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Data</label>
              <input name="date" type="date" defaultValue={today} required
                className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-grady-blue bg-white transition" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Nota (opzionale)</label>
              <input name="description" type="text" placeholder="es. Cap. 5"
                className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-grady-blue bg-white transition" />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition hover:opacity-90 shadow-sm"
              style={{ backgroundColor: subject.color }}
            >
              Salva voto
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition">
              Annulla
            </button>
          </div>
        </form>
      )}

      {/* ── Lista voti ─────────────────────────────────── */}
      {grades.length > 0 && (
        <ul className="divide-y divide-gray-50">
          {grades.map((g) => (
            <li key={g.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition">
              <div className="flex items-center gap-3">
                <GradePill value={g.value} />
                <div>
                  <p className="text-xs font-semibold text-grady-night">
                    {g.type === "scritto" ? "✏️" : g.type === "orale" ? "🎤" : "🔧"}{" "}
                    <span className="capitalize">{g.type}</span>
                  </p>
                  {g.description && <p className="text-xs text-gray-400">{g.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-300">
                  {new Date(g.date + "T12:00:00").toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                </span>
                <form action={deleteGrade.bind(null, g.id)}>
                  <button type="submit"
                    className="w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-grady-red hover:bg-grady-red/10 transition text-xs">
                    ✕
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
