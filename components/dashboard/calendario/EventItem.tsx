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

export default function EventItem({ event }: Props) {
  const cfg = TYPE_CONFIG[event.type] ?? { emoji: "📌", color: "text-gray-500 bg-gray-100" };

  return (
    <li className={`flex items-start gap-3 py-3 px-1 ${event.completed ? "opacity-50" : ""}`}>
      {/* Checkbox completato */}
      <form action={toggleEvent.bind(null, event.id, !event.completed)} className="mt-0.5">
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
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${cfg.color}`}>
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

      {/* Delete */}
      <form action={deleteEvent.bind(null, event.id)} className="shrink-0">
        <button
          type="submit"
          className="text-gray-300 hover:text-grady-red transition text-xs mt-1"
          title="Elimina"
        >
          ✕
        </button>
      </form>
    </li>
  );
}
