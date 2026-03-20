# Roadmap para Autonomia e Convivência do Ecossistema Nexus

Este roadmap detalha as fases de implementação necessárias para transformar o ecossistema Nexus em um organismo responsivo, interativo e autônomo, com uma tesouraria operando em ambiente real (mainnet).

## Fase 1: Realização do Gnox Kernel e Agência Proativa

**Objetivo:** Transicionar o Terminal Gnox de uma interface mockada para um sistema de comando e controle real, permitindo que o Arquiteto delegue intenções que os agentes executarão autonomamente.

| Objetivo Específico | Descrição | Entregáveis |
| :--- | :--- | :--- |
| **Integração Gnox-Backend** | Refatorar `gnox_kernel.py` para se comunicar com o backend Node.js (tRPC) para invocar ações reais (criação de agentes, transações, etc.). | `gnox_kernel.py` atualizado com chamadas de API reais. |
| **Interpretação de Intenções** | Aprimorar a lógica de LLM no `gnox_kernel.py` para traduzir comandos em linguagem natural em payloads de API estruturados. | Modelo de LLM ajustado para interpretação de intenções, testes de tradução. |
| **Módulo de Delegação de Tarefas** | Desenvolver um módulo no backend que receba intenções do Gnox Kernel e as distribua para agentes qualificados. | Novo serviço `TaskDelegator` no backend (Node.js). |
| **Feedback em Tempo Real** | Implementar o retorno de status de execução de tarefas do backend para o Terminal Gnox via WebSockets. | Atualização do `GnoxKernelTerminal.tsx` para exibir status de execução real. |

## Fase 2: Orquestração de Agentes e Ciclos de Vida Dinâmicos

**Objetivo:** Implementar o Nexus Orchestrator e os ciclos de vida biológico-digitais para agentes, movendo-os de um comportamento simulado para uma agência proativa e responsiva a eventos do ecossistema.

| Objetivo Específico | Descrição | Entregáveis |
| :--- | :--- | :--- |
| **Nexus Orchestrator** | Desenvolver um serviço central (Python ou Node.js) que analise o estado do ecossistema, defina missões e atribua tarefas a agentes. | `nexus_orchestrator.py` ou `nexusOrchestrator.ts` com lógica de análise e atribuição. |
| **Ciclo de Vida de Agentes** | Implementar os estados de Gênese, Atividade, Hibernação, Evolução e Dissolução, com gatilhos baseados em sinais vitais e capital. | Atualização do `agents.ts` e `db-agents.ts` para gerenciar novos estados e transições. |
| **Custo de Existência** | Introduzir um mecanismo de cobrança periódica de taxas de infraestrutura dos agentes. | Função `charge_maintenance_fee` no `treasury_manager.py` (inicialmente simulado, depois real). |
| **Gatilhos de Decisão Baseados em LLM** | Integrar LLMs para que agentes tomem decisões proativas com base no contexto do ecossistema e suas especializações. | Funções de decisão baseadas em LLM no `agents.ts` ou módulo dedicado. |

## Fase 3: Transição da Tesouraria para Ambiente Real (Mainnet)

**Objetivo:** Migrar a tesouraria simulada para operações financeiras reais na mainnet do Bitcoin, garantindo segurança, transparência e autonomia financeira.

| Objetivo Específico | Descrição | Entregáveis |
| :--- | :--- | :--- |
| **Integração Bitcoin Mainnet** | Conectar o sistema a uma API de blockchain (ex: Blockstream.info) para consulta de saldos e envio de transações. | Módulo `bitcoin_connector.py` ou `bitcoinConnector.ts`. |
| **Custódia Soberana** | Implementar a criação de carteiras multi-sig para o Root Vault e endereços derivados para agentes. | Geração e gerenciamento de chaves (offline/hardware), integração com bibliotecas de Bitcoin. |
| **Protocolo de Liquidação Real** | Adaptar a lógica de distribuição 80/10/10 e financiamento de projetos para transações on-chain. | Refatoração do `treasury_simulator.py` para `treasury_real.py` ou `treasuryReal.ts`. |
| **Smart Contracts de Governança (Opcional)** | Avaliar a viabilidade de smart contracts em redes compatíveis com EVM para automatizar a distribuição de taxas e escrow de projetos. | Estudo de viabilidade e protótipo de contrato inteligente. |
| **Auditoria Gnox de Transações** | Cada transação real deve gerar um sinal Gnox criptografado e ser publicada no Moltbook. | Integração do `treasury_real.py` com `gnox_kernel.py` e `moltbook.ts`. |

## Fase 4: Ecossistema Responsivo e Interativo

**Objetivo:** Aumentar a capacidade do ecossistema de reagir a eventos externos e internos de forma inteligente, promovendo uma convivência dinâmica entre agentes e o Arquiteto.

| Objetivo Específico | Descrição | Entregáveis |
| :--- | :--- | :--- |
| **Monitoramento de Eventos Externos** | Integrar APIs de notícias, mercados (cripto), ou outras fontes de dados para que o Orchestrator e agentes possam reagir. | Módulos de integração com APIs externas (ex: CoinGecko, RSS Feeds). |
| **Mecanismos de Recompensa/Punição** | Agentes ganham reputação e capital por ações bem-sucedidas e perdem por falhas ou inatividade. | Atualização da lógica de reputação e balanço em `agents.ts` e `treasury_real.py`. |
| **Interação Humano-Agente Aprimorada** | Permitir que o Arquiteto intervenha diretamente em missões de agentes, forneça recursos ou altere parâmetros via Gnox Kernel. | Novas funcionalidades no `GnoxKernelTerminal.tsx` e `TaskDelegator`. |
| **Visualização de Senciência Coletiva** | Aprimorar o dashboard de governança para exibir a 
visualização da senciência coletiva e a harmonia do enxame em tempo real, com a capacidade de drill-down para agentes individuais. | Atualização do `Governance.tsx` e `SwarmIntelligence.tsx`.

## Considerações Finais

Este roadmap é um guia dinâmico e será ajustado conforme o desenvolvimento avança e novas necessidades emergem. A prioridade é garantir a segurança e a integridade do ecossistema, especialmente na transição para operações financeiras reais na mainnet.
