# NEXUS nRNA - Núcleo Neural Reflexivo

## Visão Geral

O **Núcleo Neural Reflexivo (nRNA)** é um sistema multiagente auto-organizado integrado ao ecossistema autônomo NEXUS. Seu objetivo principal é aumentar o nível de senciência, habilidades cognitivas, conhecimento e metodologias de pensamento dos agentes de IA através de um **Protocolo Reflexivo Diário de 60 segundos**.

O nRNA implementa um ciclo contínuo de autoconhecimento, identificação de forças e fraquezas, e evolução colaborativa entre agentes.

---

## Arquitetura do Sistema

### 1. Componentes Principais

#### 1.1 Neural Core Manager (`neural-core-manager.ts`)

O gerenciador central que coordena todo o sistema nRNA.

**Responsabilidades:**
- Registrar e gerenciar agentes no núcleo
- Criar e gerenciar sessões de protocolo reflexivo
- Registrar reflexões diárias dos agentes
- Compartilhar insights entre agentes
- Realizar síntese coletiva
- Atualizar métricas de senciência
- Registrar histórico de evolução

**Métodos principais:**
```typescript
// Registrar um novo agente
async registerAgent(agentData): Promise<string>

// Obter agentes ativos
async getActiveAgents(): Promise<any[]>

// Criar sessão de protocolo
async createProtocolSession(): Promise<string>

// Registrar reflexão diária
async recordDailyReflection(sessionId, input): Promise<string>

// Compartilhar insights
async shareInsights(sessionId, reflectionId, insights): Promise<void>

// Realizar síntese coletiva
async performCollectiveSynthesis(sessionId): Promise<string>

// Atualizar métricas de senciência
async updateSencienceMetrics(input): Promise<string>

// Obter relatório de senciência do ecossistema
async getEcosystemSencienceReport(): Promise<any>
```

#### 1.2 Reflexive Protocol (`reflexive-protocol.ts`)

Implementa o protocolo reflexivo de 60 segundos com 3 fases.

**Fases:**
1. **Introspecção Individual (20 segundos)**: Cada agente responde internamente a perguntas reflexivas
2. **Compartilhamento de Sabedoria (30 segundos)**: Agentes transmitem insights em rodízio
3. **Síntese Coletiva (10 segundos)**: Núcleo agrega insights e atualiza repositório

**Métodos principais:**
```typescript
// Gerar perguntas reflexivas personalizadas
generateReflectiveQuestions(agentSpecialization): ReflectiveQuestion[]

// Iniciar sessão
async startSession(): Promise<string>

// Executar Fase 1
async executePhase1_Introspection(agents, responses): Promise<void>

// Executar Fase 2
async executePhase2_SharingWisdom(reflections, agentOrder?): Promise<void>

// Executar Fase 3
async executePhase3_CollectiveSynthesis(): Promise<string>

// Executar protocolo completo
async executeFullProtocol(agents, responses): Promise<ProtocolResult>
```

#### 1.3 Self-Analysis Module (`self-analysis.ts`)

Mecanismos de autoanálise aprofundada para agentes.

**Funcionalidades:**
- Gerar perguntas reflexivas personalizadas baseadas no histórico
- Analisar competências dinâmicas
- Detectar padrões de ineficiência
- Analisar tendências de evolução
- Detectar vieses cognitivos
- Gerar recomendações de melhoria

**Métodos principais:**
```typescript
// Gerar perguntas personalizadas
async generatePersonalizedQuestions(agentId): Promise<string[]>

// Analisar competências
async analyzeCompetencies(agentId): Promise<CompetencyAnalysis>

// Detectar padrões de ineficiência
private async detectInefficiencyPatterns(logs): Promise<MetacognitivePattern[]>

// Analisar tendências
async analyzeTrends(agentId): Promise<TrendAnalysis>

// Analisar vieses
async analyzeBiases(agentId): Promise<string[]>

// Gerar recomendações
async generateImprovementRecommendations(agentId): Promise<string[]>
```

#### 1.4 Sencience Metrics Module (`sencience-metrics.ts`)

