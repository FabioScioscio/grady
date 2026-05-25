import { createClient } from "@/lib/supabase/server";
import type { GradyEvent, Subject } from "@/types";
import AddEventForm from "@/components/dashboard/calendario/AddEventForm";
import EventItem from "@/components/dashboard/calendario/EventItem";

// Formatta una data ISO in italiano leggibile: "Lunedì 26 maggio"
function formatDateLabel(isoDate: string): string {
  const date = new Date(isoDate + "T12:00:00"); // Forziamo mezzogiorno per evitare problemi di fuso
  return date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// Raggruppa eventi per data
function groupByDate(events: GradyEvent[]): Map<string, GradyEvent[]> {
  const map = new Map<string, GradyEvent[]>();
  for (const ev of events) {
    const list = map.get(ev.date) ?? [];
    list.push(ev);
    map.set(ev.date, list);
  }
  return map;
}

export default async function CalendarioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  // Carica eventi e materie in parallelo
  const [{ data: events }, { data: subjects }] = await Promise.all([
    supabase
      .from("events")
      .select("*, subject:subjects(id, name, color)")
      .eq("user_id", user!.id)
      .gte("date", today)          // Solo eventi futuri (incluso oggi)
      .order("date", { ascending: true }),
    supabase
      .from("subjects")
      .select("*")
      .eq("user_id", user!.id)
      .order("name", { ascending: true }),
  ]);

  const eventList = (events ?? []) as GradyEvent[];
  const subjectList = (subjects ?? []) as Subject[];

  // Separa futuri (non completati) e completati
  const upcoming = eventList.filter((e) => !e.completed);
  const done = eventList.filter((e) => e.completed);

  const grouped = groupByDate(upcoming);
  const sortedDates = Array.from(grouped.keys()).sort();

  return (
    <div className="px-5 pt-8 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-grady-night">Calendario</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {upcoming.length === 0
            ? "Nessun evento in arrivo"
            : `${upcoming.length} event${upcoming.length === 1 ? "o" : "i"} in arrivo`}
        </p>
      </div>

      {/* Lista eventi raggruppata per data */}
      {upcoming.length === 0 ? (
        <div className="text-center py-12 text-gray-400 mb-6">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-semibold text-grady-night">Nessun evento in arrivo</p>
          <p className="text-sm mt-1">Aggiungi verifiche, compiti e interrogazioni.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {sortedDates.map((date) => (
            <div key={date} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header data */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-bold text-grady-blue capitalize">
                  {formatDateLabel(date)}
                </p>
              </div>
              {/* Eventi del giorno */}
              <ul className="divide-y divide-gray-50 px-4">
                {grouped.get(date)!.map((ev) => (
                  <EventItem key={ev.id} event={ev} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Form aggiungi evento */}
      <AddEventForm subjects={subjectList} />

      {/* Sezione completati */}
      {done.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">Completati</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-50 px-4">
              {done.map((ev) => (
                <EventItem key={ev.id} event={ev} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
