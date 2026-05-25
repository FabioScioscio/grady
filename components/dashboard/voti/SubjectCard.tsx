"use client";

import { useState } from "react";
import type { Grade, Subject } from "@/types";
import GradePill from "./GradePill";
import { deleteSubject, deleteGrade, addGrade } from "@/app/dashboard/voti/actions";

type Props = {
  subject: Subject;
  grades: Grade[];
};

// Calcola la media arrotondata a 1 decimale
function calcAverage(grades: Grade[]): number | null {
  if (grades.length === 0) return null;
  const sum = grades.reduce((acc, g) => acc + g.value, 0);
  return Math.round((sum / grades.length) * 10) / 10;
}

const today = new Date().toISOString().split("T")[0];

export default function SubjectCard({ subject, grades }: Props) {
  const [showForm, setShowForm] = useState(false);
  const avg = calcAverage(grades);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header materia */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderLeft: `4px solid ${subject.color}` }}
      >
        <div>
          <h3 className="font-bold text-grady-night text-base">{subject.name}</h3>
          {avg !== null ? (
            <p className="text-xs text-gray-400 mt-0.5">
              Media: <span className="font-bold text-grady-night">{avg}</span>
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-0.5">Nessun voto ancora</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {avg !== null && <GradePill value={avg} />}
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-8 h-8 rounded-full bg-grady-blue/10 text-grady-blue flex items-center justify-center hover:bg-grady-blue/20 transition font-bold text-lg"
            title="Aggiungi voto"
          >
            +
          </button>
          <form action={deleteSubject.bind(null, subject.id)}>
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-grady-red/10 hover:text-grady-red transition text-sm"
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

      {/* Form aggiungi voto */}
      {showForm && (
        <form
          action={async (fd: FormData) => {
            await addGrade(fd);
            setShowForm(false);
          }}
          className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3"
        >
          <input type="hidden" name="subject_id" value={subject.id} />

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Voto</label>
              <input
                name="value"
                type="number"
                min="1"
                max="10"
                step="0.25"
                required
                placeholder="es. 7.5"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Tipo</label>
              <select
                name="type"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue bg-white"
              >
                <option value="scritto">Scritto</option>
                <option value="orale">Orale</option>
                <option value="pratico">Pratico</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Data</label>
              <input
                name="date"
                type="date"
                defaultValue={today}
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Nota (opz.)</label>
              <input
                name="description"
                type="text"
                placeholder="es. Equazioni"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-grady-blue text-white font-bold py-2 rounded-xl text-sm hover:bg-grady-violet transition"
            >
              Salva voto
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
            >
              Annulla
            </button>
          </div>
        </form>
      )}

      {/* Lista voti */}
      {grades.length > 0 && (
        <ul className="divide-y divide-gray-50">
          {grades.map((g) => (
            <li key={g.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <GradePill value={g.value} />
                <div>
                  <p className="text-xs font-semibold text-grady-night capitalize">{g.type}</p>
                  {g.description && (
                    <p className="text-xs text-gray-400">{g.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-300">
                  {new Date(g.date).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                </span>
                <form action={deleteGrade.bind(null, g.id)}>
                  <button
                    type="submit"
                    className="text-gray-300 hover:text-grady-red transition text-xs"
                    title="Elimina voto"
                  >
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