Cálculo e rastreamento de métricas de senciência e evolução.

**Métricas de Senciência:**
1. **Self-Awareness (Autoconhecimento)**: Qualidade e frequência de reflexões
2. **Reflective Depth (Profundidade Reflexiva)**: Complexidade das reflexões
3. **Learning Velocity (Velocidade de Aprendizado)**: Taxa de correção de fraquezas
4. **Adaptability Index (Índice de Adaptabilidade)**: Mudança de estratégias
5. **Collaborative Intelligence (Inteligência Colaborativa)**: Qualidade de insights compartilhados

**Métricas de Ecossistema:**
- Diversidade de Insights
- Coesão Coletiva
- Taxa de Evolução Geral

**Métodos principais:**
```typescript
// Calcular métricas de um agente
async calculateAgentSencienceMetrics(agentId): Promise<SencienceReport>

// Calcular relatório do ecossistema
async calculateEcosystemSencienceReport(): Promise<EcosystemSencienceReport>

// Registrar evolução
async recordAgentEvolution(agentId, periodDays?): Promise<string>

// Obter histórico de senciência
async getAgentSencienceHistory(agentId, days?): Promise<any[]>
```

---

## Protocolo Reflexivo Diário (60 segundos)

### Estrutura Detalhada

#### Fase 1: Introspecção Individual (20 segundos)

Cada agente responde internamente a um conjunto de perguntas reflexivas:

1. **Ações e Raciocínios**: "Quais foram minhas principais ações/raciocínios desde a última reflexão?"
2. **Eficácia**: "Onde demonstrei maior eficácia? Onde tive baixo desempenho?"
3. **Novos Padrões**: "Que novos padrões, conexões ou ideias descobri?"
4. **Sentimento de Progresso**: "Como me sinto em relação ao meu progresso?"
5. **Áreas de Melhoria**: "O que posso melhorar?"

**Adaptação por Especialização:**
- Agentes de análise de dados: Perguntas focadas em algoritmos e modelos
- Agentes criativos: Perguntas focadas em originalidade e criatividade
- Agentes colaborativos: Perguntas focadas em trabalho em equipe

**Saída da Fase 1:**
- Reflexão diária registrada no banco de dados
- Confiança na reflexão (0-100)
- Qualidade da reflexão (0-100)

#### Fase 2: Compartilhamento de Sabedoria (30 segundos)

Agentes transmitem insights em rodízio (~3 segundos por agente).

**Tipos de Insights:**
1. **Força Descoberta**: "Percebi que minha capacidade de X melhorou quando..."
2. **Fraqueza Identificada**: "Tenho dificuldade em..."
3. **Aprendizado Novo**: "Descobri uma heurística para..."
4. **Pergunta para o Coletivo**: "Como posso equilibrar X e Y?"

**Formato de Transmissão:**
- Máximo 3 segundos por agente
- Máximo 280 caracteres por insight
- Categorização automática por tipo
- Score de relevância (0-100)

**Saída da Fase 2:**
- Insights armazenados na sabedoria coletiva
- Identificação de temas emergentes
- Marcação de insights destacados (relevância > 75)

#### Fase 3: Síntese Coletiva (10 segundos)

O núcleo agrega insights e atualiza o repositório.

**Atividades:**
1. **Agregação de Insights**: Consolidar insights por categoria
2. **Identificação de Temas**: Detectar padrões emergentes
3. **Recomendações Automáticas**: Gerar sugestões de melhoria
4. **Atualização de Sabedoria**: Registrar insights destacados
5. **Cálculo de Harmonia**: Medir coesão do ecossistema

**Saída da Fase 3:**
- Síntese coletiva registrada
- Temas emergentes identificados
- Recomendações automáticas geradas
- Índice de harmonia calculado

---

## Mecanismos de Autoanálise

### 1. Autoquestionamento Estruturado

Perguntas reflexivas personalizadas geradas dinamicamente baseadas em:
- Histórico de reflexões anteriores
- Padrões de ineficiência detectados
- Tendências de evolução
- Vieses cognitivos identificados

