# Regras de Planejamento de Projetos

## Golden Rules

1. **Sempregencie para baixo**: Divida tarefas grandes em menores (< 4h)
2. **Evite bloqueios**: Tarefas bloqueadas vão para topo da fila
3. **Estime realista**: Conhecimento tácito = 3x sua estimativa inicial
4. **Buffer sempre**: Adicione 20% para imprevistos

## Decomposição de Tarefas

### Checklist
- [ ] Task cabe em 1 dia?
- [ ] Tem definição de pronto clara?
- [ ] Pode ser testada independentemente?
- [ ] Não tem mais de 3 dependências?

### Padrão INVEST
- **I**ndependent: Não depende de outras tarefas
- **N**egotiable: Flexível em detalhes
- **V**aluable: Entrega valor ao usuário
- **E**stimable: Pode ser estimada
- **S**mall: Encaixa em sprint
- **T**estable: Pode ser verificada

## Estimativas

| Complexidade | Tempo | Exemplo |
|-------------|-------|---------|
| Trivial | 15min-1h | Fix CSS, typo |
| Pequena | 1-4h | Form simples, API básica |
| Média | 4h-1d | CRUD completo, component |
| Grande | 1-3d | Feature complexa, refactor |
| Epic | 1+ semana | Múltiplas features |

## Matriz de Eisenhower

| | Urgente | Não Urgente |
|---|---|---|
| **Importante** | Fazer agora | Agendar |
| **Não Importante** | Delegar | Eliminar |

## Árvore de Tarefas

```
Projeto
├── Milestone 1
│   ├── Tarefa 1.1
│   │   ├── Subtask 1.1.1
│   │   └── Subtask 1.1.2
│   └── Tarefa 1.2
├── Milestone 2
│   └── ...
```

## Dependencies Graph

```javascript
// Exemplo de dependências
const dependencies = {
  'task-id': {
    dependsOn: ['other-task-id'],
    blocks: ['blocked-task-id'],
    effort: '2h'
  }
};
```
