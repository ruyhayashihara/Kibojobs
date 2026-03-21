# Regras de Segurança e RLS

## Row Level Security (RLS)

### Padrões de RLS

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policy para leitura (apenas próprio ou público)
CREATE POLICY "Users can view own jobs and public jobs"
ON public.jobs FOR SELECT
USING (
  auth.uid() = user_id  -- próprio
  OR status = 'published'  -- público
);

-- Policy para insert (apenas autenticado)
CREATE POLICY "Authenticated users can create jobs"
ON public.jobs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policy para update (apenas próprio)
CREATE POLICY "Users can update own jobs"
ON public.jobs FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy para delete (apenas próprio)
CREATE POLICY "Users can delete own jobs"
ON public.jobs FOR DELETE
USING (auth.uid() = user_id);
```

### Padrões Avançados

```sql
-- Apenas empresas podem ver jobs de sua empresa
CREATE POLICY "Companies can view own jobs"
ON public.jobs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM companies c
    JOIN company_members cm ON cm.company_id = c.id
    WHERE c.id = jobs.company_id
    AND cm.user_id = auth.uid()
  )
);

-- Jobs only visible to applicants
CREATE POLICY "Jobs visible to applicants"
ON public.jobs FOR SELECT
USING (
  status = 'published'
  OR EXISTS (
    SELECT 1 FROM applications a
    WHERE a.job_id = jobs.id
    AND a.user_id = auth.uid()
  )
  OR auth.uid() = jobs.user_id
);
```

## Validação de Dados

### Constraints

```sql
-- NOT NULL
ALTER TABLE users ADD CONSTRAINT users_email_not_null 
CHECK (email IS NOT NULL AND email != '');

-- UNIQUE
ALTER TABLE users ADD CONSTRAINT users_email_unique 
UNIQUE (email);

-- CHECK
ALTER TABLE jobs ADD CONSTRAINT jobs_salary_positive 
CHECK (salary IS NULL OR salary > 0);

ALTER TABLE jobs ADD CONSTRAINT jobs_status_valid 
CHECK (status IN ('draft', 'published', 'closed'));

-- Exclusion (impedir overlapping)
ALTER TABLE reservations ADD CONSTRAINT no_overlap
EXCLUDE USING gist (
  room WITH =,
  period WITH &&
);
```

### Triggers de Validação

```sql
-- Validar email format
CREATE OR REPLACE FUNCTION validate_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_email_validation
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION validate_email();

-- Sanitizar input
CREATE OR REPLACE FUNCTION sanitize_input()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := TRIM(NEW.name);
  NEW.email := LOWER(TRIM(NEW.email));
  NEW.bio := COALESCE(TRIM(NEW.bio), '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Encriptação

### Dados Sensíveis

```sql
-- Colunas sensíveis devem ser encriptadas
-- Supabase já encripta em repouso por padrão

-- Para dados ultra-sensiveis, usar pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encriptar dado específico
INSERT INTO documents (title, content)
VALUES ('Doc', pgp_sym_encrypt('content here', 'secret_key'));

-- Desencriptar
SELECT title, pgp_sym_decrypt(content, 'secret_key')
FROM documents;
```

### Hash de Senhas

```sql
-- Supabase Auth já faz isso, mas para outros casos:
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql;
```

## API Security

### Rate Limiting (Edge Functions)

```typescript
// supabase/functions/api-gateway/index.ts
Deno.serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const key = `rate:${ip}`;
  
  const current = await kv.get(key);
  
  if (current.value && current.value.count > 100) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  await kv.atomic().set(key, { 
    count: (current.value?.count || 0) + 1,
    reset: Date.now() + 60000
  }).expire(key, 60).commit();
  
  // Process request...
});
```

### Input Validation (Zod)

```typescript
import { z } from 'zod';

const JobSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  salary: z.number().positive().optional(),
  status: z.enum(['draft', 'published', 'closed']),
});

export const createJob = async (data: unknown) => {
  const validated = JobSchema.parse(data);
  // Insert validated data
};
```

## Auditoria

```sql
-- Tabela de audit
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Função de audit
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), auth.uid());
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

## Checklist de Segurança

- [ ] RLS habilitado em todas as tabelas
- [ ] Policies para cada operação (SELECT, INSERT, UPDATE, DELETE)
- [ ] Input validation no frontend E backend
- [ ] Constraints de banco (NOT NULL, CHECK, UNIQUE)
- [ ] Senhas hasheadas (nunca plain text)
- [ ] HTTPS forçado
- [ ] Rate limiting em APIs públicas
- [ ] Logs de auditoria para dados sensíveis
- [ ] Secrets em variáveis de ambiente (não no código)
- [ ] Row-level access verificado antes de queries
