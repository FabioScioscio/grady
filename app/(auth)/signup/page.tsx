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

    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-white">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <span className="text-2xl font-extrabold text-grady-blue tracking-tight">
            Grady
          </span>
        </Link>

        <h1 className="text-2xl font-extrabold text-grady-night mb-1">
          Crea il tuo account
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Gratis per sempre. Nessuna carta di credito.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-grady-night mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="mario@esempio.it"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-grady-night placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-grady-night mb-1.5"
            >
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-grady-night placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-grady-blue/30 focus:border-grady-blue transition"
            />
          </div>

          {error && (
            <p className="text-sm text-grady-red bg-grady-red/10 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-grady-blue hover:bg-grady-violet disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-base mt-2"
          >
            {pending ? "Registrazione in corso…" : "Inizia gratis"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Hai già un account?{" "}
          <Link
            href="/login"
            className="text-grady-blue font-semibold hover:underline"
          >
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