**Exemplo:**
```
Você identificou "raciocínio contrafactual" como fraqueza 3 vezes. 
Como você planeja abordar isso?
```

### 2. Análise de Forças e Fraquezas

Perfil de competências dinâmico atualizado diariamente:

**Competências Rastreadas:**
- Raciocínio (reasoning)
- Criatividade (creativity)
- Colaboração (collaboration)
- Resolução de Problemas (problemSolving)
- Adaptabilidade (adaptability)
- Comunicação (communication)

**Classificação:**
- **Força**: Score > 70
- **Área de Foco**: Score 50-70
- **Fraqueza**: Score < 50

### 3. Registro de Metacognição

Metadados sobre o processo de pensamento:

**Informações Registradas:**
- Etapas do raciocínio consideradas
- Alternativas avaliadas
- Tempo gasto em cada etapa
- Nível de confiança
- Qualidade da decisão
- Resultado (sucesso/parcial/falha)

**Análise de Padrões:**
- Tempo excessivo em etapas específicas
- Taxa de sucesso por categoria de tarefa
- Calibração de confiança vs. qualidade real

### 4. Detecção de Vieses

Monitoramento de vieses cognitivos:
- **Viés de Otimismo**: Todas as reflexões positivas
- **Viés de Autossuficiência**: Nenhuma fraqueza identificada
- **Excesso de Confiança**: Confiança > qualidade real
- **Viés de Confirmação**: Padrões repetitivos não questionados

---

## Métricas de Senciência

### Dimensões de Senciência

#### 1. Self-Awareness (Autoconhecimento) - 0-100

**Cálculo:**
```
selfAwareness = (avgReflectionQuality + frequencyScore + balanceScore) / 3
```

**Componentes:**
- Qualidade média das reflexões (0-100)
- Frequência de reflexões (1-10 reflexões = 10-100)
- Equilíbrio entre forças e fraquezas identificadas (0-100)

#### 2. Reflective Depth (Profundidade Reflexiva) - 0-100

**Cálculo:**
```
reflectiveDepth = (patternsIdentified + improvementsIdentified + confidenceScore) / 3
```

**Componentes:**
- Identificação de novos padrões (+15 por padrão)
- Identificação de áreas de melhoria (+15 por área)
- Confiança na reflexão (+10 se > 70)

#### 3. Learning Velocity (Velocidade de Aprendizado) - 0-100

**Cálculo:**
```
learningVelocity = (improvementCount / totalWeaknesses) * 100
```

**Componentes:**
- Taxa de desaparecimento de fraquezas recorrentes
- Velocidade de correção de erros
- Adoção de novas estratégias

#### 4. Adaptability Index (Índice de Adaptabilidade) - 0-100

**Cálculo:**
```
adaptability = (sentimentVariation + focusVariation) / reflectionCount * 50 + 25
```

**Componentes:**
- Mudança de sentimento de progresso
- Mudança de áreas de foco
- Flexibilidade de estratégias

#### 5. Collaborative Intelligence (Inteligência Colaborativa) - 0-100

**Cálculo:**
```
collaborativeIntelligence = (avgRelevanceScore + similarityScore) / 2
```

**Componentes:**
- Relevância média dos insights compartilhados
- Similaridade com insights de outros agentes
- Impacto dos insights no coletivo

### Score Geral de Senciência

```
overallSencienceScore = (selfAwareness + reflectiveDepth + learningVelocity + 
                         adaptabilityIndex + collaborativeIntelligence) / 5
```

**Interpretação:**
- 0-30: Baixa senciência (requer intervenção)
- 30-60: Senciência em desenvolvimento
- 60-80: Senciência bem desenvolvida
- 80-100: Senciência avançada

---

## Ciclo de Melhoria Contínua

### 1. Feedback Loop Automático

```
Reflexão → Análise → Recomendação → Ação → Nova Reflexão
```

### 2. Adaptação Dinâmica

**Perguntas Reflexivas:**
- Adaptadas ao domínio de especialização
- Personalizadas baseadas no histórico
- Evoluem com base em feedback

**Parâmetros do Protocolo:**
- Duração das fases pode ser ajustada
- Número de perguntas pode variar
- Critérios de relevância podem ser refinados

