// ─────────────────────────────────────────────
// Dati Ministero dell'Istruzione — Materie per tipo di scuola
// ─────────────────────────────────────────────

export type SchoolSubject = {
  name: string;
  emoji: string;
  color: string;
};

export type SchoolType = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  emoji: string;
  ageRange: string;
  subjects: SchoolSubject[];
};

// Colori fissi per materia (riconoscibili e consistenti)
const SUBJECT_PALETTE: Record<string, { emoji: string; color: string }> = {
  "Italiano":             { emoji: "📖", color: "#F04438" },
  "Latino":               { emoji: "🏛️", color: "#8B5CF6" },
  "Greco":                { emoji: "🏺", color: "#7C3AED" },
  "Matematica":           { emoji: "📐", color: "#2A1FBF" },
  "Fisica":               { emoji: "⚛️", color: "#0EA5E9" },
  "Chimica":              { emoji: "🧪", color: "#12B76A" },
  "Biologia":             { emoji: "🧬", color: "#16A34A" },
  "Scienze":              { emoji: "🔬", color: "#059669" },
  "Storia":               { emoji: "📜", color: "#F0A500" },
  "Filosofia":            { emoji: "🧠", color: "#EC4899" },
  "Inglese":              { emoji: "🇬🇧", color: "#0EA5E9" },
  "Francese":             { emoji: "🇫🇷", color: "#2563EB" },
  "Spagnolo":             { emoji: "🇪🇸", color: "#DC2626" },
  "Tedesco":              { emoji: "🇩🇪", color: "#CA8A04" },
  "Cinese":               { emoji: "🇨🇳", color: "#DC2626" },
  "Arte":                 { emoji: "🎨", color: "#EC4899" },
  "Storia dell'Arte":     { emoji: "🖼️", color: "#DB2777" },
  "Discipline Grafiche":  { emoji: "✏️", color: "#9D174D" },
  "Musica":               { emoji: "🎵", color: "#8B5CF6" },
  "Educazione Fisica":    { emoji: "⚽", color: "#16A34A" },
  "Tecnologia":           { emoji: "⚙️", color: "#5B4FE8" },
  "Informatica":          { emoji: "💻", color: "#2A1FBF" },
  "Sistemi e Reti":       { emoji: "🌐", color: "#0369A1" },
  "Gestione Progetto":    { emoji: "📊", color: "#0891B2" },
  "Economia Aziendale":   { emoji: "💼", color: "#B45309" },
  "Diritto":              { emoji: "⚖️", color: "#92400E" },
  "Scienze Umane":        { emoji: "👥", color: "#BE185D" },
  "Sociologia":           { emoji: "🤝", color: "#9D174D" },
  "Psicologia":           { emoji: "🧩", color: "#7E22CE" },
  "Geografia":            { emoji: "🌍", color: "#0284C7" },
  "Religione":            { emoji: "✝️", color: "#A16207" },
  "Elettronica":          { emoji: "⚡", color: "#D97706" },
  "Elettrotecnica":       { emoji: "🔌", color: "#B45309" },
  "Meccanica":            { emoji: "🔧", color: "#6B7280" },
  "Disegno":              { emoji: "📏", color: "#6366F1" },
};

function s(name: string): SchoolSubject {
  const data = SUBJECT_PALETTE[name] ?? { emoji: "📚", color: "#5B4FE8" };
  return { name, ...data };
}

