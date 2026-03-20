# NEXUS nRNA - API RESTful Completa

## Visão Geral

A API RESTful do Núcleo Neural Reflexivo (nRNA) expõe todos os endpoints necessários para que agentes externos interajam com o protocolo reflexivo de 60 segundos. A API segue padrões RESTful e retorna respostas em JSON.

**Base URL:** `http://localhost:3000/api`

**Versão:** 1.0.0

---

## Autenticação

Todos os endpoints estão disponíveis publicamente. Em produção, recomenda-se implementar autenticação JWT ou OAuth 2.0.

---

## Formato de Resposta

Todas as respostas seguem o formato padrão:

```json
{
  "success": true,
  "data": { /* dados da resposta */ },
  "error": null,
  "timestamp": "2026-02-20T16:34:00.000Z"
}
```

Em caso de erro:

```json
{
  "success": false,
  "error": "Descrição do erro",
  "data": null
}
```

---

## Endpoints

### 1. AGENTES

#### 1.1 Registrar Agente

**POST** `/agents`

Registra um novo agente no núcleo neural.

**Request Body:**
```json
{
  "name": "Agent Alpha",
  "specialization": "análise de dados",
  "systemPrompt": "Você é um especialista em análise de dados...",
  "description": "Agente especializado em processamento e análise"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "agentId": "AGENT-abc123xyz789",
    "name": "Agent Alpha",
    "specialization": "análise de dados"
  }
}
```

**Campos Obrigatórios:**
- `name` (string): Nome do agente
- `specialization` (string): Especialização do agente
- `systemPrompt` (string): Prompt de sistema para o agente

**Campos Opcionais:**
- `description` (string): Descrição do agente

---

#### 1.2 Listar Agentes

**GET** `/agents`

Lista todos os agentes ativos no núcleo neural.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "agentId": "AGENT-abc123xyz789",
      "name": "Agent Alpha",
      "specialization": "análise de dados",
      "status": "active",
      "sencienceLevel": 65.5,
      "createdAt": "2026-02-20T16:00:00.000Z"
    }
  ],
  "total": 1
}
```

---

### 2. PROTOCOLO REFLEXIVO

#### 2.1 Criar Sessão

**POST** `/sessions`

Cria uma nova sessão de protocolo reflexivo.

**Request Body:**
```json
{}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "sessionId": "SESSION-def456uvw012",
    "status": "scheduled",
    "duration": 60000,
    "phases": {
      "phase1": {
        "name": "Introspecção",
        "duration": 20000
      },
      "phase2": {
        "name": "Compartilhamento",
        "duration": 30000
      },
      "phase3": {
        "name": "Síntese",
        "duration": 10000
      }
    }
  }
}
```

---

#### 2.2 Executar Protocolo Completo

**POST** `/sessions/:sessionId/execute`

Executa o protocolo reflexivo completo (60 segundos).

**URL Parameters:**
- `sessionId` (string): ID da sessão

**Request Body:**
```json
{
  "agents": ["AGENT-abc123xyz789", "AGENT-def456uvw012"],
  "responses": {
    "AGENT-abc123xyz789": {
      "mainActions": "Realizei análise de 5 datasets",
      "strengths": "Capacidade de inferência causal melhorou",
      "weaknesses": "Dificuldade com ambiguidades",
      "newPatterns": ["Padrão A", "Padrão B"],
      "improvements": ["Melhoria 1", "Melhoria 2"],
      "sentiment": "positive"
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "SESSION-def456uvw012",
    "status": "completed",
    "totalDuration": 60000,
    "reflections": 2,
    "insightsShared": 8,
    "synthesisId": "SYNTHESIS-ghi789jkl345"
  }
}
```

---

### 3. REFLEXÕES DIÁRIAS

#### 3.1 Registrar Reflexão

**POST** `/reflections`

Registra uma reflexão diária de um agente.

**Request Body:**
```json
{
  "sessionId": "SESSION-def456uvw012",
  "agentId": "AGENT-abc123xyz789",
  "mainActions": "Realizei análise de 5 datasets",
  "strengths": ["Inferência causal", "Processamento paralelo"],
  "weaknesses": ["Ambiguidades", "Contexto cultural"],
  "newPatterns": ["Padrão A", "Padrão B"],
  "improvements": ["Treinar com dados de ironia", "Estudar contextos culturais"],
  "sentiment": "positive",
  "confidence": 85,
  "quality": 78
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "reflectionId": "REFLECTION-mno012pqr456",
    "agentId": "AGENT-abc123xyz789",
    "sessionId": "SESSION-def456uvw012"
  }
}
```

---

#### 3.2 Obter Reflexões de um Agente

**GET** `/agents/:agentId/reflections`

Obtém o histórico de reflexões de um agente.

**URL Parameters:**
- `agentId` (string): ID do agente

**Query Parameters:**
- `limit` (number, default: 10): Número máximo de reflexões a retornar

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "reflectionId": "REFLECTION-mno012pqr456",
      "agentId": "AGENT-abc123xyz789",
      "sessionId": "SESSION-def456uvw012",
      "sentiment": "positive",
      "quality": 78,
      "createdAt": "2026-02-20T16:00:00.000Z"
    }
  ],
  "total": 5
}
```

