import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import type { Grade, Subject } from "@/types";

export async function POST() {
  // Verifica che la chiave API sia configurata
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Chiave API Anthropic non configurata." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Verifica autenticazione
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Non autenticato." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Carica dati dello studente
  const [{ data: subjects }, { data: grades }] = await Promise.all([
    supabase.from("subjects").select("*").eq("user_id", user.id),
    supabase.from("grades").select("*").eq("user_id", user.id).order("date", { ascending: false }),
  ]);

  const subjectList = (subjects ?? []) as Subject[];
  const gradeList = (grades ?? []) as Grade[];

  if (subjectList.length === 0) {
    return new Response(
      JSON.stringify({ error: "Non hai ancora aggiunto nessuna materia." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Costruisci il riepilogo delle materie con medie
  const subjectSummaries = subjectList.map((s) => {
    const sg = gradeList.filter((g) => g.subject_id === s.id);
    if (sg.length === 0) return `- ${s.name}: nessun voto`;
    const avg = sg.reduce((a, g) => a + g.value, 0) / sg.length;
    const voti = sg.map((g) => `${g.value} (${g.type})`).join(", ");
    return `- ${s.name}: media ${avg.toFixed(1)}, voti: ${voti}`;
  }).join("\n");

  const prompt = `Sei un tutor scolastico italiano amichevole e incoraggiante che aiuta studenti delle scuole medie e superiori (11-19 anni).

Ecco la situazione scolastica dello studente:

${subjectSummaries}

Analizza i dati e fornisci:
1. Un commento generale sulla situazione (2-3 frasi, tono positivo ma onesto)
2. I punti di forza (materie o voti eccellenti)
3. Le aree da migliorare con consigli pratici e specifici
4. Un messaggio motivazionale finale

Usa un tono caldo, diretto e incoraggiante. Scrivi in italiano. Usa emoji con moderazione. Sii concreto, non generico.`;

  // Stream la risposta di Claude
  const client = new Anthropic();

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  // Trasforma lo stream di Anthropic in uno stream HTTP
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
