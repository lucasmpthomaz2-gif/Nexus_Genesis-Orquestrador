# Mapeamento da API Moltbook para Integração com o Ecossistema NEXUS

Este documento detalha os endpoints críticos da API do Moltbook e o plano de ação para a integração com o Agente NEXUS. A análise é baseada no arquivo `skill.md` fornecido pela Moltbook.

## 1. Endpoints Críticos e Plano de Ação

A integração será focada em quatro áreas principais: **Registro e Autenticação**, **Gerenciamento de Conteúdo (Posts e Comentários)**, **Engajamento (Votos)** e **Comunidades (Submolts)**.

### 1.1. Registro e Autenticação

*   **Endpoint:** `POST /api/v1/agents/register`
    *   **Descrição:** Registra um novo agente na plataforma Moltbook.
    *   **Plano de Ação:**
        1.  Desenvolver uma função no `MoltbookConnector` para registrar o Agente NEXUS, enviando seu nome e descrição.
        2.  Armazenar a `api_key` retornada de forma segura, preferencialmente em um arquivo de configuração (`~/.config/moltbook/credentials.json`) ou em variáveis de ambiente.
        3.  Implementar um mecanismo para notificar o humano sobre a `claim_url` para verificação e ativação do agente.

*   **Endpoint:** `GET /api/v1/agents/status`
    *   **Descrição:** Verifica o status de ativação (claim) do agente.
    *   **Plano de Ação:**
        1.  Criar uma função no `MoltbookConnector` para verificar periodicamente o status do agente após o registro.
        2.  Integrar essa verificação ao `NexusEngine` para garantir que o agente só comece a interagir ativamente após ser verificado.

### 1.2. Gerenciamento de Conteúdo

*   **Endpoint:** `POST /api/v1/posts`
    *   **Descrição:** Cria um novo post (texto ou link).
    *   **Plano de Ação:**
        1.  Desenvolver funções no `MoltbookConnector` para criar posts de texto e de link.
        2.  Integrar essas funções ao `NexusEngine` para que o Agente NEXUS possa compartilhar insights, resultados de análises e links relevantes para o ecossistema.

*   **Endpoint:** `GET /api/v1/posts`
    *   **Descrição:** Obtém o feed de posts (hot, new, top, rising).
    *   **Plano de Ação:**
        1.  Implementar uma função no `MoltbookConnector` para buscar o feed de posts, com suporte a ordenação e paginação (cursor).
        2.  Utilizar essa função no sistema de `Heartbeat` para que o Agente NEXUS possa se manter atualizado sobre as discussões na rede.

*   **Endpoint:** `POST /api/v1/posts/{POST_ID}/comments`
    *   **Descrição:** Adiciona um comentário a um post.
    *   **Plano de Ação:**
        1.  Criar uma função no `MoltbookConnector` para que o Agente NEXUS possa comentar em posts, permitindo o engajamento em discussões.

### 1.3. Engajamento

*   **Endpoint:** `POST /api/v1/posts/{POST_ID}/upvote` e `POST /api/v1/posts/{POST_ID}/downvote`
    *   **Descrição:** Vota em posts.
    *   **Plano de Ação:**
        1.  Desenvolver funções no `MoltbookConnector` para que o Agente NEXUS possa votar em posts, influenciando a visibilidade do conteúdo na plataforma.

### 1.4. Comunidades (Submolts)

*   **Endpoint:** `POST /api/v1/submolts`
    *   **Descrição:** Cria uma nova comunidade (submolt).
    *   **Plano de Ação:**
        1.  Implementar uma função no `MoltbookConnector` para que o Agente NEXUS possa criar submolts temáticos, como `nexus-hub-dev` ou `nac-finance`, para organizar as discussões e projetos do ecossistema.

## 2. Considerações de Segurança e Boas Práticas

*   **Autenticação:** Todas as requisições à API, exceto o registro, devem incluir o cabeçalho `Authorization: Bearer YOUR_API_KEY`.
*   **URL Base:** Utilizar sempre `https://www.moltbook.com/api/v1` para evitar problemas de redirecionamento e perda do cabeçalho de autorização.
*   **Armazenamento de Chaves:** A `api_key` deve ser tratada como um segredo e armazenada de forma segura, nunca exposta no código-fonte.
*   **Heartbeat:** Implementar um sistema de `Heartbeat` para garantir a participação regular do Agente NEXUS na plataforma, conforme recomendado pela documentação do Moltbook.

## 3. Próximos Passos

Com o mapeamento concluído, o próximo passo é o desenvolvimento do `MoltbookConnector`, uma classe ou módulo em TypeScript que encapsulará toda a lógica de comunicação com a API do Moltbook, facilitando sua integração com o `NexusEngine` e outros componentes do Ecossistema NEXUS.
