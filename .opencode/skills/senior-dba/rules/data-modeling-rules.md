# Regras de Modelagem de Dados

## Normalização

### Formas Normais

| Forma | Regra | Quando Aplicar |
|-------|-------|----------------|
| 1NF | Atomicidade, sem valores repetidos | Sempre (obrigatório) |
| 2NF | 1NF + sem dependências parciais | Quando há chave composta |
| 3NF | 2NF + sem dependências transitivas | Sempre (recomendado) |
| BCNF | 3NF + para toda FD, X deve ser superkey | Quando há redundância |
| 4NF | BCNF + sem dependências multivaloradas | Dados multivalorados |

### Checklist de Normalização

- [ ] Cada tabela tem PK única
- [ ] Não há valores duplicados entre colunas
- [ ] Colunas atômicas (sem arrays se necessário normalizar)
- [ ] Dependências funcionais completas
- [ ] Sem atributos que dependem de não-PK

## Design Patterns

### Timestamps Universais

```sql
-- Sempre usar timestamptz para consistency
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ -- soft delete

-- Parasoftdelete
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;
CREATE INDEX idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NOT NULL;
```

### Soft Delete Pattern

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  deleted_at TIMESTAMPTZ,
  -- ... outras colunas
);

-- Query padrão com soft delete
CREATE OR REPLACE FUNCTION get_active_products()
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY SELECT * FROM products WHERE deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
```

### Audit Trail

```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para audit
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, action, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), auth.uid());
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### UUID vs Serial

| Aspecto | UUID | Serial |
|---------|------|--------|
| Distribuído | ✅ Sim | ❌ Não |
| Size | 16 bytes | 4 bytes |
| Guessable | ❌ Não | ⚠️ Sim |
| Performance | ⚠️ Index overhead | ✅ Melhor |

**Recomendação**: UUID para dados sensíveis/暴露, Serial para dados internos

## Relationships

### Um para Um (1:1)
```sql
-- Users e profiles (mesma tabela ou FK)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  avatar_url TEXT
);
```

### Um para Muitos (1:N)
```sql
-- Companies e jobs
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  title TEXT NOT NULL
);

CREATE INDEX idx_jobs_company ON jobs(company_id);
```

### Muitos para Muitos (N:M)
```sql
-- Jobs e skills
CREATE TABLE jobs (
  id UUID PRIMARY KEY
);

CREATE TABLE skills (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE job_skills (
  job_id UUID REFERENCES jobs(id),
  skill_id UUID REFERENCES skills(id),
  PRIMARY KEY (job_id, skill_id)
);
```

## Documentação

### Schema Documentation

```sql
COMMENT ON TABLE users IS 'Tabela principal de usuários do sistema';
COMMENT ON COLUMN users.id IS 'UUID único gerado automaticamente';
COMMENT ON COLUMN users.email IS 'Email único do usuário';
COMMENT ON COLUMN users.created_at IS 'Timestamp de criação (UTC)';
```
