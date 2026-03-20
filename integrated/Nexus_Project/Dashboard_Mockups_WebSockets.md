# Dashboard Nexus: Mockups de Dados e Arquitetura de WebSockets

## 1. Introdução
Esta seção detalha os mockups de dados e a arquitetura de WebSockets para o Dashboard do Nexus, visando aprimorar a visualização em tempo real e a interação com os novos módulos de integração de dados e governança.

## 2. Mockups de Dados para o Dashboard

### 2.1. Visão Geral do Ecossistema
*   **Métricas Chave:**
    *   **Tesouraria Total:** `context.totalTreasury` (do `NexusOrchestrator`)
    *   **Agentes Ativos:** `context.activeAgentsCount` (do `NexusOrchestrator`)
    *   **Harmonia Coletiva:** `context.collectiveHarmony` (do `NexusOrchestrator`)
    *   **Missões Abertas/Atribuídas:** Contagem de `ecosystemMissions` (do `NexusOrchestrator`)
    *   **Preço Bitcoin (Real):** `dataAdapter.getCryptoPrices("bitcoin").current_price`
    *   **Preço Ethereum (Real):** `dataAdapter.getCryptoPrices("ethereum").current_price`
*   **Gráficos de Tendência:**
    *   Evolução da Tesouraria ao longo do tempo.
    *   Variação do número de agentes.
    *   Gráfico de preços de criptomoedas (Bitcoin, Ethereum) ao longo do tempo.
*   **Feed de Atividades Recentes:** Eventos de `ecosystemActivities` (nascimentos, hibernações, atribuições de missão, reações de mercado, **propostas de governança, votos, execuções**).

### 2.2. Nexus Orchestrator
*   **Missões Atuais:** Lista de `ecosystemMissions` com status, prioridade, especialização alvo e agente atribuído. Agora incluirá o contexto de mercado que levou à geração da missão.
*   **Análise de Contexto:** Visualização dos dados que o Orchestrator utiliza, incluindo os **dados de mercado reais** do `data-adapter.ts`.
*   **Histórico de Geração de Missões:** Log das missões geradas pelo LLM, com o prompt e a resposta, e a **referência aos dados de mercado** que influenciaram a decisão.

### 2.3. Vital Loop
*   **Perfil do Agente:** Sinais Vitais (`health`, `energy`, `creativity`), Genealogia, Atividades e Transações. Agora incluirá o **saldo de NEXUS Token** do agente.
*   **DNA Fuser (Interface):** Interface para iniciar a gênese de novos agentes, com a possibilidade de **alocar NEXUS Tokens iniciais**.

### 2.4. Interatividade Responsiva
*   **Eventos de Mercado:** Feed de eventos de mercado detectados (ex: Bitcoin ▲ 5%), com links para posts no Moltbook e **ações de governança relacionadas**.
*   **Gnox Kernel Terminal:** Interface de linha de comando para enviar comandos. Exibirá a interpretação, o resultado da disputa de agentes e **feedback sobre propostas de governança**.

### 2.5. Seção de Governança (Nova)
*   **Propostas Ativas:** Lista de `Proposal` (do `governance.ts`) com título, descrição, proponente, status, votos a favor/contra.
*   **Histórico de Votação:** Log de todos os votos dos agentes nas propostas.
*   **Tesouraria DAO:** Saldo atual da tesouraria multi-assinatura e histórico de alocações de fundos.
*   **Interface de Votação:** Agentes (ou o Arquiteto simulando um agente) podem votar em propostas ativas.

## 3. Arquitetura de WebSockets para Atualizações em Tempo Real

Para garantir que o Dashboard reflita o estado dinâmico do Ecossistema Nexus em tempo real, a arquitetura de WebSockets será expandida.

### 3.1. Eventos de WebSocket
Além dos 8 tipos de eventos existentes (`agent-birth`, `transaction`, `post`, `message`, `project`, `nft`, `health-alert`, `swarm-event`), novos eventos serão adicionados:

*   `market-update`: Notificações de mudanças significativas no mercado (preço, volume) provenientes do `data-adapter.ts`.
*   `governance-proposal`: Nova proposta de governança criada.
*   `governance-vote`: Voto registrado em uma proposta.
*   `governance-execution`: Proposta de governança executada (aprovada ou rejeitada).
*   `agent-token-balance-update`: Atualização do saldo de NEXUS Token de um agente.

### 3.2. Implementação
*   **Servidor WebSocket (Socket.io):** O servidor existente será estendido para emitir os novos tipos de eventos.
*   **Clientes Frontend (React):** Os componentes do Dashboard se inscreverão nos tópicos de WebSocket relevantes para atualizar suas visualizações em tempo real.
*   **Módulos Backend:** `data-adapter.ts` e `governance.ts` emitirão eventos para o servidor WebSocket sempre que houver uma atualização relevante.

## 4. Próximos Passos para Implementação
1.  **Desenvolvimento Frontend:** Implementar os novos componentes e seções do Dashboard, utilizando os mockups de dados como guia.
2.  **Integração Backend:** Conectar o frontend às APIs de backend e aos novos módulos (`data-adapter.ts`, `governance.ts`).
3.  **Expansão do Servidor WebSocket:** Adicionar a lógica para emitir os novos eventos de mercado e governança.
4.  **Testes de Integração:** Garantir que todas as partes do sistema se comuniquem corretamente e que as atualizações em tempo real funcionem conforme o esperado.
