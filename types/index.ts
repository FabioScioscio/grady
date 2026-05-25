// ─────────────────────────────────────────────
// Tipi base dell'app Grady
// ─────────────────────────────────────────────

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Subject = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type GradeType = "scritto" | "orale" | "pratico";

export type Grade = {
  id: string;
  user_id: string;
  subject_id: string;
  value: number;          // es. 7.5
  type: GradeType;
  description: string | null;
  date: string;           // ISO date "2025-05-20"
  created_at: string;
  // Join opzionale
  subject?: Subject;
};

export type EventType = "verifica" | "compito" | "interrogazione";

export type GradyEvent = {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  type: EventType;
  date: string;
  completed: boolean;
  created_at: string;
  // Join opzionale
  subject?: Subject;
};

export type Goal = {
  id: string;
  user_id: string;
  subject_id: string | null;
  target_average: number; // es. 8.0
  description: string | null;
  created_at: string;
  // Join opzionale
  subject?: Subject;
};