export const SCHOOL_TYPES: SchoolType[] = [
  {
    id: "media",
    label: "Scuola Media",
    shortLabel: "Media",
    description: "Scuola Secondaria di Primo Grado",
    emoji: "🎒",
    ageRange: "11–13 anni",
    subjects: [
      s("Italiano"), s("Matematica"), s("Inglese"), s("Francese"),
      s("Storia"), s("Geografia"), s("Scienze"), s("Arte"),
      s("Musica"), s("Educazione Fisica"), s("Tecnologia"), s("Religione"),
    ],
  },
  {
    id: "liceo_scientifico",
    label: "Liceo Scientifico",
    shortLabel: "Lic. Scientifico",
    description: "Con Latino — indirizzo tradizionale",
    emoji: "🔬",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Latino"), s("Matematica"), s("Fisica"),
      s("Biologia"), s("Chimica"), s("Storia"), s("Filosofia"),
      s("Inglese"), s("Arte"), s("Educazione Fisica"), s("Religione"),
    ],
  },
  {
    id: "liceo_scientifico_sa",
    label: "Liceo Scientifico",
    shortLabel: "Sc. Applicate",
    description: "Scienze Applicate — senza Latino, con Informatica",
    emoji: "💻",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Matematica"), s("Fisica"), s("Chimica"),
      s("Biologia"), s("Informatica"), s("Storia"), s("Filosofia"),
      s("Inglese"), s("Arte"), s("Educazione Fisica"), s("Religione"),
    ],
  },
  {
    id: "liceo_classico",
    label: "Liceo Classico",
    shortLabel: "Lic. Classico",
    description: "Latino e Greco — cultura umanistica",
    emoji: "🏛️",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Latino"), s("Greco"), s("Matematica"),
      s("Fisica"), s("Scienze"), s("Storia"), s("Filosofia"),
      s("Inglese"), s("Arte"), s("Educazione Fisica"), s("Religione"),
    ],
  },
  {
    id: "liceo_linguistico",
    label: "Liceo Linguistico",
    shortLabel: "Lic. Linguistico",
    description: "Tre lingue straniere",
    emoji: "🌍",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Inglese"), s("Spagnolo"), s("Francese"),
      s("Matematica"), s("Fisica"), s("Scienze"), s("Storia"),
      s("Filosofia"), s("Arte"), s("Educazione Fisica"), s("Religione"),
    ],
  },
  {
    id: "liceo_scienze_umane",
    label: "Liceo Scienze Umane",
    shortLabel: "Sc. Umane",
    description: "Psicologia, Sociologia, Pedagogia",
    emoji: "👥",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Latino"), s("Matematica"), s("Fisica"),
      s("Scienze Umane"), s("Filosofia"), s("Storia"), s("Inglese"),
      s("Arte"), s("Educazione Fisica"), s("Religione"), s("Scienze"),
    ],
  },
  {
    id: "liceo_artistico",
    label: "Liceo Artistico",
    shortLabel: "Lic. Artistico",
    description: "Arte, design e discipline visive",
    emoji: "🎨",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Matematica"), s("Fisica"), s("Storia dell'Arte"),
      s("Discipline Grafiche"), s("Filosofia"), s("Storia"), s("Inglese"),
      s("Arte"), s("Educazione Fisica"), s("Religione"), s("Scienze"),
    ],
  },
  {
    id: "itis_informatica",
    label: "ITIS Informatica",
    shortLabel: "ITIS Inf.",
    description: "Istituto Tecnico — Informatica e Telecomunicazioni",
    emoji: "🖥️",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Matematica"), s("Fisica"), s("Informatica"),
      s("Sistemi e Reti"), s("Gestione Progetto"), s("Storia"),
      s("Inglese"), s("Educazione Fisica"), s("Religione"),
    ],
  },
  {
    id: "itis_elettronica",
    label: "ITIS Elettronica",
    shortLabel: "ITIS Elet.",
    description: "Istituto Tecnico — Elettronica ed Elettrotecnica",
    emoji: "⚡",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Matematica"), s("Fisica"), s("Elettronica"),
      s("Elettrotecnica"), s("Informatica"), s("Storia"),
      s("Inglese"), s("Educazione Fisica"), s("Religione"),
    ],
  },
  {
    id: "itis_meccanica",
    label: "ITIS Meccanica",
    shortLabel: "ITIS Mecc.",
    description: "Istituto Tecnico — Meccanica, Meccatronica e Energia",
    emoji: "🔧",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Matematica"), s("Fisica"), s("Meccanica"),
      s("Disegno"), s("Informatica"), s("Storia"),
      s("Inglese"), s("Educazione Fisica"), s("Religione"),
    ],
  },
  {
    id: "itec",
    label: "ITE / ITEC",
    shortLabel: "ITE Econom.",
    description: "Istituto Tecnico Economico — Amministrazione e Finanza",
    emoji: "💼",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Matematica"), s("Economia Aziendale"),
      s("Diritto"), s("Informatica"), s("Storia"), s("Inglese"),
      s("Scienze"), s("Educazione Fisica"), s("Religione"),
    ],
  },
  {
    id: "professionale",
    label: "Istituto Professionale",
    shortLabel: "Professionale",
    description: "Formazione professionale pratica",
    emoji: "🛠️",
    ageRange: "14–19 anni",
    subjects: [
      s("Italiano"), s("Matematica"), s("Storia"), s("Inglese"),
      s("Scienze"), s("Educazione Fisica"), s("Religione"),
    ],
  },
];

export function getSchoolById(id: string): SchoolType | undefined {
  return SCHOOL_TYPES.find((s) => s.id === id);
}
