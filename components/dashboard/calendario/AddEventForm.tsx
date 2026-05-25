"use client";

import { useState } from "react";
import { addEvent } from "@/app/dashboard/calendario/actions";
import type { Subject } from "@/types";

type Props = {
  subjects: Subject[];
};

const today = new Date().toISOString().split("T")[0];

const EVENT_TYPES = [
  { value: "verifica", label: "Verifica", emoji: "📝" },
  { value: "interrogazione", label: "Interrogazione", emoji: "🎤" },
  { value: "compito", label: "Compito", emoji: "📚" },
];

export default function AddEventForm({ subjects }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-4 text-sm font-semibold text-gray-400 hover:border-grady-blue hover:text-grady-blue transition"
      >
        + Aggiungi evento
      </button>
    );
  }

  return (
    <form
      action={async (fd: FormData) => {
        await addEvent(fd);
        setOpen(false);
      }}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
    >
      <h3 className="font-bold text-grady-night">Nuovo evento</h3>

      {/* Tipo */}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-2 block">Tipo</label>
        <div className="flex gap-2">
          {EVENT_TYPES.map((t) => (
            <label
              key={t.value}
              className="flex-1 cursor-pointer"
            >
              <input
                type="radio"
                name="type"
                value={t.value}
                defaultChecked={t.value === "verifica"}
                className="sr-only peer"
              />
              <div className="text-center border border-gray-200 rounded-xl py-2 px-1 text-xs font-semibold text-gray-500 peer-checked:border-grady-blue peer-checked:text-grady-blue peer-checked:bg-grady-blue/5 transition">
                <div>{t.emoji}</div>
                <div>{t.label}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Titolo */}
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Descrizione</label>
        <input
          name="title"
          type="text"
          required
          placeholder="es. Verifica capitolo 5"
          autoFocus
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue"
        />
      </div>

      {/* Materia + Data */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Materia</label>
          <select
            name="subject_id"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue bg-white"
          >
            <option value="">—</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Data</label>
          <input
            name="date"
            type="date"
            required
            defaultValue={today}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-grady-blue text-white font-bold py-2.5 rounded-xl text-sm hover:bg-grady-violet transition"
        >
          Salva evento
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
