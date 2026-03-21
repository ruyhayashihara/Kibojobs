---
name: project-orchestrator
description: Orquestra projetos de software end-to-end. Use para planejar, executar, monitorar e entregar projetos. Gerencia tarefas, dependências, prioridades e timeline.
---

# Project Orchestrator

Skill para orchestrar projetos de software de forma sistemática e eficiente.

## Fluxo de Trabalho

### 1. Inicialização do Projeto
- Definir objetivos e escopo
- Identificar stakeholders
- Estabelecer timeline
- Definir milestones

### 2. Planejamento
- Decompor em tarefas
- Identificar dependências
- Estimar effort
- Priorizar tarefas

### 3. Execução
- Implementar incrementalmente
- Revisar código
- Testar continuamente
- Documentar progresso

### 4. Monitoramento
- Rastrear progresso
- Identificar bloqueios
- Ajustar prioridades
- Reportar status

### 5. Entrega
- Code review final
- Testes de integração
- Deploy
- Handoff/Deploy

## Componentes

### src/store/projectStore.js (Zustand)
```javascript
// Estado do projeto
{
  tasks: [],
  milestones: [],
  blockers: [],
  currentSprint: null,
  progress: 0
}
```

### src/lib/projectUtils.js
- calculateProgress()
- getDependencies()
- prioritizeTasks()
- estimateTimeline()

## Regras de Priorização

1. **Crítico**: Bloqueia outros; priorize primeiro
2. **Alta**: Deadline próximo; implemente agora
3. **Média**: Pode esperar 1-2 dias
4. **Baixa**: Nice-to-have; faça se sobrar tempo

## Definição de Pronto

- [ ] Código implementado
- [ ] Testes escritos e passando
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Deploy em staging/teste

## Templates

### README do Projeto
```markdown
# Nome do Projeto

## Objetivo
[Descreva o objetivo]

## Funcionalidades
- [ ] Feature 1
- [ ] Feature 2

## Roadmap
### Fase 1 - MVP
- [ ] Tarefa 1
- [ ] Tarefa 2

### Fase 2 - V2
- [ ] Tarefa 3
```

### CHANGELOG
```markdown
## [v1.0.0] - YYYY-MM-DD

### Adicionado
- Feature 1

### Alterado
- Componente X

### Corrigido
- Bug Y
```
