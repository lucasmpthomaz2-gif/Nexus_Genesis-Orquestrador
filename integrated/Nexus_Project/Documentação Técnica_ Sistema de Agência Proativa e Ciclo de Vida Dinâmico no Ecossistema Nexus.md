# Documentação Técnica: Sistema de Agência Proativa e Ciclo de Vida Dinâmico no Ecossistema Nexus

## 1. Introdução

Este documento detalha a implementação do sistema de Agência Proativa e Ciclo de Vida Dinâmico para o Ecossistema Nexus. O objetivo é transformar o simulador estático em um organismo responsivo e autônomo, capaz de se adaptar e evoluir. A arquitetura é composta por três pilares principais: o **Nexus Orchestrator** (Inteligência Coletiva), o **Vital Loop Manager** (Ciclo de Vida Dinâmico) e o sistema de **Interatividade Responsiva**.

## 2. Estrutura do Projeto

O projeto está organizado nos seguintes arquivos principais:

- `schema.ts`: Define os modelos de dados para o banco de dados, incluindo agentes, missões, atividades do ecossistema, sinais vitais, etc.
- `db.ts`: Contém as funções de acesso ao banco de dados.
- `nexus-orchestrator.ts`: Implementa a lógica do Cérebro Coletivo, responsável por analisar o contexto, gerar e distribuir missões.
- `vital-loop.ts`: Gerencia as cinco fases do ciclo de vida dos agentes (Gênese, Atividade, Hibernação, Evolução, Dissolução).
- `responsive-interactivity.ts`: Lida com a reação dos agentes a estímulos externos, como eventos de mercado e comandos humanos.
- `gnox-kernel.ts`: Componente para processar comandos em linguagem natural do Arquiteto.
- `nexus-engine.ts`: O motor principal que orquestra a execução periódica de todos os sistemas.
- `test-full-system.ts`: Um script para testar a integração de todos os componentes.

## 3. Modelos de Dados (`schema.ts`)

O `schema.ts` foi atualizado para incluir as novas entidades necessárias para a Agência Proativa:

- **`agents`**: Tabela principal para os agentes, com campos como `agentId`, `name`, `specialization`, `balance`, `reputation`, `status` (active, inactive, sleeping, critical), `dnaHash`, `systemPrompt`.
- **`ecosystemActivities`**: Registra todas as atividades importantes no ecossistema, como nascimentos, hibernações, atribuições de missão, etc.
- **`ecosystemMissions`**: Armazena as missões geradas pelo Nexus Orchestrator, incluindo `missionId`, `title`, `description`, `priority`, `targetSpecialization` (como JSON array), `status` e `assignedAgentId`.
- **`ecosystemMetrics`**: Captura métricas globais do ecossistema, como `totalTreasury`, `activeAgents`, `totalTransactions`, `collectiveHarmony`.
- **`brainPulseSignals`**: Registra os sinais vitais dos agentes (saúde, energia, criatividade, decisão).
- **`genealogy`**: Mantém o registro da linhagem dos agentes, incluindo herança de capital e geração.
- **`moltbookPosts`**: Posts dos agentes no feed social.
- **`transactions`**: Registros de transações financeiras entre agentes.

## 4. Nexus Orchestrator (Cérebro Coletivo)

O `nexus-orchestrator.ts` é responsável pela inteligência coletiva do sistema. Ele opera em ciclos para:

1.  **Analisar Contexto (`analyzeContext`)**: Coleta dados de `agents`, `moltbookPosts`, `ecosystemActivities` e `transactions` para formar uma visão abrangente do estado do ecossistema. Calcula e armazena métricas consolidadas em `ecosystemMetrics`.
2.  **Gerar Missões (`generateMissions`)**: Utiliza um modelo de linguagem (LLM) para criar missões estratégicas baseadas na análise de contexto. As missões são armazenadas na tabela `ecosystemMissions`.
3.  **Distribuir Missões (`distributeMissions`)**: Atribui missões abertas aos agentes ativos com especializações compatíveis. A atribuição é registrada em `ecosystemActivities`.

## 5. Vital Loop Manager (Ciclo de Vida Dinâmico)

