import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 px-5 py-3.5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-grady-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">G</span>
          </div>
          <span className="text-lg font-extrabold text-grady-blue tracking-tight">Grady</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-500 hover:text-grady-night transition"
          >
            Accedi
          </Link>
          <Link
            href="/signup"
            className="bg-grady-blue text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-grady-violet transition"
          >
            Inizia gratis
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-5 flex flex-col items-center text-center relative overflow-hidden">
        {/* Sfondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-b from-grady-blue/5 via-white to-white pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-grady-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-grady-blue/10 text-grady-blue text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span>✦</span>
            Il diario scolastico smart per studenti italiani
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-extrabold text-grady-night leading-[1.05] tracking-tight max-w-2xl mx-auto">
            I tuoi voti,{" "}
            <span className="bg-gradient-to-r from-grady-blue to-grady-violet bg-clip-text text-transparent">
              i tuoi obiettivi.
            </span>
          </h1>

          <p className="mt-5 text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            Registra i voti, tieni d&apos;occhio la media, pianifica verifiche e
            scopri il voto che ti serve per raggiungere il tuo target.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="bg-grady-blue hover:bg-grady-violet text-white font-bold py-4 px-10 rounded-2xl transition-all text-base shadow-lg shadow-grady-blue/25 hover:shadow-grady-violet/25 hover:-translate-y-0.5"
            >
              Inizia gratis — è gratis 🚀
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-200 text-grady-night font-semibold py-4 px-8 rounded-2xl transition hover:border-grady-blue/30 hover:bg-gray-50 text-base"
            >
              Ho già un account
            </Link>
          </div>
          <p className="mt-3 text-xs text-gray-400">Nessuna carta di credito · Nessun abbonamento</p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: "10k+", label: "Studenti attivi" },
              { value: "98%", label: "Media migliorata" },
              { value: "5★", label: "Recensioni" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-grady-blue">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP PREVIEW ─────────────────────────────────── */}
      <section className="px-5 pb-16 flex justify-center">
        <div className="w-full max-w-sm bg-gradient-to-br from-grady-blue via-grady-violet to-purple-700 rounded-3xl p-5 shadow-2xl shadow-grady-blue/30">
          {/* Fake header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-xs">Buongiorno 👋</p>
              <p className="text-white font-extrabold text-lg">Marco</p>
            </div>
            <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full">🔬 Liceo Scientifico</span>
          </div>
          {/* Media */}
          <div className="bg-white/10 rounded-2xl p-4 mb-3">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Media generale</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-grady-green">7.8</span>
              <span className="text-white/40">/10</span>
            </div>
            <p className="text-white/40 text-xs mt-1">14 voti inseriti</p>
          </div>
          {/* Materie */}
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Andamento</p>
            {[
              { name: "Matematica", avg: 7.5, color: "#2A1FBF", w: 75 },
              { name: "Italiano", avg: 8.0, color: "#F04438", w: 80 },
              { name: "Fisica", avg: 6.5, color: "#0EA5E9", w: 65 },
            ].map((s) => (
              <div key={s.name} className="mb-2.5 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white text-xs font-semibold">{s.name}</p>
                  <p className="text-white text-xs font-bold">{s.avg}</p>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.w}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section className="px-5 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-grady-blue text-xs font-bold uppercase tracking-widest mb-2">Funzionalità</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-grady-night">
              Tutto quello che ti serve,<br />in un posto solo.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                emoji: "📊",
                title: "Voti e medie intelligenti",
                description: "Inserisci voti scritti, orali e pratici. Grady calcola automaticamente la media per ogni materia e quella globale.",
                color: "bg-grady-blue/10 text-grady-blue",
              },
              {
                emoji: "📅",
                title: "Calendario verifiche",
                description: "Aggiungi verifiche, interrogazioni e compiti. Visualizza tutto in ordine cronologico e non perdere una scadenza.",
                color: "bg-grady-violet/10 text-grady-violet",
              },
              {
                emoji: "🎯",
                title: "Simulatore voto",
                description: "Scegli la media che vuoi raggiungere e Grady ti dice esattamente che voto devi prendere al prossimo compito.",
                color: "bg-grady-green/10 text-grady-green",
              },
              {
                emoji: "🏫",
                title: "Materie dal Ministero",
                description: "Scegli il tuo tipo di scuola e ricevi automaticamente tutte le materie previste dal Ministero dell'Istruzione.",
                color: "bg-grady-gold/10 text-grady-gold",
              },
              {
                emoji: "⚡",
                title: "Veloce e offline-first",
                description: "Interfaccia fluida e reattiva. Inserisci un voto in 3 tap, sempre disponibile anche con connessione lenta.",
                color: "bg-grady-red/10 text-grady-red",
              },
              {
                emoji: "🔒",
                title: "I tuoi dati, solo tuoi",
                description: "Ogni account è completamente privato. I tuoi voti non vengono condivisi con nessuno. Sempre.",
                color: "bg-gray-100 text-gray-500",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 text-2xl ${f.color}`}>
                  {f.emoji}
                </div>
                <h3 className="font-bold text-grady-night text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHOOL TYPES ────────────────────────────────── */}
      <section className="px-5 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-grady-blue text-xs font-bold uppercase tracking-widest mb-2">Compatibile con</p>
          <h2 className="text-3xl font-extrabold text-grady-night mb-4">Per ogni tipo di scuola</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-sm mx-auto">
            Seleziona la tua scuola e ricevi le materie pre-configurate dal Ministero dell&apos;Istruzione.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "🏫 Scuola Media",
              "🔬 Liceo Scientifico",
              "📜 Liceo Classico",
              "🌍 Liceo Linguistico",
              "🎨 Liceo Artistico",
              "💻 ITIS",
              "💼 ITE",
              "🤝 Scienze Umane",
              "🔧 Liceo Professionale",
            ].map((s) => (
              <span key={s} className="bg-gray-100 text-grady-night text-sm font-semibold px-4 py-2 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINALE ──────────────────────────────────── */}
      <section className="mx-5 mb-16 rounded-3xl bg-gradient-to-br from-grady-blue via-grady-violet to-purple-700 px-8 py-14 text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="relative">
          <p className="text-white/60 text-sm font-medium mb-2">Inizia oggi, è gratis</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Pronto a prendere il controllo dei tuoi voti?
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-xs mx-auto">
            Unisciti a migliaia di studenti che usano Grady ogni giorno per migliorare la propria media.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-grady-blue font-extrabold py-4 px-10 rounded-2xl transition hover:bg-gray-100 text-base shadow-xl"
          >
            Crea il tuo account gratis →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="px-5 py-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-grady-blue rounded-md flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">G</span>
          </div>
          <span className="text-sm font-bold text-grady-blue">Grady</span>
        </div>
        <p className="text-xs text-gray-400">© 2025 Grady — Your grades, your goals.</p>
        <div className="flex gap-4">
          <Link href="/login" className="text-xs text-gray-400 hover:text-grady-blue transition">Accedi</Link>
          <Link href="/signup" className="text-xs text-gray-400 hover:text-grady-blue transition">Registrati</Link>
        </div>
      </footer>
    </div>
  );
}
