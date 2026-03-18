-- Add new fields to profiles table for comprehensive candidate information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS best_contact_time text,
ADD COLUMN IF NOT EXISTS visa_type text,
ADD COLUMN IF NOT EXISTS visa_expiry_date date,
ADD COLUMN IF NOT EXISTS japanese_level_communication integer CHECK (japanese_level_communication IN (0, 25, 50, 75, 100)),
ADD COLUMN IF NOT EXISTS japanese_level_hiragana integer CHECK (japanese_level_hiragana IN (0, 25, 50, 75, 100)),
ADD COLUMN IF NOT EXISTS japanese_level_katakana integer CHECK (japanese_level_katakana IN (0, 25, 50, 75, 100)),
ADD COLUMN IF NOT EXISTS japanese_level_kanji integer CHECK (japanese_level_kanji IN (0, 25, 50, 75, 100)),
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS contact_email text;

-- Allow companies to see who saved their jobs
CREATE POLICY "Companies can view saves for their jobs" ON public.saved_jobs FOR SELECT USING (
  job_id IN (SELECT id FROM public.jobs WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()))
);
