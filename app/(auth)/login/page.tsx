"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.get("email") as string,
        password: form.get("password") as string,
      });

      if (error) {
        setError("Email o password errati. Riprova.");
        setPending(false);
        return;
      }

      window.location.href = "/dashboard";
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
        {/* Tagline */}
        <div className="relative">
          <p className="text-white/60 text-sm font-medium mb-2">Bentornato su Grady</p>
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            I tuoi voti,<br />
            <span className="text-white/70">i tuoi obiettivi.</span>
          </h2>
          {/* Mini UI card */}
          <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-5">
            <p className="text-white/50 text-xs mb-1">Media generale</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-extrabold text-grady-green">7.8</span>
              <span className="text-white/40 text-sm">/10</span>
            </div>
            <div className="flex gap-2">
              {["8.5", "6.5", "9", "7"].map((v) => (
                <span key={v} className="bg-white/15 text-white text-xs font-bold px-2.5 py-1 rounded-full">{v}</span>
              ))}
            </div>
          </div>
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

          <h1 className="text-2xl font-extrabold text-grady-night mb-1">Bentornato</h1>
          <p className="text-sm text-gray-400 mb-8">Accedi per vedere i tuoi voti e obiettivi.</p>

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
                autoComplete="current-password"
                placeholder="••••••••"
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
                  Accesso in corso…
                </span>
              ) : "Accedi"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Non hai un account?{" "}
            <Link href="/signup" className="text-grady-blue font-bold hover:underline">
              Registrati gratis
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
