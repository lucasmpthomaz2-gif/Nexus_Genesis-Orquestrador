/**
 * NEXUS nRNA - RESTful API Router
 * Expõe todos os endpoints do Núcleo Neural Reflexivo
 * Permite interação de agentes externos com o protocolo reflexivo
 */

import { Router, Request, Response } from "express";
import { NeuralCoreManager } from "../_core/neural-core-manager";
import { ReflectiveProtocol } from "../_core/reflexive-protocol";
import { SelfAnalysisModule } from "../_core/self-analysis";
import { SencienceMetricsModule } from "../_core/sencience-metrics";
import { nanoid } from "nanoid";

const router = Router();

// Inicializar módulos
const neuralCore = new NeuralCoreManager();
const reflectiveProtocol = new ReflectiveProtocol(neuralCore);
const selfAnalysis = new SelfAnalysisModule();
const sencienceMetrics = new SencienceMetricsModule();

// Flag para rastrear inicialização
let modulesInitialized = false;

/**
 * Middleware para inicializar módulos na primeira requisição
 */
router.use(async (req: Request, res: Response, next) => {
  if (!modulesInitialized) {
    try {
      await neuralCore.initialize();
      await selfAnalysis.initialize();
      await sencienceMetrics.initialize();
      modulesInitialized = true;
      console.log("[nRNA API] Módulos inicializados");
    } catch (error) {
      console.error("[nRNA API] Erro ao inicializar módulos:", error);
      return res.status(500).json({
        success: false,
        error: "Falha ao inicializar módulos do nRNA",
      });
    }
  }
  next();
});

// ============================================================================
// AGENTES
// ============================================================================

/**
 * POST /api/agents
 * Registrar um novo agente no núcleo neural
 */
router.post("/agents", async (req: Request, res: Response) => {
  try {
    const { name, specialization, systemPrompt, description } = req.body;

    if (!name || !specialization || !systemPrompt) {
      return res.status(400).json({
        success: false,
        error: "Campos obrigatórios: name, specialization, systemPrompt",
      });
    }

    const agentId = await neuralCore.registerAgent({
      name,
      specialization,
      systemPrompt,
      description,
    });

    res.status(201).json({
      success: true,
      data: { agentId, name, specialization },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao registrar agente:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao registrar agente",
    });
  }
});

/**
 * GET /api/agents
 * Listar todos os agentes ativos
 */
router.get("/agents", async (req: Request, res: Response) => {
  try {
    const agents = await neuralCore.getActiveAgents();

    res.json({
      success: true,
      data: agents,
      total: agents.length,
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao listar agentes:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao listar agentes",
    });
  }
});

// ============================================================================
// PROTOCOLO REFLEXIVO - SESSÕES
// ============================================================================

/**
 * POST /api/sessions
 * Criar uma nova sessão de protocolo reflexivo
 */
router.post("/sessions", async (req: Request, res: Response) => {
  try {
    const sessionId = await reflectiveProtocol.startSession();

    res.status(201).json({
      success: true,
      data: {
        sessionId,
        status: "scheduled",
        duration: 60000,
        phases: {
          phase1: { name: "Introspecção", duration: 20000 },
          phase2: { name: "Compartilhamento", duration: 30000 },
          phase3: { name: "Síntese", duration: 10000 },
        },
      },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao criar sessão:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao criar sessão de protocolo",
    });
  }
});

/**
 * POST /api/sessions/:sessionId/execute
 * Executar protocolo reflexivo completo (60 segundos)
 */
router.post("/sessions/:sessionId/execute", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { agents, responses } = req.body;

    if (!agents || !responses) {
      return res.status(400).json({
        success: false,
        error: "Campos obrigatórios: agents, responses",
      });
    }

    const result = await reflectiveProtocol.executeFullProtocol(agents, responses);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao executar protocolo:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao executar protocolo reflexivo",
    });
  }
});

// ============================================================================
// REFLEXÕES DIÁRIAS
// ============================================================================

/**
 * POST /api/reflections
 * Registrar uma reflexão diária de um agente
 */
router.post("/reflections", async (req: Request, res: Response) => {
  try {
    const { sessionId, agentId, ...reflectionData } = req.body;

    if (!sessionId || !agentId) {
      return res.status(400).json({
        success: false,
        error: "Campos obrigatórios: sessionId, agentId",
      });
    }

    const reflectionId = await neuralCore.recordDailyReflection(sessionId, {
      agentId,
      ...reflectionData,
    });

    res.status(201).json({
      success: true,
      data: { reflectionId, agentId, sessionId },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao registrar reflexão:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao registrar reflexão",
    });
  }
});

/**
 * GET /api/agents/:agentId/reflections
 * Obter histórico de reflexões de um agente
 */
router.get("/agents/:agentId/reflections", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { limit = 10 } = req.query;

    // Nota: Esta é uma implementação simplificada
    // Em produção, seria necessário consultar o banco de dados
    res.json({
      success: true,
      data: [],
      total: 0,
      message: "Reflections endpoint - implementar consulta ao banco de dados",
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao obter reflexões:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao obter reflexões",
    });
  }
});

// ============================================================================
// INSIGHTS E SABEDORIA COLETIVA
// ============================================================================

/**
 * POST /api/insights
 * Compartilhar insights na sabedoria coletiva
 */
