-- Seed data for Kibojobs Database
-- This will create a dummy company and job using the first available registered user

DO $$
DECLARE
  v_user_id uuid;
  v_company_id uuid;
BEGIN
  -- 1. Pega o primeiro usuário cadastrado para ser o "dono" da empresa
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado! Crie uma conta no site primeiro antes de rodar este seed.';
  END IF;

  -- 2. Cria a Empresa Fictícia
  INSERT INTO public.companies (user_id, name, slug, logo_url, banner_url, description, website)
  VALUES (
    v_user_id,
    'Kojima Productions Ltd.',
    'kojima-productions-ltd',
    'https://via.placeholder.com/150/064E3B/BEF264?text=KP',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070',
    'Empresa líder em desenvolvimento de jogos e experiências interativas sediada em Shinagawa, Tokyo.',
    'https://kpj.example.com'
  ) RETURNING id INTO v_company_id;

  -- 3. Cria a Vaga Fictícia para essa empresa
  INSERT INTO public.jobs (company_id, title, description, location, job_type, salary_min, salary_max, work_mode, industry, is_featured, is_active)
  VALUES (
    v_company_id,
    'Desenvolvedor Frontend Sênior (React)',
    'Estamos buscando um Engenheiro de Frontend Sênior para liderar a reconstrução das nossas interfaces web usando React, Tailwind e Zustand.

**Responsabilidades:**
- Arquitetar sistemas escaláveis no frontend
- Implementar designs "Pixel-Perfect" baseados no Figma
- Trabalhar diretamente com nosso time criativo em Shinjuku.

**Requisitos:**
- Mínimo de 4 anos com React.JS
- Inglês Fluente e Japonês N3 (Comunicação Diária)
- Conhecimento avançado de UI/UX e Micro-animações.

**Benefícios:**
- Transporte pago (Até ¥30.000/mês)
- Plano de Saúde e Bônus Anual (2x)
- Auxílio Mudança / Visto de Trabalho',
    'Tokyo, Japan',
    'CLT',
    500000,
    800000,
    'hybrid',
    'Tecnologia',
    true,
    true
  );
  
END $$;
