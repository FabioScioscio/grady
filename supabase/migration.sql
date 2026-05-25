-- ═══════════════════════════════════════════════════════════
--  GRADY — Migration v1
--  Incolla tutto questo nel SQL Editor di Supabase e clicca
--  "Run" (il triangolo verde in alto a destra).
-- ═══════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────
-- 1. PROFILES
--    Profilo utente, creato automaticamente al signup.
-- ───────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Utente vede solo il proprio profilo"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Utente aggiorna solo il proprio profilo"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger: crea profilo automaticamente ad ogni nuovo signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ───────────────────────────────────────────────────────────
-- 2. SUBJECTS (materie)
-- ───────────────────────────────────────────────────────────
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  color       text not null default '#2A1FBF',
  created_at  timestamptz default now() not null
);

alter table public.subjects enable row level security;

create policy "Utente gestisce le proprie materie"
  on public.subjects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────
-- 3. GRADES (voti)
-- ───────────────────────────────────────────────────────────
create table if not exists public.grades (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  subject_id   uuid not null references public.subjects(id) on delete cascade,
  value        numeric(4,2) not null check (value >= 1 and value <= 10),
  type         text not null default 'scritto'
                 check (type in ('scritto', 'orale', 'pratico')),
  description  text,
  date         date not null default current_date,
  created_at   timestamptz default now() not null
);

alter table public.grades enable row level security;

create policy "Utente gestisce i propri voti"
  on public.grades for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────
-- 4. EVENTS (verifiche, compiti, interrogazioni)
-- ───────────────────────────────────────────────────────────
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  subject_id  uuid references public.subjects(id) on delete set null,
  title       text not null,
  type        text not null default 'verifica'
                check (type in ('verifica', 'compito', 'interrogazione')),
  date        date not null,
  completed   boolean not null default false,
  created_at  timestamptz default now() not null
);

alter table public.events enable row level security;

create policy "Utente gestisce i propri eventi"
  on public.events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────
-- 5. GOALS (obiettivi)
-- ───────────────────────────────────────────────────────────
create table if not exists public.goals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  subject_id      uuid references public.subjects(id) on delete set null,
  target_average  numeric(4,2) not null check (target_average >= 1 and target_average <= 10),
  description     text,
  created_at      timestamptz default now() not null
);

alter table public.goals enable row level security;

create policy "Utente gestisce i propri obiettivi"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────
-- Fine migration — tutto pronto!
-- ───────────────────────────────────────────────────────────
