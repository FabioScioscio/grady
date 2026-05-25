-- Aggiunge tipo di scuola al profilo utente
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school_type text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_done boolean DEFAULT false;

-- Aggiunge emoji alle materie
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS emoji text;
