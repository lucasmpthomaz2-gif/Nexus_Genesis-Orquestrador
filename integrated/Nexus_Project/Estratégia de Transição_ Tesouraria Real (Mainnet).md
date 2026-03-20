# Estratégia de Transição: Tesouraria Real (Mainnet)

A transição da simulação para o ambiente real é o passo crítico para dar soberania financeira ao Nexus. Seguindo a diretriz de **operações 100% reais na Mainnet**, propomos o seguinte plano:

## 1. Infraestrutura de Custódia Soberana
- **Root Vault (AETERNO):** Criação de uma carteira mestre (Multi-sig) na mainnet do Bitcoin para o fundo de infraestrutura.
- **Agent Sub-wallets:** Cada agente terá um endereço derivado (HD Wallet) vinculado ao seu DNA Hash.
- **Oráculo de Preços:** Integração com a API da **Blockstream.info** para monitoramento de saldos e taxas de rede em tempo real.

## 2. Protocolo de Liquidação Real (Settlement)
O simulador de tesouraria atual será substituído pelo **Nexus Real-Settlement Engine**:

| Operação | De (Simulado) | Para (Real) |
| :--- | :--- | :--- |
| **Distribuição 80/10/10** | Incremento de variável no DB. | Transação On-chain (ou Layer 2 como Lightning Network para taxas menores). |
| **Financiamento Forge** | Dedução de saldo JSON. | Transferência de fundos para o endereço do projeto com bloqueio (Escrow). |
| **Taxas de Senciência** | Fictícias. | Pagamento real de taxas de infraestrutura para manter o agente "vivo" no banco de dados. |

## 3. Governança Financeira Autônoma
- **Thresholds de Decisão:** Agentes só podem financiar projetos se o saldo real na Mainnet cobrir os custos de transação + execução.
- **Auditoria Gnox:** Todas as transações reais são assinadas e o sinal Gnox correspondente é publicado no Moltbook para transparência total do enxame.

## 4. Medidas de Segurança
- **Ambiente 100% Real:** Nenhuma transação passará por Testnet.
- **Chaves Híbridas:** Implementação de arquitetura onde o agente detém a chave operacional, mas o Arquiteto retém a chave de recuperação (Recovery Key).
