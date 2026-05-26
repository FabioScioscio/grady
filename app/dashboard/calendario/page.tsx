import { createClient } from "@/lib/supabase/server";
import type { GradyEvent, Subject } from "@/types";
import AddEventForm from "@/components/dashboard/calendario/AddEventForm";
import EventItem from "@/components/dashboard/calendario/EventItem";

function formatDateLabel(isoDate: string, today: string): string {
  const date = new Date(isoDate + "T12:00:00");
  const diff = Math.round((new Date(isoDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
  const dateStr = date.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
  if (diff === 0) return `Oggi — ${dateStr}`;
  if (diff === 1) return `Domani — ${dateStr}`;
  if (diff <= 7) return `Tra ${diff} giorni — ${dateStr}`;
  return dateStr;
}

function groupByDate(events: GradyEvent[]): Map<string, GradyEvent[]> {
  const map = new Map<string, GradyEvent[]>();
  for (const ev of events) {
    const list = map.get(ev.date) ?? [];
    list.push(ev);
    map.set(ev.date, list);
  }
  return map;
}

function isUrgent(date: string, today: string): boolean {
  const diff = Math.round((new Date(date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
  return diff <= 2;
}

export default async function CalendarioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const [{ data: events }, { data: subjects }] = await Promise.all([
    supabase.from("events").select("*, subject:subjects(id, name, color)").eq("user_id", user!.id).gte("date", today).order("date"),
    supabase.from("subjects").select("*").eq("user_id", user!.id).order("name"),
  ]);

  const eventList = (events ?? []) as GradyEvent[];
  const subjectList = (subjects ?? []) as Subject[];

  const upcoming = eventList.filter((e) => !e.completed);
  const done = eventList.filter((e) => e.completed);

  const grouped = groupByDate(upcoming);
  const sortedDates = Array.from(grouped.keys()).sort();

  const verifiche = upcoming.filter(e => e.type === "verifica" || e.type === "interrogazione").length;
  const compiti = upcoming.filter(e => e.type === "compito").length;

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50">

      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-5 pt-10 pb-6">
        <h1 className="text-2xl font-extrabold text-grady-night mb-4">Calendario</h1>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold text-grady-blue">{upcoming.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">In arrivo</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold text-grady-violet">{verifiche}</p>
            <p className="text-xs text-gray-400 mt-0.5">Verifiche</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold text-grady-gold">{compiti}</p>
            <p className="text-xs text-gray-400 mt-0.5">Compiti</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">

        {/* Lista eventi raggruppata per data */}
        {upcoming.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-3">📅</p>
            <p className="font-bold text-grady-night mb-1">Nessun evento in arrivo</p>
            <p className="text-sm text-gray-400">Aggiungi verifiche, compiti e interrogazioni.</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            const urgent = isUrgent(date, today);
            return (
              <div key={date} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${urgent ? "border-grady-red/30" : "border-gray-100"}`}>
                {/* Header data */}
                <div className={`px-5 py-3 border-b ${urgent ? "bg-grady-red/5 border-grady-red/10" : "bg-gray-50 border-gray-100"}`}>
                  <p className={`text-xs font-bold capitalize ${urgent ? "text-grady-red" : "text-grady-blue"}`}>
                    {urgent && "🔴 "}
                    {formatDateLabel(date, today)}
                  </p>
                </div>
                <ul className="divide-y divide-gray-50 px-4">
                  {grouped.get(date)!.map((ev) => (
                    <EventItem key={ev.id} event={ev} />
                  ))}
                </ul>
              </div>
            );
          })
        )}

        {/* Form aggiungi evento */}
        <AddEventForm subjects={subjectList} />

        {/* Completati */}
        {done.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">✅ Completati ({done.length})</p>
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
    </div>
  );
}
