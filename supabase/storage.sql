-- Enable RLS on objects
-- Create a private bucket for offer letters
insert into storage.buckets (id, name, public)
values ('offer-letters', 'offer-letters', false);

-- Policy: Users can upload their own offer letters
create policy "Users can upload their own offer letters"
on storage.objects for insert
with check ( bucket_id = 'offer-letters' and auth.uid() = owner );

-- Policy: Users can read their own offer letters
create policy "Users can read their own offer letters"
on storage.objects for select
using ( bucket_id = 'offer-letters' and auth.uid() = owner );

-- Policy: Admins can read all offer letters (assuming admin role or specific user)
-- For now, we'll keep it simple. You can add admin policies later.

-- Create table to track submissions if it doesn't exist
create table if not exists public.user_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  file_path text not null,
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on submissions table
alter table public.user_submissions enable row level security;

-- Policy: Users can insert their own submissions
create policy "Enable insert for users based on user_id"
on public.user_submissions for insert
with check ( auth.uid() = user_id );

-- Policy: Users can view their own submissions
create policy "Enable select for users based on user_id"
on public.user_submissions for select
using ( auth.uid() = user_id );
