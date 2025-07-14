-- ========== MVP SCHEMA UPDATES ==========

-- Add theme column to users table
alter table public.users add column theme text check (theme in ('light', 'dark')) default 'light';

-- Create save_passes table for Pro feature
create table public.save_passes (
  user_id uuid references public.users(id) on delete cascade primary key,
  passes_left integer default 0 check (passes_left >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on save_passes
alter table public.save_passes enable row level security;

-- RLS Policies for save_passes table
create policy "Users can view own save passes" on public.save_passes
  for select using (auth.uid() = user_id);

create policy "Users can update own save passes" on public.save_passes
  for update using (auth.uid() = user_id);

create policy "Users can insert own save passes" on public.save_passes
  for insert with check (auth.uid() = user_id);

-- Service role can manage save passes (for Stripe webhooks)
create policy "Service role can manage save passes" on public.save_passes
  for all using (current_setting('role') = 'service_role');

-- Function to handle Pro user upgrade
create or replace function public.handle_pro_upgrade(user_id_param uuid, passes_to_add integer)
returns void as $$
begin
  -- Update user to Pro status
  update public.users 
  set is_pro = true, updated_at = timezone('utc'::text, now())
  where id = user_id_param;
  
  -- Add save passes (upsert)
  insert into public.save_passes (user_id, passes_left)
  values (user_id_param, passes_to_add)
  on conflict (user_id) 
  do update set 
    passes_left = public.save_passes.passes_left + passes_to_add,
    updated_at = timezone('utc'::text, now());
end;
$$ language plpgsql security definer;

-- Function to consume a save pass
create or replace function public.consume_save_pass(user_id_param uuid)
returns boolean as $$
declare
  passes_available integer;
begin
  -- Check if user has passes available
  select passes_left into passes_available
  from public.save_passes
  where user_id = user_id_param;
  
  if passes_available is null or passes_available <= 0 then
    return false;
  end if;
  
  -- Consume one pass
  update public.save_passes
  set passes_left = passes_left - 1,
      updated_at = timezone('utc'::text, now())
  where user_id = user_id_param;
  
  return true;
end;
$$ language plpgsql security definer;

-- Function to update streak with save pass logic
create or replace function public.update_streak_with_save_pass(user_id_param uuid, session_date_param date)
returns json as $$
declare
  user_streak record;
  days_since_last integer;
  save_pass_used boolean := false;
  result json;
begin
  -- Get current streak data
  select * into user_streak
  from public.streaks
  where user_id = user_id_param;
  
  if user_streak is null then
    -- Create initial streak record
    insert into public.streaks (user_id, current_streak, longest_streak, last_session_date, total_sessions)
    values (user_id_param, 1, 1, session_date_param, 1);
    
    result := json_build_object(
      'current_streak', 1,
      'longest_streak', 1,
      'save_pass_used', false,
      'total_sessions', 1
    );
    return result;
  end if;
  
  -- Calculate days since last session
  if user_streak.last_session_date is null then
    days_since_last := 0;
  else
    days_since_last := session_date_param - user_streak.last_session_date;
  end if;
  
  -- Check if we need to use a save pass or reset streak
  if days_since_last > 1 then
    -- Try to use save pass to preserve streak
    select public.consume_save_pass(user_id_param) into save_pass_used;
    
    if not save_pass_used then
      -- Reset streak
      update public.streaks
      set current_streak = 1,
          last_session_date = session_date_param,
          total_sessions = total_sessions + 1,
          updated_at = timezone('utc'::text, now())
      where user_id = user_id_param;
      
      result := json_build_object(
        'current_streak', 1,
        'longest_streak', user_streak.longest_streak,
        'save_pass_used', false,
        'total_sessions', user_streak.total_sessions + 1
      );
      return result;
    end if;
  end if;
  
  -- Continue or increment streak
  update public.streaks
  set current_streak = case 
    when days_since_last = 0 then current_streak -- same day, don't increment
    else current_streak + 1 -- increment streak
  end,
  longest_streak = case
    when (case when days_since_last = 0 then current_streak else current_streak + 1 end) > longest_streak 
    then (case when days_since_last = 0 then current_streak else current_streak + 1 end)
    else longest_streak
  end,
  last_session_date = session_date_param,
  total_sessions = total_sessions + 1,
  updated_at = timezone('utc'::text, now())
  where user_id = user_id_param;
  
  -- Get updated values
  select * into user_streak from public.streaks where user_id = user_id_param;
  
  result := json_build_object(
    'current_streak', user_streak.current_streak,
    'longest_streak', user_streak.longest_streak,
    'save_pass_used', save_pass_used,
    'total_sessions', user_streak.total_sessions
  );
  
  return result;
end;
$$ language plpgsql security definer;

-- Add trigger for updated_at on save_passes
create trigger handle_save_passes_updated_at before update on public.save_passes
  for each row execute procedure public.handle_updated_at();

-- Index for save_passes
create index save_passes_user_id_idx on public.save_passes(user_id);