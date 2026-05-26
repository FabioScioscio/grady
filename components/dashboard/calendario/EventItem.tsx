"use client";

import { toggleEvent, deleteEvent } from "@/app/dashboard/calendario/actions";
import type { GradyEvent } from "@/types";

type Props = {
  event: GradyEvent;
};

const TYPE_CONFIG: Record<string, { emoji: string; color: string }> = {
  verifica:       { emoji: "📝", color: "text-grady-blue bg-grady-blue/10" },
  interrogazione: { emoji: "🎤", color: "text-grady-violet bg-grady-violet/10" },
  compito:        { emoji: "📚", color: "text-grady-gold bg-grady-gold/10" },
};

function getDaysLabel(date: string): { text: string; urgent: boolean } {
  const today = new Date().toISOString().split("T")[0];
  const diff = Math.round((new Date(date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return { text: "Oggi", urgent: true };
  if (diff === 1) return { text: "Domani", urgent: true };
  if (diff < 0) return { text: "Scaduto", urgent: false };
  return { text: `${diff}g`, urgent: diff <= 3 };
}

export default function EventItem({ event }: Props) {
  const cfg = TYPE_CONFIG[event.type] ?? { emoji: "📌", color: "text-gray-500 bg-gray-100" };
  const days = getDaysLabel(event.date);

  return (
    <li className={`flex items-center gap-3 py-3 px-1 ${event.completed ? "opacity-50" : ""}`}>
      {/* Checkbox completato */}
      <form action={toggleEvent.bind(null, event.id, !event.completed)}>
        <button
          type="submit"
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
            event.completed
              ? "bg-grady-green border-grady-green text-white"
              : "border-gray-300 hover:border-grady-green"
          }`}
          title={event.completed ? "Segna come da fare" : "Segna come fatto"}
        >
          {event.completed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </form>

      {/* Badge tipo */}
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${cfg.color}`}>
        {cfg.emoji} {event.type}
      </span>

      {/* Contenuto */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold text-grady-night leading-tight ${event.completed ? "line-through" : ""}`}>
          {event.title}
        </p>
        {event.subject && (
          <p className="text-xs text-gray-400 mt-0.5">{event.subject.name}</p>
        )}
      </div>

      {/* Countdown */}
      {!event.completed && (
        <span className={`text-xs font-bold shrink-0 px-2 py-0.5 rounded-full ${
          days.urgent ? "bg-grady-red/10 text-grady-red" : "text-gray-300"
        }`}>
          {days.text}
        </span>
      )}

      {/* Delete */}
      <form action={deleteEvent.bind(null, event.id)} className="shrink-0">
        <button
          type="submit"
          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-grady-red hover:bg-grady-red/10 transition text-xs"
          title="Elimina"
        >
          ✕
        </button>
      </form>
    </li>
  );
}
