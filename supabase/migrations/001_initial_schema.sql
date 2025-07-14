-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  is_pro boolean default false,
  timezone text default 'UTC',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Streaks table
create table public.streaks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_session_date date,
  total_sessions integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sessions table
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  session_date date not null,
  duration_minutes integer not null default 25,
  session_type text check (session_type in ('work', 'break')) default 'work',
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.streaks enable row level security;
alter table public.sessions enable row level security;

-- RLS Policies for users table
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- RLS Policies for streaks table
create policy "Users can view own streaks" on public.streaks
  for select using (auth.uid() = user_id);

create policy "Users can update own streaks" on public.streaks
  for update using (auth.uid() = user_id);

create policy "Users can insert own streaks" on public.streaks
  for insert with check (auth.uid() = user_id);

-- RLS Policies for sessions table
create policy "Users can view own sessions" on public.sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on public.sessions
  for insert with check (auth.uid() = user_id);

-- Indexes for performance
create index sessions_user_id_date_idx on public.sessions(user_id, session_date desc);
create index streaks_user_id_idx on public.streaks(user_id);

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.streaks (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_users_updated_at before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger handle_streaks_updated_at before update on public.streaks
  for each row execute procedure public.handle_updated_at();