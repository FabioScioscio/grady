import Link from "next/link";

const features = [
  {
    title: "Voti smart",
    description:
      "Inserisci i tuoi voti, calcola la media per materia e tieni tutto sotto controllo in un colpo d'occhio.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 4-8" />
      </svg>
    ),
    color: "text-grady-blue bg-grady-blue",
  },
  {
    title: "AI Coach",
    description:
      "Un coach personale analizza il tuo andamento e ti dice esattamente cosa ripassare prima di ogni verifica.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M12 2a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7l-1 3H9l-1-3C5.5 15.5 4 13 4 10a8 8 0 0 1 8-8z" />
        <path d="M9.5 10a2.5 2.5 0 0 0 5 0" />
      </svg>
    ),
    color: "text-grady-violet bg-grady-violet",
  },
  {
    title: "Simulatore",
    description:
      "Scegli il voto che vuoi raggiungere: ti calcoliamo esattamente che media devi fare nelle prossime interrogazioni.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <circle cx={12} cy={12} r={10} />
        <circle cx={12} cy={12} r={6} />
        <circle cx={12} cy={12} r={2} />
      </svg>
    ),
    color: "text-grady-green bg-grady-green",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Navbar */}
      <nav className="px-5 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-xl font-extrabold text-grady-blue tracking-tight">
          Grady
        </span>
        <Link
          href="/login"
          className="text-sm font-semibold text-grady-night hover:text-grady-violet transition-colors"
        >
          Accedi
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-grady-blue/10 text-grady-blue text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span>
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path d="M8 1.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V2a.5.5 0 0 1 .5-.5zm3.536 1.464a.5.5 0 0 1 0 .707l-.707.707a.5.5 0 1 1-.707-.707l.707-.707a.5.5 0 0 1 .707 0zm-8.779.707a.5.5 0 0 1 .707-.707l.707.707a.5.5 0 0 1-.707.707l-.707-.707zM8 5a3 3 0 1 1 0 6A3 3 0 0 1 8 5zm7 3a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1A.5.5 0 0 1 15 8zM2 8a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1A.5.5 0 0 1 2 8zm10.536 4.536a.5.5 0 0 1-.707 0l-.707-.707a.5.5 0 0 1 .707-.707l.707.707a.5.5 0 0 1 0 .707zm-9.9 0a.5.5 0 0 1 0-.707l.707-.707a.5.5 0 0 1 .707.707l-.707.707a.5.5 0 0 1-.707 0zM8 13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 13z" />
            </svg>
          </span>
          Il tuo nuovo diario scolastico
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-grady-night leading-tight tracking-tight max-w-xl">
          Your grades,
          <br />
          <span className="text-grady-blue">your goals.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-sm leading-relaxed">
          Voti, verifiche e obiettivi scolastici in un unico posto. Con un AI
          Coach che ti aiuta a migliorare davvero.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/signup"
            className="bg-grady-blue hover:bg-grady-violet text-white font-bold py-3.5 px-8 rounded-xl transition-colors text-base text-center"
          >
            Inizia gratis
          </Link>
          <Link
            href="/login"
            className="border border-gray-200 text-grady-night font-semibold py-3.5 px-8 rounded-xl transition-colors text-base hover:bg-gray-50 text-center"
          >
            Ho già un account
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Nessuna carta di credito richiesta
        </p>
      </section>

      {/* Features */}
      <section className="px-5 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-grady-night text-center mb-2">
            Tutto quello che ti serve
          </h2>
          <p className="text-center text-gray-400 text-sm mb-10">
            Finalmente in un posto solo.
          </p>

          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.color}/10 ${f.color.split(" ")[0]} mb-4`}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-grady-night text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="px-5 py-16 text-center bg-grady-blue">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          Pronto a prendere il controllo dei tuoi voti?
        </h2>
        <p className="text-grady-violet/80 text-sm mb-8 max-w-xs mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
          Unisciti a migliaia di studenti che usano Grady ogni giorno.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-white text-grady-blue font-bold py-3.5 px-10 rounded-xl transition-colors hover:bg-gray-100 text-base"
        >
          Inizia gratis
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-5 py-6 text-center text-xs text-gray-400 border-t border-gray-100">
        © 2025 Grady — Your grades, your goals.
      </footer>
    </div>
  );
}