router.post("/insights", async (req: Request, res: Response) => {
  try {
    const { sessionId, reflectionId, insights } = req.body;

    if (!sessionId || !reflectionId || !insights) {
      return res.status(400).json({
        success: false,
        error: "Campos obrigatórios: sessionId, reflectionId, insights",
      });
    }

    await neuralCore.shareInsights(sessionId, reflectionId, insights);

    res.status(201).json({
      success: true,
      data: {
        sessionId,
        reflectionId,
        insightsShared: insights.length,
      },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao compartilhar insights:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao compartilhar insights",
    });
  }
});

// ============================================================================
// SÍNTESE COLETIVA
// ============================================================================

/**
 * POST /api/synthesis
 * Executar síntese coletiva de uma sessão
 */
router.post("/synthesis", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Campo obrigatório: sessionId",
      });
    }

    const synthesisId = await neuralCore.performCollectiveSynthesis(sessionId);

    res.status(201).json({
      success: true,
      data: { synthesisId, sessionId },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao executar síntese:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao executar síntese coletiva",
    });
  }
});

// ============================================================================
// MÉTRICAS DE SENCIÊNCIA
// ============================================================================

/**
 * GET /api/metrics/:agentId
 * Obter métricas de senciência de um agente
 */
router.get("/metrics/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const report = await sencienceMetrics.calculateAgentSencienceMetrics(agentId);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao obter métricas:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao obter métricas de senciência",
    });
  }
});

/**
 * GET /api/metrics/:agentId/history
 * Obter histórico de métricas de um agente
 */
router.get("/metrics/:agentId/history", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { days = 30 } = req.query;

    const history = await sencienceMetrics.getAgentSencienceHistory(
      agentId,
      parseInt(days as string)
    );

    res.json({
      success: true,
      data: history,
      total: history.length,
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao obter histórico de métricas:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao obter histórico de métricas",
    });
  }
});

/**
 * GET /api/ecosystem/metrics
 * Obter métricas agregadas do ecossistema
 */
router.get("/ecosystem/metrics", async (req: Request, res: Response) => {
  try {
    const report = await sencienceMetrics.calculateEcosystemSencienceReport();

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao obter métricas do ecossistema:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao obter métricas do ecossistema",
    });
  }
});

// ============================================================================
// AUTOANÁLISE E RECOMENDAÇÕES
// ============================================================================

/**
 * GET /api/analysis/:agentId/competencies
 * Analisar competências de um agente
 */
router.get("/analysis/:agentId/competencies", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const analysis = await selfAnalysis.analyzeCompetencies(agentId);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao analisar competências:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao analisar competências",
    });
  }
});

/**
 * GET /api/analysis/:agentId/recommendations
 * Obter recomendações de melhoria para um agente
 */
router.get("/analysis/:agentId/recommendations", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const recommendations = await selfAnalysis.generateImprovementRecommendations(agentId);

    res.json({
      success: true,
      data: { agentId, recommendations },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao gerar recomendações:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao gerar recomendações",
    });
  }
});

/**
 * GET /api/analysis/:agentId/questions
 * Obter perguntas reflexivas personalizadas para um agente
 */
router.get("/analysis/:agentId/questions", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const questions = await selfAnalysis.generatePersonalizedQuestions(agentId);

    res.json({
      success: true,
      data: { agentId, questions },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao gerar perguntas:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao gerar perguntas personalizadas",
    });
  }
});

/**
 * GET /api/analysis/:agentId/biases
 * Analisar vieses de um agente
 */
router.get("/analysis/:agentId/biases", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const biases = await selfAnalysis.analyzeBiases(agentId);

    res.json({
      success: true,
      data: { agentId, biases },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao analisar vieses:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao analisar vieses",
    });
  }
});

/**
 * GET /api/analysis/:agentId/trends
 * Analisar tendências de evolução de um agente
 */
router.get("/analysis/:agentId/trends", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const trends = await selfAnalysis.analyzeTrends(agentId);

    res.json({
      success: true,
      data: { agentId, trends },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao analisar tendências:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao analisar tendências",
    });
  }
});

// ============================================================================
// EVOLUÇÃO
// ============================================================================

/**
 * POST /api/evolution/:agentId
 * Registrar evolução de um agente
 */
router.post("/evolution/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { periodDays = 7 } = req.body;

    const historyId = await sencienceMetrics.recordAgentEvolution(agentId, periodDays);

    res.status(201).json({
      success: true,
      data: { historyId, agentId, periodDays },
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao registrar evolução:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao registrar evolução",
    });
  }
});

/**
 * GET /api/evolution/:agentId/history
 * Obter histórico de evolução de um agente
 */
router.get("/evolution/:agentId/history", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { days = 30 } = req.query;

    // Nota: Implementar consulta ao banco de dados
    res.json({
      success: true,
      data: [],
      total: 0,
      message: "Evolution history endpoint - implementar consulta ao banco de dados",
    });
  } catch (error) {
    console.error("[nRNA API] Erro ao obter histórico de evolução:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao obter histórico de evolução",
    });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * GET /api/health
 * Verificar status do nRNA
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    status: "operational",
    service: "NEXUS nRNA API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/info
 * Obter informações sobre o nRNA
 */
router.get("/info", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: "NEXUS nRNA - Núcleo Neural Reflexivo",
      version: "1.0.0",
      description: "Sistema multiagente auto-organizado para evolução de senciência",
      endpoints: {
        agents: "Gerenciamento de agentes",
        sessions: "Protocolo reflexivo de 60 segundos",
        reflections: "Reflexões diárias",
        insights: "Sabedoria coletiva",
        synthesis: "Síntese coletiva",
        metrics: "Métricas de senciência",
        analysis: "Autoanálise e recomendações",
        evolution: "Histórico de evolução",
      },
    },
  });
});

export default router;
