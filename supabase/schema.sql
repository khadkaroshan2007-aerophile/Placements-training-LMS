-- PlacePrep AI learning progress. Run this in the Supabase SQL Editor.
create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{"enrolled":[],"progress":{},"results":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learning_progress enable row level security;

drop policy if exists "Students can read their own learning progress" on public.learning_progress;
create policy "Students can read their own learning progress"
  on public.learning_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Students can create their own learning progress" on public.learning_progress;
create policy "Students can create their own learning progress"
  on public.learning_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Students can update their own learning progress" on public.learning_progress;
create policy "Students can update their own learning progress"
  on public.learning_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
