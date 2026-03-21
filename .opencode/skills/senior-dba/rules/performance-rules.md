# Regras de Performance e Otimização

## Indexação

### Quando Criar Índices

- [ ] Coluna usada em WHERE
- [ ] Coluna usada em JOIN
- [ ] Coluna usada em ORDER BY
- [ ] Coluna com alta cardinalidade (> 100 valores únicos)
- [ ] Coluna em FOREIGN KEY

### Quando NÃO Criar Índices

- [ ] Tabelas pequenas (< 1000 rows)
- [ ] Colunas com baixa cardinalidade (booleans, status)
- [ ] Colunas frequentemente atualizadas
- [ ] Colunas apenas em SELECT sem WHERE

### Tipos de Índice

| Tipo | Uso | Exemplo |
|------|-----|---------|
| B-Tree | Equality, range | `=`, `<`, `>`, `BETWEEN` |
| Hash | Exact match | `=` |
| GIN | JSON, arrays, full-text | `jsonb_path_ops`, `gin_trgm_ops` |
| GiST | Geospatial, range | PostGIS, tsrange |
| BRIN | Tabelas enormes sequenciais | Logs, timestamps |

### Exemplos

```sql
-- B-Tree simples
CREATE INDEX idx_jobs_title ON jobs(title);

-- Composite (ordem importa!)
CREATE INDEX idx_jobs_company_status ON jobs(company_id, status);

-- Partial (apenas linhas ativas)
CREATE INDEX idx_active_jobs ON jobs(created_at) 
WHERE status = 'active';

-- GIN para JSONB
CREATE INDEX idx_users_metadata ON users USING GIN(metadata jsonb_path_ops);

-- Covering (inclui colunas do SELECT)
CREATE INDEX idx_jobs_covering ON jobs(company_id) 
INCLUDE (title, status, created_at);

-- Expressão
CREATE INDEX idx_jobs_lower_title ON jobs(LOWER(title));
```

## Query Optimization

### Checklist de Query

- [ ] Evitar SELECT * - especifique colunas
- [ ] Usar LIMIT para paginação
- [ ] Evitar funções no WHERE (impede índice)
- [ ] Usar UNION ALL se não há duplicatas
- [ ] Evitar LIKE com leading wildcard
- [ ] Preferir UNION sobre OR
- [ ] Usar EXISTS sobre IN para subqueries
- [ ] Evitar DISTINCT ON sem necessidade

### Exemplos Otimizados

```sql
-- ❌ Ruim
SELECT * FROM jobs WHERE LOWER(title) = 'developer';

-- ✅ Bom - usar índice funcional
CREATE INDEX idx_jobs_title_lower ON jobs(LOWER(title));
SELECT * FROM jobs WHERE LOWER(title) = 'developer';

-- ❌ Ruim - N+1
SELECT * FROM jobs;
-- depois loop: SELECT * FROM companies WHERE id = ?

-- ✅ Bom - JOIN
SELECT j.*, c.name as company_name 
FROM jobs j
JOIN companies c ON c.id = j.company_id;

-- ❌ Ruim - IN com subquery
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);

-- ✅ Bom - EXISTS
SELECT * FROM users u WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- ❌ Ruim - paginação lenta
SELECT * FROM jobs ORDER BY created_at OFFSET 10000 LIMIT 20;

-- ✅ Bom - keyset pagination
SELECT * FROM jobs 
WHERE created_at < :last_cursor
ORDER BY created_at DESC LIMIT 20;
```

## EXPLAIN ANALYZE

```sql
-- Sempre verificar plano de execução
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT j.*, c.name
FROM jobs j
JOIN companies c ON c.id = j.company_id
WHERE j.status = 'active';

-- Verificar seq scan (pode indicar falta de índice)
-- Seq Scan = ruim para tabelas grandes
-- Index Scan = bom
-- Bitmap Heap Scan = bom para múltiplos índices
```

### Sinais de Problema

| Finding | Indica | Solução |
|---------|--------|---------|
| Seq Scan on large table | Falta índice | Adicionar índice |
| Nested Loop | Dados não indexados | Adicionar índices, rewritear |
| Hash Join | Tabelas grandes | Considerar hints, indexes |
| Sort | Sem índice ordenado | Adicionar índice ou LIMIT |
| Filter | Função no WHERE | Reescrever sem função |

## Caching

### Estratégias

1. **Query caching** - Supabase handle caching
2. **Application cache** - Redis para dados frequentes
3. **CDN** - Assets estáticos
4. **Edge functions** - Lógica no edge

```sql
-- Materialized view para queries complexas
CREATE MATERIALIZED VIEW jobs_stats AS
SELECT 
  company_id,
  COUNT(*) as job_count,
  AVG(salary) as avg_salary
FROM jobs
WHERE status = 'active'
GROUP BY company_id;

-- Refresh periódico
REFRESH MATERIALIZED VIEW CONCURRENTLY jobs_stats;
```

## Denormalização

### Quando Denormalizar

- [ ] Query muito complexa (5+ JOINs)
- [ ] Leitura >> Escrita (90/10)
- [ ] Agregações frequentes
- [ ] Performance crítica

### Trade-offs

| Normalizado | Denormalizado |
|-------------|---------------|
| ✅ Menos espaço | ⚠️ Mais espaço |
| ✅ Consistência | ⚠️ Possível redundância |
| ⚠️ Mais JOINs | ✅ Menos JOINs |
| ⚠️ Aggregation complexa | ✅ Aggregation simples |

### Exemplo

```sql
-- ❌ Normalizado - 3 JOINs para listar jobs
SELECT j.title, c.name, s.name as status
FROM jobs j
JOIN companies c ON c.id = j.company_id
JOIN statuses s ON s.id = j.status_id;

-- ✅ Denormalizado - stored computed columns
ALTER TABLE jobs ADD COLUMN company_name TEXT;
ALTER TABLE jobs ADD COLUMN status_name TEXT;

-- Trigger para manter sincronizado
CREATE OR REPLACE FUNCTION sync_job_denormalized()
RETURNS TRIGGER AS $$
BEGIN
  SELECT name INTO NEW.company_name FROM companies WHERE id = NEW.company_id;
  SELECT name INTO NEW.status_name FROM statuses WHERE id = NEW.status_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
