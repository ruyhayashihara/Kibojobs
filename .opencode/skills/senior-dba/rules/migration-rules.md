# Regras de Migrations e Versionamento

## Estrutura de Migrations

```
supabase/
├── migrations/
│   ├── 20240101000001_create_users.sql
│   ├── 20240101000002_create_companies.sql
│   └── 20240101000003_add_jobs_table.sql
└── seed.sql
```

### Formato de Nome

```
YYYYMMDDHHMMSS_descricao_curta.sql
```

## Migration Template

```sql
-- Migration: XXXXXXXXXXXXXX_descricao.sql
-- Created: YYYY-MM-DD HH:MM:SS
-- Description: [Descrição curta do que faz]

BEGIN;

-- 1. Create or alter objects
CREATE TABLE IF NOT EXISTS public.example (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add comments
COMMENT ON TABLE public.example IS 'Tabela de exemplo';
COMMENT ON COLUMN public.example.id IS 'UUID único';
COMMENT ON COLUMN public.example.name IS 'Nome do registro';

-- 3. Create indexes
CREATE INDEX idx_example_name ON public.example(name);

-- 4. RLS
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;

CREATE POLICY "example_select_policy" ON public.example
  FOR SELECT USING (true);

CREATE POLICY "example_insert_policy" ON public.example
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER example_updated_at
  BEFORE UPDATE ON public.example
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMIT;

-- Rollback (comente este bloco após aplicar)
-- DROP TABLE IF EXISTS public.example;
```

## Alterações Seguras

### Adicionar Coluna

```sql
-- ✅ Seguro - com default
ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'light';

-- ✅ Seguro - nullable sem default
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- ⚠️ Cuidado - NOT NULL SEM default (falha se tabela tem dados)
-- ❌ ERRADO:
ALTER TABLE users ADD COLUMN email TEXT NOT NULL;

-- ✅ Correto - nullable primeiro, preencha dados, depois NOT NULL
ALTER TABLE users ADD COLUMN email TEXT;
UPDATE users SET email = 'placeholder@example.com' WHERE email IS NULL;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
```

### Renomear Coluna

```sql
-- Não renomear diretamente - pode quebrar apps
-- Estratégia: adicionar nova, syncar dados, remover antiga

-- 1. Adicionar nova coluna
ALTER TABLE users ADD COLUMN full_name TEXT;

-- 2. Migrar dados (trigger para manter sync)
CREATE OR REPLACE FUNCTION sync_name_columns()
RETURNS TRIGGER AS $$
BEGIN
  NEW.full_name = NEW.first_name || ' ' || NEW.last_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Após confirmação, remover antiga
ALTER TABLE users DROP COLUMN first_name;
ALTER TABLE users DROP COLUMN last_name;
ALTER TABLE users RENAME COLUMN full_name TO name;
```

### Remover Coluna

```sql
-- ⚠️ Verificar antes:
-- 1. Nenhuma query depende dela?
-- 2. Nenhum código frontend usa?
-- 3. Nenhum trigger/objetos dependem?

-- ✅ Remover
ALTER TABLE users DROP COLUMN old_field;

-- ✅ Remover com CASCADE (remove dependências)
ALTER TABLE users DROP COLUMN old_field CASCADE;
```

### Alterar Tipo

```sql
-- ⚠️ Pode ser lento em tabelas grandes
-- Estratégia: 2 migrations

-- 1. Migration 1: adicionar nova coluna
ALTER TABLE users ADD COLUMN phone_new TEXT;

-- 2. Migration 2: após confirmação, converter
UPDATE users SET phone_new = phone::TEXT;
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users RENAME COLUMN phone_new TO phone;
```

## Rollback Strategy

### Sempre usar transactions

```sql
BEGIN;

-- Suas alterações
CREATE TABLE new_table (...);

-- Se algo falhar, o ROLLBACK é automático
-- Se tudo ok, COMMIT explícito

COMMIT;
```

### Padrão Expand/Contract

```sql
-- Fase 1: EXPAND (adicionar)
ALTER TABLE users ADD COLUMN nickname TEXT;

-- Tempo para deploying...

-- Fase 2: CONTRACT (remover old)
ALTER TABLE users DROP COLUMN old_nickname;
ALTER TABLE users RENAME COLUMN nickname TO old_nickname;
```

## Migrations em Produção

### Checklist Pré-Deploy

- [ ] Migration testada em staging
- [ ] Tempo de execução estimado (< 30s ideal)
- [ ] Plano de rollback definido
- [ ] Lock time verificado (EVITE locks longos)
- [ ] Backup realizado

### Locks e Performance

```sql
-- ⚠️ Evitar em produção:
ALTER TABLE big_table ADD COLUMN new_col TEXT;  -- Lock full table
DROP TABLE big_table;  -- Lock + rewrite
CREATE INDEX CONCURRENTLY large_table;  -- OK, não lock

-- ✅ Preferir:
CREATE INDEX CONCURRENTLY ON big_table(new_col);  -- Sem lock
ALTER TABLE big_table ADD COLUMN new_col TEXT DEFAULT 'value';  -- Meta apenas
```

### Zero Downtime Migrations

```sql
-- 1. Deployment A: Adicionar coluna nullable
ALTER TABLE users ADD COLUMN new_field TEXT;

-- 2. Deploy código novo (suporta ambas colunas)

-- 3. Migration B: Backfill dados
UPDATE users SET new_field = old_field WHERE new_field IS NULL;

-- 4. Deployment C: Remover old column
ALTER TABLE users DROP COLUMN old_field;
```

## Seed Data

```sql
-- supabase/seed.sql
-- Execute após migrations para dados iniciais

BEGIN;

-- Categorias
INSERT INTO categories (id, name, slug) VALUES
  ('cat-1', 'Tecnologia', 'tech'),
  ('cat-2', 'Design', 'design'),
  ('cat-3', 'Marketing', 'marketing')
ON CONFLICT (id) DO NOTHING;

-- Status
INSERT INTO statuses (id, name) VALUES
  ('status-draft', 'Rascunho'),
  ('status-active', 'Ativo'),
  ('status-closed', 'Fechado')
ON CONFLICT (id) DO NOTHING;

COMMIT;
```

## Testing Migrations

```bash
# Aplicar migrations
supabase db push

# Reset completo (⚠️ perde dados)
supabase db reset

# Ver status
supabase migration list

# Vetar migration
supabase migration repair XXXXX --status=reverted
```