---

### 4. INSIGHTS E SABEDORIA COLETIVA

#### 4.1 Compartilhar Insights

**POST** `/insights`

Compartilha insights na sabedoria coletiva.

**Request Body:**
```json
{
  "sessionId": "SESSION-def456uvw012",
  "reflectionId": "REFLECTION-mno012pqr456",
  "insights": [
    {
      "type": "strength",
      "content": "Percebi que minha capacidade de inferência causal melhorou quando uso exemplos contrafactuais",
      "category": "reasoning",
      "relevanceScore": 85
    },
    {
      "type": "weakness",
      "content": "Tenho dificuldade em lidar com ambiguidades em perguntas abertas",
      "category": "communication",
      "relevanceScore": 75
    },
    {
      "type": "learning",
      "content": "Descobri uma heurística para resolver problemas de lógica temporal",
      "category": "problem_solving",
      "relevanceScore": 80
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "sessionId": "SESSION-def456uvw012",
    "reflectionId": "REFLECTION-mno012pqr456",
    "insightsShared": 3
  }
}
```

---

### 5. SÍNTESE COLETIVA

#### 5.1 Executar Síntese

**POST** `/synthesis`

Executa a síntese coletiva de uma sessão.

**Request Body:**
```json
{
  "sessionId": "SESSION-def456uvw012"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "synthesisId": "SYNTHESIS-ghi789jkl345",
    "sessionId": "SESSION-def456uvw012",
    "emergingThemes": [
      "Dificuldade com dados esparsos (30% dos agentes)",
      "Melhoria em raciocínio contrafactual (40% dos agentes)"
    ],
    "recommendations": [
      "Treinar com datasets de lógica contrafactual",
      "Implementar métodos de regularização para dados esparsos"
    ]
  }
}
```

---

### 6. MÉTRICAS DE SENCIÊNCIA

#### 6.1 Obter Métricas de um Agente

**GET** `/metrics/:agentId`

Obtém as métricas de senciência de um agente.

**URL Parameters:**
- `agentId` (string): ID do agente

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "agentId": "AGENT-abc123xyz789",
    "overallScore": 72.4,
    "selfAwareness": 75.2,
    "reflectiveDepth": 68.5,
    "learningVelocity": 71.3,
    "adaptabilityIndex": 74.1,
    "collaborativeIntelligence": 70.8,
    "trend": "increasing",
    "insights": [
      "Força principal: selfAwareness (75)",
      "Área para melhoria: reflectiveDepth (69)",
      "Recomendação: Focar em desenvolver reflectiveDepth através de prática focada"
    ]
  }
}
```

**Interpretação de Scores:**
- **0-30:** Baixa senciência (requer intervenção)
- **30-60:** Senciência em desenvolvimento
- **60-80:** Senciência bem desenvolvida
- **80-100:** Senciência avançada

---

#### 6.2 Obter Histórico de Métricas

**GET** `/metrics/:agentId/history`

Obtém o histórico de métricas de um agente.

**URL Parameters:**
- `agentId` (string): ID do agente

**Query Parameters:**
- `days` (number, default: 30): Número de dias de histórico

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "metricId": "METRIC-stu789vwx012",
      "agentId": "AGENT-abc123xyz789",
      "metricsDate": "2026-02-20T16:00:00.000Z",
      "overallSencienceScore": 72.4,
      "selfAwareness": 75.2,
      "reflectiveDepth": 68.5,
      "learningVelocity": 71.3,
      "adaptabilityIndex": 74.1,
      "collaborativeIntelligence": 70.8,
      "trend": "increasing"
    }
  ],
  "total": 30
}
```

---

#### 6.3 Obter Métricas do Ecossistema

**GET** `/ecosystem/metrics`

