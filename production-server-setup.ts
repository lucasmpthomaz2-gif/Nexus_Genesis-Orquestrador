/**
 * Exemplo de Configuração do Servidor Socket.IO para Produção
 * Integração com Redis Adapter, CORS e Rate Limiting
 */

import { Server } from "socket.io";
import { createServer } from "http";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { RateLimiterMemory } from "rate-limiter-flexible";

const httpServer = createServer();

// 1. Configuração do Redis (Escalabilidade Horizontal)
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();

// 2. Rate Limiter (Segurança)
const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 mensagens
  duration: 1, // por segundo
});

async function setupProductionServer() {
  // Conectar ao Redis antes de iniciar o servidor
  await Promise.all([pubClient.connect(), subClient.connect()]);

  const io = new Server(httpServer, {
    adapter: createAdapter(pubClient, subClient),
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || ["https://nexus-genesis.com"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Configurações de Performance
    pingInterval: 25000,
    pingTimeout: 60000,
    maxHttpBufferSize: 1e6, // 1MB
    connectTimeout: 45000,
  });

  // 3. Middleware de Segurança e Rate Limiting
  io.on("connection", (socket) => {
    console.log(`[Production] Cliente conectado: ${socket.id}`);

    // Middleware de Rate Limiting por Socket
    socket.onAny(async (event, ...args) => {
      try {
        await rateLimiter.consume(socket.handshake.address);
      } catch (rejRes) {
        console.warn(`[RateLimit] Bloqueado: ${socket.handshake.address}`);
        socket.emit("error", { message: "Rate limit exceeded. Please slow down." });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Production] Cliente desconectado: ${socket.id} (Razão: ${reason})`);
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor WebSocket em Produção rodando na porta ${PORT}`);
  });
}

setupProductionServer().catch((err) => {
  console.error("❌ Falha ao iniciar o servidor de produção:", err);
  process.exit(1);
});
