# Regras de Monitoramento de Projetos

## KPIs Principais

### Velocidade
- **Velocity**: Story points por sprint
- **Cycle Time**: Tempo do primeiro commit ao merge
- **Lead Time**: Tempo do request ao production

### Qualidade
- **Defect Rate**: Bugs / Total features
- **Escaped Defects**: Bugs encontrados em prod
- **Code Coverage**: % código coberto por testes

### Saúde do Projeto
- **Blocked Tasks**: Tarefas bloqueadas / Total
- **WIP**: Work in Progress vs capacidade
- **Burndown**: Progresso vs ideal

## Dashboard de Status

### Formato de Report

```markdown
## Status Report - [DATA]

### Progresso
- Concluído: X/Y tarefas
- Progresso: XX%
- No prazo: ✅/⚠️/❌

### Sprint Atual
| Tarefa | Status | Effort |
|--------|--------|--------|
| Task 1 | ✅ Done | 2h |
| Task 2 | 🔄 WIP | 4h |
| Task 3 | ⏳ Todo | 2h |

### Bloqueios
- Block #1: [descrição] - Bloqueado por [responsável]
- Block #2: [descrição] - Ação requerida

### Próximos Passos
1. [ ] Task A
2. [ ] Task B
```

## Alertas

### Status Vermelho (⚠️ Critical)
- Deadline < 2 dias e progresso < 50%
- Blocker há > 3 dias
- Defect rate > 10%

### Status Amarelo (⚠️ Warning)
- Sprint velocity < 70% da média
- WIP > capacidade
- Dependências em risco

### Status Verde (✅ On Track)
- Progresso proporcional ao tempo
- Sem blockers
- Velocity estável

## Gestão de Riscos

### Matriz de Risco

| Probabilidade | Impacto | Prioridade |
|---------------|---------|------------|
| Alta | Alto | Crítico |
| Alta | Baixo | Médio |
| Baixa | Alto | Médio |
| Baixa | Baixo | Baixo |

### Mitigação

1. **Identificar**: Listar riscos potenciais
2. **Avaliar**: Probabilidade × Impacto
3. **Plano B**: Ação de contingência
4. **Monitorar**: Tracking contínuo

## Comunicação

### Daily Standup

```markdown
### Hoje
- [ ] Tarefa atual

### Impedimentos
- Nenhum / [Descrição]

### Amanhã
- [ ] Próxima tarefa
```

### Retrospectiva

```markdown
## Retro - Sprint [N]

### 😊 Funcionou bem
- Ponto 1
- Ponto 2

### 🤔 Pode melhorar
- Ponto 1
- Ponto 2

### 💡 Ação
- [ ] Ação 1
- [ ] Ação 2
```