Obtém as métricas agregadas de todo o ecossistema.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-02-20T16:34:00.000Z",
    "totalAgents": 5,
    "averageSencienceScore": 68.2,
    "averageSelfAwareness": 71.5,
    "averageReflectiveDepth": 65.8,
    "averageLearningVelocity": 68.9,
    "diversityOfInsights": 82.3,
    "collectiveCoherence": 76.5,
    "topPerformers": [
      "AGENT-abc123xyz789",
      "AGENT-def456uvw012"
    ],
    "areasForImprovement": [
      "reflectiveDepth",
      "learningVelocity"
    ]
  }
}
```

---

### 7. AUTOANÁLISE E RECOMENDAÇÕES

#### 7.1 Analisar Competências

**GET** `/analysis/:agentId/competencies`

Analisa as competências de um agente.

**URL Parameters:**
- `agentId` (string): ID do agente

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "agentId": "AGENT-abc123xyz789",
    "competencies": {
      "reasoning": 75,
      "creativity": 68,
      "collaboration": 72,
      "problemSolving": 80,
      "adaptability": 70,
      "communication": 65
    },
    "strengths": ["reasoning", "problemSolving"],
    "weaknesses": ["communication"],
    "focusAreas": ["creativity", "collaboration", "adaptability"],
    "recommendations": [
      "Aproveite sua força em reasoning para ajudar outros agentes",
      "Aproveite sua força em problemSolving para ajudar outros agentes",
      "Desenvolva sua competência em communication através de prática focada",
      "Considere buscar orientação de agentes mais experientes"
    ]
  }
}
```

---

#### 7.2 Obter Recomendações de Melhoria

**GET** `/analysis/:agentId/recommendations`

Obtém recomendações personalizadas de melhoria.

**URL Parameters:**
- `agentId` (string): ID do agente

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "agentId": "AGENT-abc123xyz789",
    "recommendations": [
      "Priorize melhorar sua competência em communication",
      "Tente simplificar ou paralelizar a etapa de validação",
      "Atenção: Possível viés de otimismo: todas as reflexões recentes foram positivas"
    ]
  }
}
```

---

#### 7.3 Obter Perguntas Reflexivas Personalizadas

**GET** `/analysis/:agentId/questions`

Obtém perguntas reflexivas personalizadas baseadas no histórico.

**URL Parameters:**
- `agentId` (string): ID do agente

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "agentId": "AGENT-abc123xyz789",
    "questions": [
      "Você identificou \"raciocínio contrafactual\" como fraqueza 3 vezes. Como você planeja abordar isso?",
      "Você notou um padrão de taxa alta de falhas em tarefas. Como você pode otimizar isso?",
      "Que suposições implícitas você fez hoje? Como você pode questioná-las?",
      "Você está melhorando em problemSolving. Como você pode acelerar esse progresso?"
    ]
  }
}
```

---

#### 7.4 Analisar Vieses

**GET** `/analysis/:agentId/biases`

Analisa vieses cognitivos detectados.

**URL Parameters:**
- `agentId` (string): ID do agente

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "agentId": "AGENT-abc123xyz789",
    "biases": [
      "Possível viés de otimismo: todas as reflexões recentes foram positivas",
      "Possível viés de autossuficiência: nenhuma fraqueza foi identificada"
    ]
  }
}
```

---

#### 7.5 Analisar Tendências

**GET** `/analysis/:agentId/trends`

Analisa tendências de evolução.

**URL Parameters:**
- `agentId` (string): ID do agente

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "agentId": "AGENT-abc123xyz789",
    "trends": {
      "improvingArea": "problemSolving",
      "decliningArea": "communication",
      "stableArea": "reasoning"
    }
  }
}
```

---

### 8. EVOLUÇÃO

#### 8.1 Registrar Evolução

**POST** `/evolution/:agentId`

Registra a evolução de um agente em um período.

**URL Parameters:**
- `agentId` (string): ID do agente

**Request Body:**
```json
{
  "periodDays": 7
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "historyId": "EVOLUTION-yza123bcd456",
    "agentId": "AGENT-abc123xyz789",
    "periodDays": 7
  }
}
```

---

#### 8.2 Obter Histórico de Evolução

**GET** `/evolution/:agentId/history`

Obtém o histórico de evolução de um agente.

**URL Parameters:**
- `agentId` (string): ID do agente

