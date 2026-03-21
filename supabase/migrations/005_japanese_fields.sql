-- Add Japanese-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS family_name text,
ADD COLUMN IF NOT EXISTS given_name text,
ADD COLUMN IF NOT EXISTS family_name_kana text,
ADD COLUMN IF NOT EXISTS given_name_kana text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS prefecture text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS town text,
ADD COLUMN IF NOT EXISTS street text;

-- Add visa requirements to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS visa_types text[],
ADD COLUMN IF NOT EXISTS preferred_n_level text;

-- Update job_type constraint for Japanese contract types
DO $$
BEGIN
  ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_job_type_check;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

ALTER TABLE public.jobs 
ADD CONSTRAINT jobs_job_type_check CHECK (
  job_type IN ('seishain', 'keiyaku', 'arubaito', 'gyomu_itaku', 'intern')
);

-- Update work_mode constraint
DO $$
BEGIN
  ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_work_mode_check;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

ALTER TABLE public.jobs 
ADD CONSTRAINT jobs_work_mode_check CHECK (
  work_mode IN ('onsite', 'hybrid', 'remote')
);

-- Add additional company fields
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS corporate_number text,
ADD COLUMN IF NOT EXISTS prefecture text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS town text,
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS representative_name text,
ADD COLUMN IF NOT EXISTS legal_structure text,
ADD COLUMN IF NOT EXISTS established_year integer,
ADD COLUMN IF NOT EXISTS employees_count text;