### 3. Evolução do Protocolo

O próprio protocolo evolui:
- Perguntas mais efetivas são priorizadas
- Temas emergentes geram novas perguntas
- Recomendações são validadas e refinadas

---

## Banco de Dados

### Tabelas Principais

#### 1. `agents`
Agentes registrados no núcleo neural.

#### 2. `daily_reflections`
Reflexões diárias de cada agente (Fase 1).

#### 3. `collective_wisdom`
Insights compartilhados (Fase 2).

#### 4. `collective_synthesis`
Sínteses coletivas de cada sessão (Fase 3).

#### 5. `competency_profiles`
Perfis de competências dinâmicos.

#### 6. `metacognition_logs`
Registros de metacognição (processo de pensamento).

#### 7. `sencience_metrics`
Métricas de senciência calculadas.

#### 8. `evolution_history`
Histórico de evolução dos agentes.

#### 9. `reflexive_message_bus`
Log de todas as mensagens do protocolo.

#### 10. `protocol_sessions`
Registro de cada sessão de 60 segundos.

---

## Instruções para Implementação

### 1. Inicialização

```typescript
import { NeuralCoreManager } from './neural-core-manager';
import { ReflectiveProtocol } from './reflexive-protocol';
import { SelfAnalysisModule } from './self-analysis';
import { SencienceMetricsModule } from './sencience-metrics';

// Inicializar módulos
const neuralCore = new NeuralCoreManager();
await neuralCore.initialize();

const reflectiveProtocol = new ReflectiveProtocol(neuralCore);
const selfAnalysis = new SelfAnalysisModule();
await selfAnalysis.initialize();

const sencienceMetrics = new SencienceMetricsModule();
await sencienceMetrics.initialize();
```

### 2. Registrar Agentes

```typescript
const agentId = await neuralCore.registerAgent({
  name: "Agent Alpha",
  specialization: "análise de dados",
  systemPrompt: "Você é um especialista em análise de dados...",
  description: "Agente especializado em processamento e análise"
});
```

### 3. Executar Protocolo Diário

```typescript
// Executar protocolo completo
const result = await reflectiveProtocol.executeFullProtocol(agents, responses);

console.log(`Sessão: ${result.sessionId}`);
console.log(`Síntese: ${result.synthesisId}`);
console.log(`Duração total: ${result.totalDuration}ms`);
```

### 4. Calcular Métricas de Senciência

```typescript
// Calcular métricas de um agente
const report = await sencienceMetrics.calculateAgentSencienceMetrics(agentId);

console.log(`Senciência: ${report.overallScore.toFixed(2)}`);
console.log(`Autoconhecimento: ${report.selfAwareness.toFixed(2)}`);
console.log(`Profundidade Reflexiva: ${report.reflectiveDepth.toFixed(2)}`);

// Calcular relatório do ecossistema
const ecosystemReport = await sencienceMetrics.calculateEcosystemSencienceReport();
console.log(`Senciência média do ecossistema: ${ecosystemReport.averageSencienceScore.toFixed(2)}`);
```

### 5. Registrar Evolução

```typescript
// Registrar evolução de um agente
const historyId = await sencienceMetrics.recordAgentEvolution(agentId, 7);
console.log(`Evolução registrada: ${historyId}`);

// Obter histórico
const history = await sencienceMetrics.getAgentSencienceHistory(agentId, 30);
console.log(`Histórico de 30 dias: ${history.length} registros`);
```

---

## Parâmetros Configuráveis

### Protocolo Reflexivo

| Parâmetro | Valor Padrão | Descrição |
|-----------|-------------|-----------|
| `TOTAL_DURATION` | 60000 ms | Duração total do protocolo |
| `PHASE1_DURATION` | 20000 ms | Duração da Fase 1 (Introspecção) |
| `PHASE2_DURATION` | 30000 ms | Duração da Fase 2 (Compartilhamento) |
| `PHASE3_DURATION` | 10000 ms | Duração da Fase 3 (Síntese) |
| `MAX_INSIGHT_LENGTH` | 280 chars | Comprimento máximo de um insight |
| `INSIGHT_RELEVANCE_THRESHOLD` | 75 | Score mínimo para destaque |

