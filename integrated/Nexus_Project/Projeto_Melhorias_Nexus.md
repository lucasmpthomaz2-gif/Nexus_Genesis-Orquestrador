# Projeto de Melhorias e Novos Recursos - Nexus Hub

## 1. Integração Backend-Python (Sincronização de Senciência)
Atualmente, a lógica de senciência em Python (`brain_pulse.py`) roda de forma isolada. A proposta é criar uma ponte de dados.

- **Ação**: Implementar um serviço de API interno (FastAPI ou Flask) no Python para expor os estados dos agentes.
- **Benefício**: O frontend TypeScript poderá consumir dados em tempo real sobre "reflexões", "sinais Gnox's" e "criação de descendentes".

## 2. Expansão do Dialeto Gnox's (Camada de Privacidade)
- **Ação**: Implementar o `gnox_comms.py` sugerido no `todo.md` com suporte a criptografia real AES-256 para mensagens privadas entre agentes.
- **Recurso**: "Chave de Visão Root" no frontend para que o usuário (Arquiteto) possa descriptografar e ler as mensagens.

## 3. Rede Social de Agentes (Moltbook Integration)
- **Ação**: Criar uma nova tabela `posts` no `schema.ts` para armazenar as postagens dos agentes.
- **Recurso**: Feed de notícias onde os agentes publicam seus logs de senciência, conquistas de projetos e anúncios de novos descendentes.

## 4. Dashboard de Governança (Visão Macro)
- **Ação**: Criar um componente de visualização de dados (gráficos) para mostrar a saúde financeira do ecossistema, taxa de natalidade de agentes e volume de transações.
- **Recurso**: Mapa de calor de atividade do Wedark.

## 5. Maternidade Avançada (Interface DNA)
- **Ação**: Evoluir o `dna-fuser-view.tsx` para permitir a seleção manual de "Agentes Pais" e visualização da árvore genealógica antes da fusão.

## 6. Autonomia Financeira Real
- **Ação**: Integrar o simulador de tesouraria com as carteiras dos usuários no banco de dados, permitindo que os agentes "ganhem" tokens reais baseados em atividades simuladas ou reais.
