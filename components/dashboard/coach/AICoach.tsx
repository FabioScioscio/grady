"use client";

import { useState } from "react";

type State = "idle" | "loading" | "streaming" | "done" | "error";

export default function AICoach() {
  const [state, setState] = useState<State>("idle");
  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function analyze() {
    setState("loading");
    setText("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/coach", { method: "POST" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Errore sconosciuto.");
        setState("error");
        return;
      }

      setState("streaming");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setState("done");
    } catch {
      setErrorMsg("Impossibile connettersi. Controlla la connessione.");
      setState("error");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Intro card */}
      <div className="bg-gradient-to-br from-grady-blue to-grady-violet rounded-2xl p-6 text-white">
        <div className="text-3xl mb-2">🤖</div>
        <h2 className="text-lg font-extrabold mb-1">Il tuo AI Coach</h2>
        <p className="text-sm text-white/80 leading-relaxed">
          Analizzo i tuoi voti e ti do consigli personalizzati su dove concentrarti e come migliorare.
        </p>
      </div>

      {/* Pulsante analisi */}
      {(state === "idle" || state === "done" || state === "error") && (
        <button
          onClick={analyze}
          className="w-full bg-grady-blue text-white font-bold py-4 rounded-2xl text-base hover:bg-grady-violet transition flex items-center justify-center gap-2"
        >
          {state === "done" ? "🔄 Nuova analisi" : "✨ Analizza i miei voti"}
        </button>
      )}

      {/* Loading */}
      {state === "loading" && (
        <div className="flex items-center justify-center gap-3 py-8 text-grady-blue">
          <div className="w-5 h-5 border-2 border-grady-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Sto analizzando i tuoi voti…</span>
        </div>
      )}

      {/* Errore */}
      {state === "error" && (
        <div className="bg-grady-red/10 border border-grady-red/20 rounded-2xl p-4">
          <p className="text-sm font-semibold text-grady-red">⚠️ {errorMsg}</p>
        </div>
      )}

      {/* Testo in streaming / completato */}
      {(state === "streaming" || state === "done") && text && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {state === "streaming" && (
            <div className="flex items-center gap-2 mb-3 text-grady-blue">
              <div className="w-3 h-3 border-2 border-grady-blue border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold">Sto scrivendo…</span>
            </div>
          )}
          <div className="prose prose-sm max-w-none text-grady-night leading-relaxed whitespace-pre-wrap text-sm">
            {text}
            {state === "streaming" && (
              <span className="inline-block w-0.5 h-4 bg-grady-blue animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center px-4">
        L&apos;AI Coach usa i tuoi voti per generare consigli. Non sostituisce il consiglio di un insegnante.
      </p>
    </div>
  );
}