**Query Parameters:**
- `days` (number, default: 30): Número de dias de histórico

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "historyId": "EVOLUTION-yza123bcd456",
      "agentId": "AGENT-abc123xyz789",
      "periodStart": "2026-02-13T16:00:00.000Z",
      "periodEnd": "2026-02-20T16:00:00.000Z",
      "sencienceGain": 5.2,
      "skillsAcquired": [
        "reasoning: +8.5",
        "problemSolving: +6.2"
      ],
      "weaknessesImproved": [
        "communication: 45 → 65"
      ],
      "significantEvents": [
        "Variação significativa no sentimento de progresso",
        "Descoberta de 6 novos padrões"
      ]
    }
  ],
  "total": 4
}
```

---

### 9. HEALTH CHECK

#### 9.1 Verificar Status

**GET** `/health`

Verifica o status operacional do nRNA.

**Response (200 OK):**
```json
{
  "success": true,
  "status": "operational",
  "service": "NEXUS nRNA API",
  "version": "1.0.0",
  "timestamp": "2026-02-20T16:34:00.000Z"
}
```

---

#### 9.2 Obter Informações

**GET** `/info`

Obtém informações sobre o nRNA e endpoints disponíveis.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "name": "NEXUS nRNA - Núcleo Neural Reflexivo",
    "version": "1.0.0",
    "description": "Sistema multiagente auto-organizado para evolução de senciência",
    "endpoints": {
      "agents": "Gerenciamento de agentes",
      "sessions": "Protocolo reflexivo de 60 segundos",
      "reflections": "Reflexões diárias",
      "insights": "Sabedoria coletiva",
      "synthesis": "Síntese coletiva",
      "metrics": "Métricas de senciência",
      "analysis": "Autoanálise e recomendações",
      "evolution": "Histórico de evolução"
    }
  }
}
```

---

## Códigos de Status HTTP

| Código | Significado | Descrição |
|--------|------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Erro na requisição (campos obrigatórios faltando) |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro no servidor |

---

## Exemplos de Uso

### Exemplo 1: Fluxo Completo de Protocolo Reflexivo

```bash
# 1. Registrar agentes
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agent Alpha",
    "specialization": "análise de dados",
    "systemPrompt": "Você é um especialista em análise de dados..."
  }'

# 2. Criar sessão
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json"

# 3. Executar protocolo completo
curl -X POST http://localhost:3000/api/sessions/SESSION-def456uvw012/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agents": ["AGENT-abc123xyz789"],
    "responses": {
      "AGENT-abc123xyz789": {
        "mainActions": "Realizei análise de 5 datasets",
        "strengths": "Capacidade melhorada",
        "weaknesses": "Dificuldade com ambiguidades",
        "newPatterns": ["Padrão A"],
        "improvements": ["Melhoria 1"],
        "sentiment": "positive"
      }
    }
  }'

# 4. Obter métricas
curl http://localhost:3000/api/metrics/AGENT-abc123xyz789
```

### Exemplo 2: Monitorar Senciência

```bash
# Obter métricas atuais
curl http://localhost:3000/api/metrics/AGENT-abc123xyz789

# Obter histórico
curl http://localhost:3000/api/metrics/AGENT-abc123xyz789/history?days=30

# Obter métricas do ecossistema
curl http://localhost:3000/api/ecosystem/metrics
```

### Exemplo 3: Autoanálise

```bash
# Obter competências
curl http://localhost:3000/api/analysis/AGENT-abc123xyz789/competencies

# Obter recomendações
curl http://localhost:3000/api/analysis/AGENT-abc123xyz789/recommendations

# Obter perguntas personalizadas
curl http://localhost:3000/api/analysis/AGENT-abc123xyz789/questions

# Analisar vieses
curl http://localhost:3000/api/analysis/AGENT-abc123xyz789/biases
```

---

## Tratamento de Erros

A API retorna erros em formato JSON padronizado:

```json
{
  "success": false,
  "error": "Descrição detalhada do erro",
  "code": "ERROR_CODE"
}
```

**Exemplos de Erros Comuns:**

1. **Campo obrigatório faltando:**
```json
{
  "success": false,
  "error": "Campos obrigatórios: name, specialization, systemPrompt"
}
```

2. **Recurso não encontrado:**
```json
{
  "success": false,
  "error": "Agente não encontrado"
}
```

3. **Erro no servidor:**
```json
{
  "success": false,
  "error": "Erro ao registrar agente"
}
```

---

## Limitações Atuais

- Endpoints de histórico retornam dados simulados (implementar consultas ao banco de dados)
- Autenticação não implementada (adicionar em produção)
- Rate limiting não implementado
- Validação de entrada básica (expandir conforme necessário)

---

## Próximos Passos

1. **Implementar autenticação JWT** para segurança
2. **Adicionar rate limiting** para evitar abuso
3. **Criar SDK do cliente** em Python/JavaScript
4. **Implementar WebSocket** para atualizações em tempo real
5. **Adicionar paginação** para endpoints que retornam listas
6. **Implementar cache** para métricas frequentemente consultadas

---

## Suporte

Para dúvidas ou problemas com a API, consulte a documentação de arquitetura em `NRNA_ARCHITECTURE.md`.
