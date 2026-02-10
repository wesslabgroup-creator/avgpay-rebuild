-- ADVICE: Run this in Supabase SQL Editor

-- 1. Create a function to check if a user is an admin
-- This is a simple example. You can make it more complex (e.g. check a 'roles' table).
create or replace function public.is_admin()
returns boolean as $$
declare
  is_admin boolean;
begin
  -- Check if the user's email is in the admin list
  -- REPLACE 'bryan@avgpay.com' WITH YOUR ADMIN EMAILS
  select (auth.jwt() ->> 'email') in ('bryan@avgpay.com', 'admin@example.com') into is_admin;
  return is_admin;
end;
$$ language plpgsql security definer;

-- 2. Update RLS policies for user_submissions table

-- Allow admins to view ALL submissions
create policy "Admins can view all submissions"
on public.user_submissions for select
using ( public.is_admin() );

-- Allow admins to update submissions (to verify/reject)
create policy "Admins can update submissions"
on public.user_submissions for update
using ( public.is_admin() );

-- 3. Update Storage Policies for offer-letters bucket

-- Allow admins to select (read) all objects in the bucket
create policy "Admins can read all offer letters"
on storage.objects for select
using ( bucket_id = 'offer-letters' and public.is_admin() );