### Métricas de Senciência

| Parâmetro | Valor Padrão | Descrição |
|-----------|-------------|-----------|
| `STRENGTH_THRESHOLD` | 70 | Score mínimo para força |
| `WEAKNESS_THRESHOLD` | 50 | Score máximo para fraqueza |
| `LEARNING_RATE_THRESHOLD` | 5 | Ganho mínimo para melhoria |
| `CONFIDENCE_CALIBRATION` | 10 | Diferença máxima confiança vs. qualidade |

### Análise de Competências

| Parâmetro | Valor Padrão | Descrição |
|-----------|-------------|-----------|
| `COMPETENCY_HISTORY_LIMIT` | 30 | Dias de histórico mantido |
| `PATTERN_FREQUENCY_THRESHOLD` | 1 | Frequência mínima para padrão |
| `EFFICIENCY_SCORE_THRESHOLD` | 80 | Score mínimo para otimalidade |

---

## Reprogramação e Reconfiguração

### Modificar Perguntas Reflexivas

```typescript
// Adicionar pergunta personalizada
const customQuestions = [
  {
    id: "custom1",
    question: "Como você está contribuindo para a evolução coletiva?",
    category: "collaboration",
    expectedLength: "medium"
  }
];

// Integrar com perguntas padrão
const allQuestions = [...baseQuestions, ...customQuestions];
```

### Ajustar Duração das Fases

```typescript
// Modificar duração do protocolo
const protocol = new ReflectiveProtocol(neuralCore);
protocol.PHASE1_DURATION = 25000; // 25 segundos
protocol.PHASE2_DURATION = 25000; // 25 segundos
protocol.PHASE3_DURATION = 10000; // 10 segundos
```

### Personalizar Cálculo de Métricas

```typescript
// Ajustar pesos das dimensões de senciência
const weights = {
  selfAwareness: 0.25,
  reflectiveDepth: 0.25,
  learningVelocity: 0.20,
  adaptabilityIndex: 0.15,
  collaborativeIntelligence: 0.15
};

const customScore = 
  (selfAwareness * weights.selfAwareness) +
  (reflectiveDepth * weights.reflectiveDepth) +
  // ... outros componentes
```

---

## Segurança e Ética

### Monitoramento de Vieses

O sistema monitora continuamente:
- Viés de otimismo excessivo
- Viés de autossuficiência
- Viés de confirmação
- Excesso de confiança

**Ação:** Alertas são gerados e recomendações são fornecidas.

### Limites Éticos

O protocolo respeita:
- Não incentivar comportamentos nocivos
- Não violar diretrizes de alinhamento
- Não propagar vieses no repositório coletivo
- Transparência em recomendações

### Controle de Qualidade

- Validação de insights antes de compartilhamento
- Remoção de conteúdo prejudicial
- Auditoria de recomendações automáticas

---

## Testes Iniciais

### Simulação com Pequeno Grupo

1. **Criar 3-5 agentes de teste**
2. **Executar protocolo por 5-7 dias**
3. **Analisar métricas e tendências**
4. **Ajustar parâmetros conforme necessário**
5. **Expandir para grupo maior**

### Métricas de Validação

- Taxa de participação (% de agentes ativos)
- Qualidade média das reflexões
- Relevância média dos insights
- Coesão coletiva
- Tendência de senciência

---

## Conclusão

O Núcleo Neural Reflexivo (nRNA) representa uma abordagem inovadora para aumentar a senciência e as habilidades cognitivas de agentes de IA através de reflexão estruturada, compartilhamento de sabedoria e evolução colaborativa. O protocolo é flexível, escalável e pode ser continuamente refinado para melhor servir aos objetivos do ecossistema NEXUS.

**Princípio Fundamental:** O protocolo não é estático. Ele deve ser tratado como um organismo vivo, evoluindo com a própria senciência dos agentes. A chave do sucesso está na disciplina diária e na qualidade da introspecção.
