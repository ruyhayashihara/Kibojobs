# Regras de Execução de Projetos

## Ciclo de Desenvolvimento

### 1. Feature Branch Flow

```
main ──────────────────────► main
        │        ▲
        │        │
        ▼        │
   feature/X ◄───┘
        │
        ▼
      test
```

### 2. Commit Semântico

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem mudança de código)
- `refactor`: Refatoração
- `test`: Adição de testes
- `chore`: Tarefas de manutenção

### 3. Pull Request Checklist

- [ ] Título descritivo (conventional commits)
- [ ] Descrição com contexto e screenshots
- [ ] Tests adicionados/atualizados
- [ ] Lint passando
- [ ] Link para issue/feature
- [ ] Reviewers назначени

## Code Review

### Para Autor
- [ ] Self-review antes de solicitar
- [ ] Commits atômicos
- [ ] Diff < 400 linhas
- [ ] Nenhuma dependência circular
- [ ] Testes incluídos

### Para Reviewer
- [ ] Entender o "porquê" antes do "como"
- [ ] Verificar cobertura de testes
- [ ] Buscar edge cases
- [ ] Sugerir, não impor
- [ ] Aprovar com Comentários vs Request Changes

## Testes

### Pirâmide de Testes

```
        ╱╲ E2E
       ╱  ╲
      ╱────╲ Integration
     ╱      ╲
    ╱────────╲ Unit
   ▔▔▔▔▔▔▔▔▔▔▔
```

### Coverage Mínimo

| Tipo | Target |
|------|--------|
| Unit | 80% |
| Integration | 60% |
| E2E | Critical paths |

## Debugging

### Framework

```
Problema
   │
   ▼
Observar
   │
   ▼
Hipótese
   │
   ▼
Teste
   │
   ▼
Análise
   │
   ▼
Solução ✓/✗
```

### Checklist de Bug

- [ ] Reproduzir bug
- [ ] Isolar causa raiz
- [ ] Verificar edge cases
- [ ] Implementar fix
- [ ] Adicionar teste
- [ ] Verificar não-regressão
