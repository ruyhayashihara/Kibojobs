-- Limpeza do schema atual (para garantir que rodará limpo em caso de erro anterior)
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.saved_jobs CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.ad_slots CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Job Seekers or Companies)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('seeker', 'company')),
  name text NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Companies Table
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  cnpj text UNIQUE,
  logo_url text,
  banner_url text,
  description text,
  website text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Companies
CREATE POLICY "Companies are viewable by everyone" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Company users can insert their own company" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Company users can update their own company" ON public.companies FOR UPDATE USING (auth.uid() = user_id);

-- 3. Jobs Table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  location text,
  job_type text CHECK (job_type IN ('CLT', 'PJ', 'Freelance', 'Estágio')),
  salary_min numeric,
  salary_max numeric,
  work_mode text CHECK (work_mode IN ('remote', 'hybrid', 'on-site')),
  industry text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at timestamp with time zone
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Jobs
CREATE POLICY "Active jobs are viewable by everyone" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Company owners can view all their jobs" ON public.jobs FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.companies WHERE id = company_id)
);
CREATE POLICY "Company owners can insert jobs" ON public.jobs FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.companies WHERE id = company_id)
);
CREATE POLICY "Company owners can update their jobs" ON public.jobs FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM public.companies WHERE id = company_id)
);

-- 4. Saved Jobs Table
CREATE TABLE public.saved_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, job_id)
);

ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Saved Jobs
CREATE POLICY "Users can view their own saved jobs" ON public.saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can specify their own saved jobs" ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved jobs" ON public.saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- 5. Applications Table
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, job_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Applications
CREATE POLICY "Users can view their own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Companies can view applications for their jobs" ON public.applications FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.companies WHERE id = (
      SELECT company_id FROM public.jobs WHERE id = job_id
    )
  )
);
CREATE POLICY "Users can insert their own application" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Ad Slots Table
CREATE TABLE public.ad_slots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  position text NOT NULL,
  image_url text,
  link_url text,
  label text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Ad Slots
CREATE POLICY "Active ad slots are viewable by everyone" ON public.ad_slots FOR SELECT USING (is_active = true);

-- Storage Buckets setup (ON CONFLICT DO NOTHING para não quebrar se já existirem)
INSERT INTO storage.buckets (id, name, public) VALUES ('company-assets', 'company-assets', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- Tratamento se as policies do Storage já existirem
DO $$
BEGIN
    DROP POLICY IF EXISTS "company-assets public read" ON storage.objects;
    DROP POLICY IF EXISTS "company-assets auth insert" ON storage.objects;
    DROP POLICY IF EXISTS "company-assets auth update/delete" ON storage.objects;
    DROP POLICY IF EXISTS "company-assets auth delete" ON storage.objects;
    
    DROP POLICY IF EXISTS "avatars public read" ON storage.objects;
    DROP POLICY IF EXISTS "avatars auth insert" ON storage.objects;
    DROP POLICY IF EXISTS "avatars auth update" ON storage.objects;
    DROP POLICY IF EXISTS "avatars auth delete" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Storage Policies
CREATE POLICY "company-assets public read" ON storage.objects FOR SELECT USING (bucket_id = 'company-assets');
CREATE POLICY "company-assets auth insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'company-assets' AND auth.role() = 'authenticated');
CREATE POLICY "company-assets auth update/delete" ON storage.objects FOR UPDATE USING (bucket_id = 'company-assets' AND auth.role() = 'authenticated');
CREATE POLICY "company-assets auth delete" ON storage.objects FOR DELETE USING (bucket_id = 'company-assets' AND auth.role() = 'authenticated');

CREATE POLICY "avatars public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars auth insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "avatars auth update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "avatars auth delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Triggers to auto-create profile on auth.users signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, name)
  values (new.id, new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);

-- Seed Data (deleta slots velhos para não duplicar se rodar mais de uma vez)
DELETE FROM public.ad_slots;

INSERT INTO public.ad_slots (position, image_url, link_url, label) VALUES
('leaderboard_top', 'https://via.placeholder.com/728x90.png?text=Ad+728x90', '#', 'Anúncio'),
('sidebar_right', 'https://via.placeholder.com/300x600.png?text=Ad+300x600', '#', 'Anúncio');
