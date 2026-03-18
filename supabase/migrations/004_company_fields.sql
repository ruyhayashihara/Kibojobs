-- Migration 004: Add company fields specific to Japan
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS corporate_number text, -- 法人番号
ADD COLUMN IF NOT EXISTS legal_structure text,  -- Ex: KK (Kabushiki Kaisha), GK (Godo Kaisha)
ADD COLUMN IF NOT EXISTS representative_name text, -- Representante
ADD COLUMN IF NOT EXISTS established_year integer,
ADD COLUMN IF NOT EXISTS employees_count integer,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text;

-- Replace the trigger to also create the company row automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_company boolean;
  raw_name text;
  slug_name text;
BEGIN
  is_company := new.raw_user_meta_data->>'role' = 'company';
  raw_name := new.raw_user_meta_data->>'name';
  -- Create a basic slug + random 4 chars to ensure uniqueness
  slug_name := lower(regexp_replace(raw_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 4);

  INSERT INTO public.profiles (id, role, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'role', 'seeker'), raw_name);

  IF is_company THEN
    INSERT INTO public.companies (
      user_id, 
      name, 
      slug, 
      corporate_number, 
      legal_structure, 
      representative_name, 
      contact_email
    ) VALUES (
      new.id, 
      raw_name, 
      slug_name,
      new.raw_user_meta_data->>'corporate_number',
      new.raw_user_meta_data->>'legal_structure',
      new.raw_user_meta_data->>'representative_name',
      new.email
    );
  END IF;

  RETURN new;
END;
$$;
