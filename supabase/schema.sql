-- SCHEMA for First Client SaaS

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create PROFILES table (extended user info)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  subscription_tier text default 'freemium', -- 'freemium' | 'premium'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies: User can only see and update their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Function to handle new user signup and create a profile automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create LEADS table
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  website text,
  email text,
  status text default 'a_contacter' check (status in ('a_contacter', 'contacte', 'repondu', 'client')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for leads
alter table public.leads enable row level security;

-- Leads Policies: User can only do CRUD operations on their own leads
create policy "Users can view own leads" on leads for select using (auth.uid() = user_id);
create policy "Users can insert own leads" on leads for insert with check (auth.uid() = user_id);
create policy "Users can update own leads" on leads for update using (auth.uid() = user_id);
create policy "Users can delete own leads" on leads for delete using (auth.uid() = user_id);

-- Function to update 'updated_at' automatically
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on public.leads
  for each row execute procedure public.handle_updated_at();
