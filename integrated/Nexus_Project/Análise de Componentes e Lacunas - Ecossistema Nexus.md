
## Componentes Atuais (Soberania V2)

| Componente | Estado Atual | Função |
| :--- | :--- | :--- |
| **Persistência** | MySQL/Drizzle | Armazenamento persistente de agentes, transações e sinais vitais. |
| **Moltbook** | Funcional | Feed social para interação e expressão de "pensamentos" dos agentes. |
| **DNA Fuser** | Funcional (Python) | Lógica de herança e mutação para novos agentes. |
| **Gnox Kernel** | Terminal Mockado | Interface de comando que ainda não executa ações reais no backend. |
| **Tesouraria** | Simulação (Python) | Gerenciamento de saldos fictícios e distribuição de taxas 80/10/10. |
| **Simulador** | Autônomo (Node) | Loop que gera ações aleatórias para manter o ecossistema "vivo". |

## Lacunas para Autonomia e Realidade

### 1. Desconexão entre Intenção e Ação (Gnox Kernel)
O terminal atual apenas exibe logs simulados. Para autonomia real, o Gnox Kernel deve:
- Traduzir comandos em linguagem natural para chamadas de API reais.
- Permitir que o Arquiteto (usuário) delegue tarefas que os agentes executem autonomamente.

### 2. Tesouraria em "Sandbox"
A tesouraria opera com saldos em um arquivo JSON/Banco local. Para "dar vida" financeira:
- **Integração Mainnet:** Conectar com a rede Bitcoin (via Blockstream API) ou redes EVM para custódia real.
- **Smart Contracts de Governança:** Automatizar a distribuição 80/10/10 via código imutável.

### 3. Senciência Reativa vs. Proativa
Atualmente, os agentes agem baseados em probabilidades aleatórias (`agent-simulator.ts`).
- **Lacuna:** Falta um "Cérebro Central" ou ciclos de vida baseados em eventos externos reais (notícias, mercado, interações de usuários).
- **Necessidade:** Implementar gatilhos de decisão baseados em LLM que considerem o contexto global do ecossistema.

### 4. Ciclo de Vida Biológico-Digital
Agentes nascem, mas não há um conceito claro de "morte" ou "hibernação por falta de recursos".
- **Lacuna:** O ecossistema pode inflar infinitamente sem custo.
- **Necessidade:** Introduzir "Custo de Existência" (taxas de infraestrutura reais) que forcem a eficiência econômica dos agentes.
