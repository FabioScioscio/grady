"use client";

import { useState } from "react";
import { addSubject } from "@/app/dashboard/voti/actions";

// Palette di colori predefiniti per le materie
const COLORS = [
  "#2A1FBF", "#5B4FE8", "#12B76A", "#F04438",
  "#F0A500", "#0EA5E9", "#8B5CF6", "#EC4899",
];

export default function AddSubjectForm() {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-4 text-sm font-semibold text-gray-400 hover:border-grady-blue hover:text-grady-blue transition"
      >
        + Aggiungi materia
      </button>
    );
  }

  return (
    <form
      action={async (fd: FormData) => {
        fd.set("color", selectedColor);
        await addSubject(fd);
        setOpen(false);
        setSelectedColor(COLORS[0]);
      }}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
    >
      <h3 className="font-bold text-grady-night">Nuova materia</h3>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Nome</label>
        <input
          name="name"
          type="text"
          required
          placeholder="es. Matematica"
          autoFocus
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-2 block">Colore</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedColor(c)}
              className="w-7 h-7 rounded-full border-2 transition"
              style={{
                backgroundColor: c,
                borderColor: selectedColor === c ? "#1C1A2E" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-grady-blue text-white font-bold py-2.5 rounded-xl text-sm hover:bg-grady-violet transition"
        >
          Crea materia
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
