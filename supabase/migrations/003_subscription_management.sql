-- ========== SUBSCRIPTION MANAGEMENT SCHEMA ==========

-- Add subscription tracking columns to users table
alter table public.users 
add column subscription_type text check (subscription_type in ('monthly', 'yearly')) default null,
add column subscription_id text default null,
add column subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'incomplete')) default null,
add column subscription_current_period_end timestamp with time zone default null,
add column subscription_cancel_at timestamp with time zone default null;

-- Update handle_pro_upgrade function to include subscription info
create or replace function public.handle_pro_upgrade(
  user_id_param uuid, 
  passes_to_add integer,
  subscription_type_param text default null,
  subscription_id_param text default null
)
returns void as $$
begin
  -- Update user to Pro status with subscription info
  update public.users 
  set 
    is_pro = true, 
    subscription_type = subscription_type_param,
    subscription_id = subscription_id_param,
    subscription_status = 'active',
    updated_at = timezone('utc'::text, now())
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

-- Function to handle subscription changes (upgrade/downgrade)
create or replace function public.handle_subscription_change(
  user_id_param uuid,
  new_subscription_type text,
  new_subscription_id text,
  passes_to_add integer default 0
)
returns void as $$
begin
  -- Update subscription info
  update public.users 
  set 
    subscription_type = new_subscription_type,
    subscription_id = new_subscription_id,
    subscription_status = 'active',
    updated_at = timezone('utc'::text, now())
  where id = user_id_param;
  
  -- Add save passes if upgrading
  if passes_to_add > 0 then
    insert into public.save_passes (user_id, passes_left)
    values (user_id_param, passes_to_add)
    on conflict (user_id) 
    do update set 
      passes_left = public.save_passes.passes_left + passes_to_add,
      updated_at = timezone('utc'::text, now());
  end if;
end;
$$ language plpgsql security definer;

-- Function to cancel subscription
create or replace function public.handle_subscription_cancellation(
  user_id_param uuid,
  cancel_at_period_end boolean default true
)
returns void as $$
begin
  if cancel_at_period_end then
    -- Mark for cancellation at period end
    update public.users 
    set 
      subscription_status = 'canceled',
      subscription_cancel_at = subscription_current_period_end,
      updated_at = timezone('utc'::text, now())
    where id = user_id_param;
  else
    -- Immediate cancellation
    update public.users 
    set 
      is_pro = false,
      subscription_type = null,
      subscription_id = null,
      subscription_status = null,
      subscription_current_period_end = null,
      subscription_cancel_at = null,
      updated_at = timezone('utc'::text, now())
    where id = user_id_param;
  end if;
end;
$$ language plpgsql security definer;