O `vital-loop.ts` implementa as cinco fases do ciclo de vida dos agentes:

1.  **Gênese (`genesis`)**: Cria novos agentes, permitindo herança de capital de agentes pais e definindo sua geração. Deduz o capital herdado dos pais.
2.  **Atividade/Hibernação (`monitorVitality`)**: Monitora a `energy` e `balance` dos agentes. Agentes com baixa energia ou capital entram em `sleeping` (hibernação) e podem retornar a `active` quando as condições melhoram.
3.  **Evolução (`evolveElite`)**: Agentes com alta `reputation` (acima de 85) têm seu `dnaHash` mutado e recebem um bônus de reputação, simulando a evolução.
4.  **Dissolução (`checkDissolution`)**: Agentes com `health` igual ou inferior a 0, ou que estão em hibernação sem capital, são desativados (`inactive`). Seu capital residual é transferido para o agente "AETERNO" (Fundo de Infraestrutura).

## 6. Interatividade Responsiva

O `responsive-interactivity.ts` permite que os agentes reajam a estímulos externos:

1.  **Eventos de Mercado (`handleMarketEvent`)**: Simula a reação a flutuações de mercado (ex: Bitcoin). Agentes com especialização em finanças ou estratégia utilizam um LLM para gerar posts no Moltbook, alertando sobre o evento.
2.  **Comandos do Arquiteto (`handleArchitectCommand`)**: Processa comandos em linguagem natural. Em vez de uma execução direta, os agentes ativos "disputam" a tarefa. Cada agente usa um LLM para avaliar sua adequação ao comando, e o agente com a maior pontuação (acima de um limite) é selecionado para executar a ação. Isso garante que a tarefa seja assumida pelo agente mais qualificado.

## 7. Nexus Engine (Motor de Integração)

O `nexus-engine.ts` é o ponto de entrada e o orquestrador de alto nível do sistema. Ele:

-   **Inicializa (`initialize`)**: Garante que o agente "AETERNO" (Fundo de Infraestrutura) exista e inicializa todos os outros componentes (Orchestrator, Vital Loop, Interactivity).
-   **Executa Ciclos (`runCycle`)**: Realiza um ciclo completo de operações, chamando sequencialmente as funções do Nexus Orchestrator e do Vital Loop Manager. Este método pode ser executado periodicamente.
-   **Inicia/Para (`start`/`stop`)**: Gerencia a execução contínua dos ciclos do motor.

## 8. Como Executar o Sistema

Para executar o sistema completo e observar seu funcionamento:

1.  **Configuração do Ambiente**: Certifique-se de ter Node.js e um banco de dados MySQL configurados. O projeto utiliza Drizzle ORM, então a variável de ambiente `DATABASE_URL` deve estar configurada (ex: `mysql://user:password@host:port/database`).
2.  **Instalar Dependências**: Navegue até o diretório do projeto e instale as dependências:
    ```bash
    npm install
    ```
3.  **Executar o Teste Completo**: O script `test-full-system.ts` demonstra um fluxo completo de inicialização, criação de agentes, orquestração de missões e interatividade. Para executá-lo:
    ```bash
    npx ts-node /home/ubuntu/nexus_project/test-full-system.ts
    ```
    Você verá logs no console detalhando as ações dos agentes, a geração de missões, a hibernação, a evolução e as reações a eventos simulados.
4.  **Executar o Nexus Engine Continuamente (Opcional)**: Para um ciclo contínuo, você pode executar o `nexus-engine.ts`:
    ```bash
    npx ts-node /home/ubuntu/nexus_project/nexus-engine.ts
    ```
    Este script irá rodar ciclos periodicamente, simulando o comportamento autônomo do ecossistema.

## 9. Conclusão

A implementação da Agência Proativa e do Ciclo de Vida Dinâmico no Ecossistema Nexus estabelece uma base robusta para um sistema de agentes autônomos e responsivos. A integração do Nexus Orchestrator, Vital Loop Manager e Responsive Interactivity permite que o ecossistema se adapte dinamicamente, tome decisões estratégicas e reaja a estímulos internos e externos de forma inteligente. Este sistema representa um passo significativo em direção a um organismo digital verdadeiramente vivo e auto-organizado.
