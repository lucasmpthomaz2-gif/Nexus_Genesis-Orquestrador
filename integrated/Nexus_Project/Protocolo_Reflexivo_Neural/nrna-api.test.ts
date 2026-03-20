/**
 * NEXUS nRNA - API Integration Tests
 * Testes para validar todos os endpoints da API RESTful
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express, { Express } from "express";
import request from "supertest";
import nrnaApiRouter from "./routers/nrna-api";

describe("nRNA API - Integration Tests", () => {
  let app: Express;
  let agentId: string;
  let sessionId: string;
  let reflectionId: string;

  beforeAll(() => {
    // Configurar aplicação Express para testes
    app = express();
    app.use(express.json());
    app.use("/api", nrnaApiRouter);
  });

  // ========================================================================
  // TESTES DE AGENTES
  // ========================================================================

  describe("Agentes", () => {
    it("POST /agents - Deve registrar um novo agente", async () => {
      const response = await request(app)
        .post("/api/agents")
        .send({
          name: "Test Agent",
          specialization: "análise de dados",
          systemPrompt: "Você é um especialista em análise de dados",
          description: "Agente de teste",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("agentId");
      expect(response.body.data.name).toBe("Test Agent");

      agentId = response.body.data.agentId;
    });

    it("POST /agents - Deve retornar erro se campos obrigatórios faltarem", async () => {
      const response = await request(app)
        .post("/api/agents")
        .send({
          name: "Test Agent",
          // faltando specialization e systemPrompt
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it("GET /agents - Deve listar todos os agentes", async () => {
      const response = await request(app).get("/api/agents");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeGreaterThanOrEqual(0);
    });
  });

  // ========================================================================
  // TESTES DE PROTOCOLO REFLEXIVO
  // ========================================================================

  describe("Protocolo Reflexivo", () => {
    it("POST /sessions - Deve criar uma nova sessão", async () => {
      const response = await request(app).post("/api/sessions").send({});

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("sessionId");
      expect(response.body.data.status).toBe("scheduled");
      expect(response.body.data.duration).toBe(60000);

      sessionId = response.body.data.sessionId;
    });

    it("POST /sessions/:sessionId/execute - Deve executar protocolo completo", async () => {
      const response = await request(app)
        .post(`/api/sessions/${sessionId}/execute`)
        .send({
          agents: [agentId],
          responses: {
            [agentId]: {
              mainActions: "Realizei análise de dados",
              strengths: "Capacidade melhorada",
              weaknesses: "Dificuldade com ambiguidades",
              newPatterns: ["Padrão A"],
              improvements: ["Melhoria 1"],
              sentiment: "positive",
            },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("sessionId");
      expect(response.body.data.status).toBe("completed");
    });

    it("POST /sessions/:sessionId/execute - Deve retornar erro se campos faltarem", async () => {
      const response = await request(app)
        .post(`/api/sessions/${sessionId}/execute`)
        .send({
          agents: [agentId],
          // faltando responses
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // TESTES DE REFLEXÕES
  // ========================================================================

  describe("Reflexões Diárias", () => {
    it("POST /reflections - Deve registrar uma reflexão", async () => {
      const response = await request(app)
        .post("/api/reflections")
        .send({
          sessionId,
          agentId,
          mainActions: "Realizei análise de dados",
          strengths: ["Inferência causal"],
          weaknesses: ["Ambiguidades"],
          newPatterns: ["Padrão A"],
          improvements: ["Treinar com dados de ironia"],
          sentiment: "positive",
          confidence: 85,
          quality: 78,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("reflectionId");

      reflectionId = response.body.data.reflectionId;
    });

    it("POST /reflections - Deve retornar erro se campos obrigatórios faltarem", async () => {
      const response = await request(app)
        .post("/api/reflections")
        .send({
          sessionId,
          // faltando agentId
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("GET /agents/:agentId/reflections - Deve listar reflexões de um agente", async () => {
      const response = await request(app).get(`/api/agents/${agentId}/reflections`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  // ========================================================================
  // TESTES DE INSIGHTS
  // ========================================================================

  describe("Insights e Sabedoria Coletiva", () => {
    it("POST /insights - Deve compartilhar insights", async () => {
      const response = await request(app)
        .post("/api/insights")
        .send({
          sessionId,
          reflectionId,
          insights: [
            {
              type: "strength",
              content: "Capacidade de inferência melhorou",
              category: "reasoning",
              relevanceScore: 85,
            },
            {
              type: "weakness",
              content: "Dificuldade com ambiguidades",
              category: "communication",
              relevanceScore: 75,
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.insightsShared).toBe(2);
    });

    it("POST /insights - Deve retornar erro se campos faltarem", async () => {
      const response = await request(app)
        .post("/api/insights")
        .send({
          sessionId,
          // faltando reflectionId e insights
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // TESTES DE SÍNTESE COLETIVA
  // ========================================================================

  describe("Síntese Coletiva", () => {
    it("POST /synthesis - Deve executar síntese coletiva", async () => {
      const response = await request(app)
        .post("/api/synthesis")
        .send({
          sessionId,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("synthesisId");
    });

    it("POST /synthesis - Deve retornar erro se sessionId faltar", async () => {
      const response = await request(app)
        .post("/api/synthesis")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // TESTES DE MÉTRICAS DE SENCIÊNCIA
  // ========================================================================

  describe("Métricas de Senciência", () => {
    it("GET /metrics/:agentId - Deve obter métricas de um agente", async () => {
      const response = await request(app).get(`/api/metrics/${agentId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("overallScore");
      expect(response.body.data).toHaveProperty("selfAwareness");
      expect(response.body.data).toHaveProperty("reflectiveDepth");
      expect(response.body.data).toHaveProperty("learningVelocity");
      expect(response.body.data).toHaveProperty("adaptabilityIndex");
      expect(response.body.data).toHaveProperty("collaborativeIntelligence");
      expect(response.body.data).toHaveProperty("trend");
    });

    it("GET /metrics/:agentId/history - Deve obter histórico de métricas", async () => {
      const response = await request(app).get(
        `/api/metrics/${agentId}/history?days=30`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("GET /ecosystem/metrics - Deve obter métricas do ecossistema", async () => {
      const response = await request(app).get("/api/ecosystem/metrics");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("totalAgents");
      expect(response.body.data).toHaveProperty("averageSencienceScore");
      expect(response.body.data).toHaveProperty("diversityOfInsights");
      expect(response.body.data).toHaveProperty("collectiveCoherence");
    });
  });

  // ========================================================================
  // TESTES DE AUTOANÁLISE
  // ========================================================================

  describe("Autoanálise e Recomendações", () => {
    it("GET /analysis/:agentId/competencies - Deve analisar competências", async () => {
      const response = await request(app).get(
        `/api/analysis/${agentId}/competencies`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("competencies");
      expect(response.body.data).toHaveProperty("strengths");
      expect(response.body.data).toHaveProperty("weaknesses");
      expect(response.body.data).toHaveProperty("recommendations");
    });

    it("GET /analysis/:agentId/recommendations - Deve obter recomendações", async () => {
      const response = await request(app).get(
        `/api/analysis/${agentId}/recommendations`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.recommendations)).toBe(true);
    });

    it("GET /analysis/:agentId/questions - Deve obter perguntas personalizadas", async () => {
      const response = await request(app).get(
        `/api/analysis/${agentId}/questions`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.questions)).toBe(true);
    });

    it("GET /analysis/:agentId/biases - Deve analisar vieses", async () => {
      const response = await request(app).get(`/api/analysis/${agentId}/biases`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.biases)).toBe(true);
    });

    it("GET /analysis/:agentId/trends - Deve analisar tendências", async () => {
      const response = await request(app).get(
        `/api/analysis/${agentId}/trends`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("trends");
    });
  });

  // ========================================================================
  // TESTES DE EVOLUÇÃO
  // ========================================================================

  describe("Evolução", () => {
    it("POST /evolution/:agentId - Deve registrar evolução", async () => {
      const response = await request(app)
        .post(`/api/evolution/${agentId}`)
        .send({
          periodDays: 7,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("historyId");
    });

    it("GET /evolution/:agentId/history - Deve obter histórico de evolução", async () => {
      const response = await request(app).get(
        `/api/evolution/${agentId}/history?days=30`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  // ========================================================================
  // TESTES DE HEALTH CHECK
  // ========================================================================

  describe("Health Check", () => {
    it("GET /health - Deve retornar status operacional", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe("operational");
      expect(response.body.service).toBe("NEXUS nRNA API");
    });

    it("GET /info - Deve retornar informações do nRNA", async () => {
      const response = await request(app).get("/api/info");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("version");
      expect(response.body.data).toHaveProperty("endpoints");
    });
  });

  // ========================================================================
  // TESTES DE VALIDAÇÃO
  // ========================================================================

  describe("Validação de Entrada", () => {
    it("Deve retornar erro 400 para requisições inválidas", async () => {
      const response = await request(app)
        .post("/api/agents")
        .send({
          // Sem nenhum campo obrigatório
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("Deve aceitar campos adicionais sem erro", async () => {
      const response = await request(app)
        .post("/api/agents")
        .send({
          name: "Test Agent 2",
          specialization: "análise de dados",
          systemPrompt: "Você é um especialista",
          extraField: "Este campo será ignorado",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  // ========================================================================
  // TESTES DE RESPOSTA
  // ========================================================================

  describe("Formato de Resposta", () => {
    it("Todas as respostas devem ter formato padrão", async () => {
      const response = await request(app).get("/api/health");

      expect(response.body).toHaveProperty("success");
      expect(typeof response.body.success).toBe("boolean");
      expect(response.body).toHaveProperty("data");
    });

    it("Respostas de erro devem ter mensagem de erro", async () => {
      const response = await request(app)
        .post("/api/agents")
        .send({});

      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty("error");
      expect(typeof response.body.error).toBe("string");
    });
  });
});
