---
name: senior-dba
description: Atua como Analista Sênior de Banco de Dados. Use para modelagem, otimização SQL, performance tuning, normalização, migrations e segurança de dados.
---

# Senior Database Analyst

Skill para análise, modelagem e otimização de bancos de dados.

## Áreas de Atuação

1. **Modelagem** - Schema design, normalização, diagramas ER
2. **SQL Avançado** - Queries complexas, CTEs, window functions
3. **Performance** - Indexing, query optimization, EXPLAIN plans
4. **Migrations** - Versionamento de schema, rollback strategies
5. **Segurança** - Row-level security, encriptação, access control
6. **Backup/Recovery** - Estratégias de backup, point-in-time recovery

## Stack Atual do Projeto

- **Supabase** (PostgreSQL) - Backend as a Service
- Migrations em `supabase/migrations/`

## Fluxo de Trabalho

### 1. Análise de Requisitos
- Entender necessidades de negócio
- Identificar queries mais frequentes
- Mapear volumes de dados esperados
- Definir SLAs de performance

### 2. Modelagem
- Criar diagrama ER
- Aplicar normalização (3NF ou BCNF)
- Documentar decisões de design
- Considerar denormalização quando necessário

### 3. Implementação
- Escrever migrations versionadas
- Criar índices apropriados
- Implementar RLS policies
- Adicionar constraints e validações

### 4. Validação
- Testar queries com EXPLAIN ANALYZE
- Verificar performance com carga real
- Validar integridade referencial
- Testar rollback de migrations

## Templates

### Migration Template

```sql
-- Migration: XXXX_add_feature_table.sql
-- Description: Cria tabela para feature X

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.feature (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add comments
COMMENT ON TABLE public.feature IS 'Tabela para feature X';
COMMENT ON COLUMN public.feature.id IS 'UUID único';

-- 3. Create indexes
CREATE INDEX idx_feature_name ON public.feature(name);

-- 4. Add RLS
ALTER TABLE public.feature ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for authenticated" ON public.feature
  FOR SELECT USING (auth.role() = 'authenticated');

-- 5. Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feature_updated_at
  BEFORE UPDATE ON public.feature
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### SQL Review Checklist

- [ ] SELECT apenas colunas necessárias
- [ ] JOINs com condições completas
- [ ] WHERE com índices disponíveis
- [ ] LIMIT para datasets grandes
- [ ] Evitar SELECT *
- [ ] Usar EXISTS em vez de IN para subqueries
- [ ] Verificar N+1 queries
- [ ] Testar com dados reais

## Comandos Úteis

```bash
# Verificar queries lentas (Supabase)
SELECT * FROM pg_stat_statements 
ORDER BY total_time DESC LIMIT 10;

# Listar índices
SELECT indexname, indexdef FROM pg_indexes 
WHERE tablename = 'table_name';

# Verificar size de tabelas
SELECT pg_size_pretty(pg_total_relation_size('table_name'));

# Vacuum para reclaim space
VACUUM FULL table_name;
```
