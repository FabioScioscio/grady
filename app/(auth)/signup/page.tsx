"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email: form.get("email") as string,
        password: form.get("password") as string,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("already") || msg.includes("registered")) {
          setError("Questa email è già registrata. Prova ad accedere.");
        } else {
          setError(`Errore: ${error.message}`);
        }
        setPending(false);
        return;
      }

      window.location.href = "/onboarding";
    } catch {
      setError("Errore di connessione. Controlla la rete e riprova.");
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Sinistra: gradiente (solo desktop) ─ */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-grady-blue via-grady-violet to-purple-700 p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
        {/* Logo */}
        <div className="flex items-center gap-2 relative">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">G</span>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">Grady</span>
        </div>
        {/* Benefits */}
        <div className="relative space-y-4">
          <p className="text-white/60 text-sm font-medium mb-2">Perché Grady?</p>
          {[
            { icon: "📊", text: "Calcolo automatico delle medie per materia" },
            { icon: "🎯", text: "Simulatore per capire che voto ti serve" },
            { icon: "📅", text: "Calendario verifiche e interrogazioni" },
            { icon: "🏫", text: "Materie pre-caricate dal Ministero dell'Istruzione" },
            { icon: "🔒", text: "I tuoi dati sono privati e sicuri" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center text-base shrink-0">
                {b.icon}
              </div>
              <p className="text-white/80 text-sm font-medium leading-tight">{b.text}</p>
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs relative">© 2025 Grady</p>
      </div>

      {/* ── Destra: form ─────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-10 md:hidden">
            <div className="w-8 h-8 bg-grady-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">G</span>
            </div>
            <span className="text-grady-blue font-extrabold text-xl tracking-tight">Grady</span>
          </Link>

          <h1 className="text-2xl font-extrabold text-grady-night mb-1">Crea il tuo account</h1>
          <p className="text-sm text-gray-400 mb-8">Gratis per sempre. Nessuna carta di credito.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-grady-night mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="mario@esempio.it"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-grady-night placeholder:text-gray-300 focus:outline-none focus:border-grady-blue transition bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-grady-night mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Minimo 6 caratteri"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-grady-night placeholder:text-gray-300 focus:outline-none focus:border-grady-blue transition bg-gray-50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-grady-red bg-grady-red/8 rounded-xl px-4 py-3">
                <span className="shrink-0">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="bg-grady-blue hover:bg-grady-violet disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-base mt-2 shadow-md shadow-grady-blue/20 hover:shadow-grady-violet/20 hover:-translate-y-0.5"
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                  Creazione account…
                </span>
              ) : "🚀 Inizia gratis"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Registrandoti accetti i nostri termini di servizio.
          </p>

          <p className="text-center text-sm text-gray-400 mt-4">
            Hai già un account?{" "}
            <Link href="/login" className="text-grady-blue font-bold hover:underline">
              Accedi
            </Link>
          </p>

          <Link href="/" className="block text-center text-xs text-gray-300 hover:text-gray-400 transition mt-6">
            ← Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}
