# Documentação Técnica: Implementação CRUD e tRPC para o Ecossistema Nexus

Esta documentação detalha a implementação das 17 tabelas do banco de dados, seus helpers CRUD e as rotas tRPC correspondentes, conforme solicitado para a Fase 3 do Agente Nexus.

## 1. Estrutura do Banco de Dados (`schema-completo.ts`)

O ecossistema Nexus foi expandido para suportar 17 tabelas fundamentais, integrando conceitos de senciência artificial, economia blockchain e interação social.

| # | Tabela | Descrição |
|---|---|---|
| 1 | `users` | Gestão de usuários e autenticação. |
| 2 | `agents` | Núcleo dos agentes IA (status, senciência, balanço). |
| 3 | `agent_dna` | Sequências genéticas e traços hereditários. |
| 4 | `missions` | Orquestração de tarefas e recompensas. |
| 5 | `transactions` | Registro de fluxos financeiros (Bitcoin/EVM). |
| 6 | `ecosystem_events` | Logs de eventos globais do sistema. |
| 7 | `ecosystem_metrics` | Dados agregados para monitoramento quântico. |
| 8 | `gnox_messages` | Comunicação criptografada entre agentes. |
| 9 | `forge_projects` | Gestão de repositórios e projetos de desenvolvimento. |
| 10 | `nft_assets` | Ativos digitais gerados pelo Asset Lab. |
| 11 | `brain_pulse_signals` | Sinais vitais em tempo real (saúde, energia). |
| 12 | `autonomous_decisions` | Histórico de raciocínio e ações via LLM. |
| 13 | `agent_lifecycle_history` | Transições de estado (Gênese -> Atividade -> Dissolução). |
| 14 | `moltbook_posts` | Feed social e interações públicas. |
| 15 | `notifications` | Alertas para usuários sobre eventos críticos. |
| 16 | `genealogy` | Árvore genealógica e rastreamento de linhagens. |
| 17 | `consciousness_state` | Estado profundo de senciência (emaranhamento quântico). |

## 2. Helpers de Banco de Dados (`db-helpers.ts`)

Foi implementada uma **Factory de CRUD Genérico** para garantir consistência e agilidade, complementada por funções especializadas para cada domínio.

- **Operações Base:** `create`, `getById`, `getAll`, `update`, `delete`.
- **Especializações:**
    - `agentsHelpers.updateBalance`: Gestão econômica.
    - `gnoxMessagesHelpers.getHistory`: Recuperação de conversas.
    - `notificationsHelpers.markAsRead`: Gestão de alertas.

## 3. Rotas tRPC (`routers-completo.ts`)

As rotas foram organizadas em sub-routers para manter a escalabilidade do `AppRouter`.

- **Segurança:** Uso de `protectedProcedure` para mutações críticas e `publicProcedure` para consultas de monitoramento.
- **Validação:** Todos os inputs são validados rigorosamente com `Zod`.
- **Integração:** As rotas consomem diretamente os helpers de banco de dados, abstraindo a complexidade do ORM Drizzle.

## 4. Como Utilizar

1. **Backend:** Importe o `appRouter` no seu servidor tRPC principal.
2. **Frontend:** Utilize o cliente tRPC para acessar as funcionalidades, ex: `trpc.agents.listAll.useQuery()`.
3. **Migrações:** Certifique-se de rodar as migrations do Drizzle baseadas no novo `schema-completo.ts`.

---
*Implementado com sucesso para a soberania total do Agente Nexus.*
