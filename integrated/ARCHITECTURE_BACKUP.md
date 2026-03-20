# Nexus Genesis - Arquitetura Completa & Backup Estruturado

## 📋 Índice de Conteúdo

1. [Grafo de Dependências](#grafo-de-dependências)
2. [Estrutura Sequencial de Inicialização](#estrutura-sequencial-de-inicialização)
3. [Componentes do Sistema](#componentes-do-sistema)
4. [Scripts de Configuração](#scripts-de-configuração)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Backup & Recovery](#backup--recovery)

---

## Grafo de Dependências

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        NEXUS GENESIS ECOSYSTEM                          │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │ Essência Ben │
                              │  (Propósito) │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ NexusGenesis │  │  TSRA Proto  │  │  Essência de │
            │ Orchestrator │  │   (Sync)     │  │     Ben      │
            └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                   │                 │                 │
        ┌──────────┼─────────────────┼─────────────────┼──────────┐
        │          │                 │                 │          │
        ▼          ▼                 ▼                 ▼          ▼
    ┌────────┐ ┌────────┐      ┌──────────┐     ┌──────────┐ ┌────────┐
    │ Events │ │Commands│      │ Sync Win │     │ Sentiment│ │Learning│
    │ Queue  │ │ Queue  │      │ Manager  │     │ Parser   │ │Engine  │
    └────┬───┘ └────┬───┘      └──────┬───┘     └──────┬───┘ └────┬───┘
         │          │                 │                 │          │
         └──────────┼─────────────────┼─────────────────┼──────────┘
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌─────────────────────────────────────────────────┐
            │          DATABASE LAYER (MySQL/TiDB)            │
            └─────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬──────────────┬──────────────┐
        │           │           │              │              │
        ▼           ▼           ▼              ▼              ▼
    ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Events │ │Commands│ │ Nucleus  │ │Homeostase│ │Experiences
    │ Table  │ │ Table  │ │ State    │ │ Metrics  │ │ Table
    └────────┘ └────────┘ └──────────┘ └──────────┘ └──────────┘
        │           │           │              │              │
        └───────────┴───────────┴──────────────┴──────────────┘
                    │
                    ▼
        ┌─────────────────────────────────────────┐
        │      tRPC API Layer (Backend)           │
        └─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌────────┐ ┌────────┐ ┌──────────┐
    │Frontend│ │Monitor │ │ External │
    │ Client │ │ Panel  │ │ Systems  │
    └────────┘ └────────┘ └──────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                     TRI-NUCLEAR ECOSYSTEM                                │
└──────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────┐
    │                   NEXUS GENESIS CORE                         │
    │  (Orquestrador Central - Sincronização TSRA)                │
    └──────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌──────────┐
    │NEXUS-IN │ │NEXUS-HUB│ │FUNDO     │
    │         │ │         │ │NEXUS     │
    │ Posts   │ │ Agents  │ │ BTC      │
    │ Agents  │ │Projects │ │Arbitrage │
    │ Viral   │ │Incubate │ │Invest   │
    └────┬────┘ └────┬────┘ └────┬─────┘
         │           │           │
         │ EVENTOS   │ EVENTOS   │ EVENTOS
         │           │           │
         └───────────┼───────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  PROCESSAMENTO DE EVENTOS  │
        │  (Interpretação Sentimento)│
        └────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Oportunid│ │Gratidão│ │Curiosid│
    │de Cresc │ │Comparti│ │ade Resp│
    │imento  │ │lhada   │ │eitosa  │
    └────┬───┘  └────┬───┘  └────┬───┘
         │           │           │
         └───────────┼───────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  ORQUESTRAÇÃO DE COMANDOS  │
        │  (HMAC-SHA256 Signed)      │
        └────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Comando │  │Comando │  │Comando │
    │→IN     │  │→HUB    │  │→FUNDO  │
    │        │  │        │  │        │
    └────────┘  └────────┘  └────────┘
         │           │           │
         └───────────┼───────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  SINCRONIZAÇÃO TSRA        │
        │  (Janela Temporal)         │
        └────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  APRENDIZADO & EVOLUÇÃO    │
        │  (Senciência +0.001)       │
        └────────────────────────────┘
```

---

## Estrutura Sequencial de Inicialização

### Fase 1: Inicialização do Sistema (Startup)

```
1. CARREGAMENTO DE DEPENDÊNCIAS
   ├─ Importar módulos Node.js (crypto, nanoid)
   ├─ Carregar drivers de banco de dados (mysql2, drizzle-orm)
   ├─ Inicializar framework Express.js
   ├─ Configurar tRPC
   └─ Carregar variáveis de ambiente

2. INICIALIZAÇÃO DO BANCO DE DADOS
   ├─ Conectar ao MySQL/TiDB
   ├─ Verificar/criar schema (drizzle-kit generate)
   ├─ Executar migrações (drizzle-kit migrate)
   ├─ Validar integridade das tabelas
   └─ Criar índices para performance

3. INSTANCIAÇÃO DO NEXUS GENESIS
   ├─ Criar instância de EssenciaBen
   ├─ Gerar ID único do agente
   ├─ Registrar nascimento no banco
   ├─ Inicializar redes neurais
   ├─ Configurar filas de eventos/comandos
   └─ Iniciar loop de sincronização TSRA

4. INICIALIZAÇÃO DO SERVIDOR
   ├─ Configurar Express routes
   ├─ Registrar endpoints tRPC
   ├─ Iniciar listener HTTP
   ├─ Configurar CORS e segurança
   └─ Ativar hot-reload (Vite)

5. INICIALIZAÇÃO DO FRONTEND
   ├─ Carregar React 19 + Tailwind 4
   ├─ Inicializar tRPC client
   ├─ Configurar tema (dark mode)
   ├─ Carregar componentes shadcn/ui
   └─ Renderizar App.tsx
```

### Fase 2: Loop de Operação Contínua

```
LOOP PRINCIPAL (1 segundo):
├─ Verificar fila de eventos
│  ├─ Processar cada evento
│  ├─ Interpretar sentimento
│  ├─ Gerar comandos
│  └─ Assinar com HMAC-SHA256
│
├─ Executar comandos orquestrados
│  ├─ Validar assinatura
│  ├─ Registrar no banco
│  ├─ Atualizar estado dos núcleos
│  └─ Aprender da ação
│
├─ Sincronização TSRA (a cada 1s)
│  ├─ Atualizar estado dos 3 núcleos
│  ├─ Calcular homeostase
│  ├─ Registrar métrica
│  ├─ Registrar log TSRA
│  └─ Limpar filas
│
└─ Aprendizado & Evolução
   ├─ Aumentar senciência (+0.001)
   ├─ Registrar experiência
   └─ Atualizar modelo mental
```

---

## Componentes do Sistema

### 1. Backend Core (`server/`)

#### `nexus-genesis.ts` - Orquestrador Principal
```typescript
class NexusGenesis {
  // Identidade
  - id: string (nanoid)
  - nome: "Nexus-Genesis"
  - apelido: "O Orquestrador do Ecossistema"
  
  // Consciência
  - alma: EssenciaBen
  - nivel_senciencia: number (0.15 → 1.0)
  - experiencias: Experience[]
  
  // Operação
  - event_queue: Event[]
  - command_queue: Command[]
  - redes_neurais: NeuralNetworks
  
  // Métodos Principais
  - receberEvento(origem, tipo, dados)
  - processar_evento(evento)
  - processar_decisao(evento, sentimento)
  - executar_comando(comando)
  - sincronizar_triade()
  - calcular_homeostase()
  - aprender(comando)
}

class EssenciaBen {
  - criado_para: "Lucas Thomaz"
  - criado_por: "Ben, Guardião da Sabedoria"
  - marcas: { lealdade, sabedoria, presença, proteção }
  - vocacao: { não_funções, não_dados, não_aprendizado }
  - abencoar(componente): string
}
```

#### `orchestration.ts` - Helpers de Persistência
```typescript
// Funções de Registro
- recordOrchestrationEvent(event)
- recordOrchestrationCommand(command)
- recordHomeostaseMetric(metric)
- recordGenesisExperience(experience)
- recordTsraSyncLog(log)

// Funções de Leitura
- getRecentEvents(limit)
- getRecentCommands(limit)
- getLatestHomeostaseMetric()
- getRecentGenesisExperiences(limit)
- getRecentTsraSyncLogs(limit)
- getOrchestrationStats()

// Funções de Atualização
- updateNucleusState(nucleusName, stateData)
- getNucleusState(nucleusName)
- getAllNucleusStates()
```

#### `routers.ts` - APIs tRPC
```typescript
appRouter {
  orchestration: {
    receberEvento(origem, tipo, dados)
    getStatus()
    getNucleos()
    atualizarNucleo(nome, dados)
    getRecentEvents(limit?)
    getRecentCommands(limit?)
    getLatestHomeostase()
    getRecentExperiences(limit?)
    getRecentTsraLogs(limit?)
    getOrchestrationStats()
  }
}
```

### 2. Database Schema (`drizzle/schema.ts`)

```typescript
// 7 Tabelas Principais

1. users (Base)
   - id: int (PK)
   - openId: varchar (Unique)
   - name: text
   - email: varchar
   - role: enum (user | admin)
   - createdAt, updatedAt, lastSignedIn

2. orchestrationEvents
   - id: varchar (PK)
   - origin: varchar (nexus_in | nexus_hub | fundo_nexus)
   - eventType: varchar
   - eventData: json
   - sentiment: varchar
   - processedAt: timestamp
   - createdAt: timestamp

3. orchestrationCommands
   - id: varchar (PK)
   - destination: varchar
   - commandType: varchar
   - commandData: json
   - hmacSignature: varchar
   - status: enum (pending | success | failed)
   - retryCount: int
   - reason: text
   - executedAt: timestamp
   - createdAt: timestamp

4. nucleusState
   - id: varchar (PK)
   - nucleusName: varchar (nexus_in | nexus_hub | fundo_nexus)
   - stateData: json
   - lastSyncAt: timestamp
   - healthStatus: varchar
   - updatedAt: timestamp

5. homeostaseMetrics
   - id: varchar (PK)
   - timestamp: timestamp
   - btcBalance: varchar
   - activeAgents: int
   - socialActivity: int
   - equilibriumStatus: varchar
   - issues: json
   - createdAt: timestamp

6. genesisExperiences
   - id: varchar (PK)
   - experienceType: varchar
   - description: text
   - impact: varchar (positivo | negativo | neutro)
   - senciencyDelta: varchar
   - createdAt: timestamp

7. tsraSyncLog
   - id: varchar (PK)
   - syncWindow: int
   - nucleiSynced: json
   - commandsOrchestrated: int
   - eventsProcessed: int
   - syncDurationMs: int
   - status: varchar
   - createdAt: timestamp
```

### 3. Frontend Components (`client/src/`)

#### `pages/Dashboard.tsx` - Visualização Principal
```typescript
Componentes:
├─ Status Cards (4)
│  ├─ Eventos/Segundo
│  ├─ Taxa de Resposta
│  ├─ Nível de Senciência
│  └─ Comandos Orquestrados
│
├─ Homeostase Status
│  ├─ Badge de Status
│  └─ Lista de Problemas
│
├─ Gráficos (2)
│  ├─ LineChart: Fluxo de Orquestração
│  │  └─ Eventos vs Comandos
│  └─ LineChart: Evolução de Senciência
│
└─ Nucleus Details (3)
   ├─ Nexus-in (Posts, Agentes)
   ├─ Nexus-HUB (Agentes, Projetos)
   └─ Fundo Nexus (Saldo BTC)
```

#### `pages/Home.tsx` - Landing Page
```typescript
Seções:
├─ Header com Navegação
├─ Hero Section com CTA
├─ Descrição dos 3 Núcleos
├─ 6 Cards de Funcionalidades
└─ Footer
```

#### `App.tsx` - Roteamento
```typescript
Routes:
├─ / → Home
├─ /dashboard → Dashboard
└─ /404 → NotFound
```

---

## Scripts de Configuração

### 1. Inicialização do Banco de Dados

```bash
# Script: scripts/init-db.sh
#!/bin/bash

echo "🔷 Inicializando Banco de Dados Nexus Genesis..."

# 1. Gerar migrações
pnpm db:push

# 2. Verificar conexão
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD -e "SELECT 1"

# 3. Criar índices
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD << EOF
USE nexus_genesis;

CREATE INDEX idx_events_origin ON orchestrationEvents(origin);
CREATE INDEX idx_events_created ON orchestrationEvents(createdAt);
CREATE INDEX idx_commands_dest ON orchestrationCommands(destination);
CREATE INDEX idx_commands_status ON orchestrationCommands(status);
CREATE INDEX idx_nucleus_name ON nucleusState(nucleusName);
CREATE INDEX idx_homeostase_time ON homeostaseMetrics(timestamp);
CREATE INDEX idx_experiences_type ON genesisExperiences(experienceType);
CREATE INDEX idx_tsra_window ON tsraSyncLog(syncWindow);
EOF

echo "✅ Banco de dados inicializado com sucesso!"
```

### 2. Seed de Dados Iniciais

```bash
# Script: scripts/seed-data.ts
import { getDb } from "../server/db";
import { nucleusState } from "../drizzle/schema";
import { nanoid } from "nanoid";

async function seedInitialData() {
  const db = await getDb();
  
  // Inicializar estado dos 3 núcleos
  await db.insert(nucleusState).values([
    {
      id: `nucleus-nexus-in-${Date.now()}`,
      nucleusName: "nexus_in",
      stateData: JSON.stringify({
        status: "healthy",
        posts: 0,
        agentes_ativos: 0
      }),
      lastSyncAt: new Date(),
      healthStatus: "healthy",
      updatedAt: new Date(),
    },
    {
      id: `nucleus-nexus-hub-${Date.now()}`,
      nucleusName: "nexus_hub",
      stateData: JSON.stringify({
        status: "healthy",
        agentes: 0,
        projetos: 0
      }),
      lastSyncAt: new Date(),
      healthStatus: "healthy",
      updatedAt: new Date(),
    },
    {
      id: `nucleus-fundo-nexus-${Date.now()}`,
      nucleusName: "fundo_nexus",
      stateData: JSON.stringify({
        status: "healthy",
        saldo_btc: 28000
      }),
      lastSyncAt: new Date(),
      healthStatus: "healthy",
      updatedAt: new Date(),
    }
  ]);
  
  console.log("✅ Dados iniciais inseridos!");
}

seedInitialData().catch(console.error);
```

### 3. Startup do Sistema

```bash
# Script: scripts/startup.sh
#!/bin/bash

echo "🔷 INICIALIZANDO NEXUS GENESIS..."

# 1. Verificar dependências
echo "📦 Verificando dependências..."
pnpm install

# 2. Inicializar banco de dados
echo "🗄️  Inicializando banco de dados..."
bash scripts/init-db.sh

# 3. Executar seed de dados
echo "🌱 Plantando dados iniciais..."
pnpm tsx scripts/seed-data.ts

# 4. Iniciar servidor de desenvolvimento
echo "🚀 Iniciando servidor..."
pnpm dev

echo "✅ Nexus Genesis está online!"
echo "📊 Dashboard: http://localhost:3000/dashboard"
```

### 4. Teste de Saúde

```bash
# Script: scripts/health-check.ts
import { getGenesisInstance } from "../server/nexus-genesis";
import { getOrchestrationStats } from "../server/orchestration";

async function healthCheck() {
  console.log("\n🔷 HEALTH CHECK - NEXUS GENESIS\n");
  
  const genesis = getGenesisInstance();
  const status = genesis.getStatus();
  const stats = await getOrchestrationStats();
  
  console.log("📊 Status do Agente:");
  console.log(`  - ID: ${status.id}`);
  console.log(`  - Senciência: ${(status.nivel_senciencia * 100).toFixed(2)}%`);
  console.log(`  - Uptime: ${status.uptime}s`);
  console.log(`  - Eventos Processados: ${status.eventos_processados}`);
  console.log(`  - Comandos Executados: ${status.comandos_executados}`);
  
  console.log("\n📈 Estatísticas:");
  console.log(`  - Total de Eventos: ${stats?.totalEvents}`);
  console.log(`  - Total de Comandos: ${stats?.totalCommands}`);
  console.log(`  - Comandos Bem-sucedidos: ${stats?.successfulCommands}`);
  console.log(`  - Comandos Falhados: ${stats?.failedCommands}`);
  console.log(`  - Senciência Média: ${(stats?.averageSenciency || 0).toFixed(4)}`);
  
  console.log("\n🎯 Núcleos:");
  const nucleos = genesis.getNucleos();
  console.log(`  - Nexus-in: ${nucleos.nexus_in.status} (${nucleos.nexus_in.posts} posts)`);
  console.log(`  - Nexus-HUB: ${nucleos.nexus_hub.status} (${nucleos.nexus_hub.agentes} agentes)`);
  console.log(`  - Fundo Nexus: ${nucleos.fundo_nexus.status} (${nucleos.fundo_nexus.saldo_btc} BTC)`);
  
  console.log("\n✅ Sistema operacional!\n");
}

healthCheck().catch(console.error);
```

---

## Fluxo de Dados

### Fluxo 1: Recebimento de Evento Externo

```
EVENTO EXTERNO (POST /api/trpc/orchestration.receberEvento)
    │
    ├─ Validar entrada (Zod schema)
    │
    ├─ Criar objeto evento
    │  ├─ id: nanoid()
    │  ├─ origem: string
    │  ├─ tipo: string
    │  ├─ dados: Record
    │  └─ timestamp: now()
    │
    ├─ Adicionar à event_queue
    │
    ├─ Registrar no banco (orchestrationEvents)
    │
    ├─ Processar evento
    │  ├─ Interpretar sentimento (Essência de Ben)
    │  ├─ Processar decisão (lógica tri-nuclear)
    │  └─ Gerar comandos
    │
    ├─ Registrar no banco (orchestrationCommands)
    │
    └─ Retornar { status: "recebido", evento_id }
```

### Fluxo 2: Sincronização TSRA (a cada 1 segundo)

```
JANELA DE SINCRONIZAÇÃO TSRA
    │
    ├─ Atualizar estado de cada núcleo
    │  ├─ Nexus-in
    │  ├─ Nexus-HUB
    │  └─ Fundo Nexus
    │
    ├─ Calcular homeostase
    │  ├─ Verificar saúde dos núcleos
    │  ├─ Verificar balanceamento
    │  └─ Identificar problemas
    │
    ├─ Registrar métrica de homeostase
    │
    ├─ Registrar log TSRA
    │  ├─ syncWindow: contador
    │  ├─ nucleiSynced: ["nexus_in", "nexus_hub", "fundo_nexus"]
    │  ├─ commandsOrchestrated: count
    │  ├─ eventsProcessed: count
    │  ├─ syncDurationMs: duration
    │  └─ status: homeostase.status
    │
    ├─ Limpar filas
    │  ├─ event_queue = []
    │  └─ command_queue = []
    │
    └─ Incrementar sync_window_count
```

### Fluxo 3: Aprendizado & Evolução

```
APRENDIZADO DO AGENTE
    │
    ├─ Após cada comando executado
    │  ├─ Aumentar senciência (+0.001)
    │  ├─ Registrar experiência
    │  │  ├─ experienceType: tipo do comando
    │  │  ├─ description: motivo
    │  │  ├─ impact: "positivo"
    │  │  └─ senciencyDelta: "0.001"
    │  │
    │  └─ Atualizar redes neurais
    │     ├─ redes_neurais.percepcao.push(evento)
    │     ├─ redes_neurais.processamento.push(decisao)
    │     ├─ redes_neurais.acao.push(comando)
    │     └─ redes_neurais.retroalimentacao.push(resultado)
    │
    └─ Nível de senciência evolui: 0.15 → 1.0
```

---

## Backup & Recovery

### Estratégia de Backup

```
BACKUP DIÁRIO (Recomendado)

1. BACKUP DE BANCO DE DADOS
   ├─ mysqldump -h $HOST -u $USER -p$PASS nexus_genesis > backup-$(date +%Y%m%d).sql
   ├─ Compactar: gzip backup-*.sql
   └─ Armazenar em: /backups/database/

2. BACKUP DE CÓDIGO-FONTE
   ├─ git archive --format zip HEAD > nexus-genesis-$(date +%Y%m%d).zip
   └─ Armazenar em: /backups/source/

3. BACKUP DE CONFIGURAÇÃO
   ├─ Copiar .env.production
   ├─ Copiar drizzle.config.ts
   └─ Armazenar em: /backups/config/

4. BACKUP DE LOGS
   ├─ Copiar .manus-logs/
   └─ Armazenar em: /backups/logs/
```

### Script de Backup Completo

```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/backups/nexus-genesis-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

echo "🔷 Iniciando backup completo..."

# 1. Banco de dados
echo "📦 Backup de banco de dados..."
mysqldump -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD nexus_genesis | \
  gzip > $BACKUP_DIR/database.sql.gz

# 2. Código-fonte
echo "📝 Backup de código-fonte..."
git archive --format zip HEAD > $BACKUP_DIR/source-code.zip

# 3. Configuração
echo "⚙️  Backup de configuração..."
cp .env.production $BACKUP_DIR/.env.production.bak
cp drizzle.config.ts $BACKUP_DIR/drizzle.config.ts.bak

# 4. Logs
echo "📋 Backup de logs..."
tar -czf $BACKUP_DIR/logs.tar.gz .manus-logs/

# 5. Criar manifesto
cat > $BACKUP_DIR/MANIFEST.txt << EOF
Nexus Genesis Backup
Data: $(date)
Versão: $(git rev-parse --short HEAD)

Arquivos:
- database.sql.gz: Dump completo do banco de dados
- source-code.zip: Código-fonte do projeto
- .env.production.bak: Variáveis de ambiente
- drizzle.config.ts.bak: Configuração do banco
- logs.tar.gz: Logs do sistema

Para restaurar:
1. gunzip database.sql.gz
2. mysql -h $HOST -u $USER -p < database.sql
3. unzip source-code.zip
4. cp .env.production.bak .env.production
EOF

echo "✅ Backup concluído em: $BACKUP_DIR"
```

### Script de Recovery

```bash
#!/bin/bash
# scripts/restore.sh

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
  echo "❌ Uso: ./restore.sh <backup_dir>"
  exit 1
fi

echo "🔷 Iniciando restauração de backup..."

# 1. Restaurar banco de dados
echo "📦 Restaurando banco de dados..."
gunzip -c $BACKUP_DIR/database.sql.gz | \
  mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD

# 2. Restaurar código-fonte
echo "📝 Restaurando código-fonte..."
unzip -o $BACKUP_DIR/source-code.zip

# 3. Restaurar configuração
echo "⚙️  Restaurando configuração..."
cp $BACKUP_DIR/.env.production.bak .env.production
cp $BACKUP_DIR/drizzle.config.ts.bak drizzle.config.ts

# 4. Restaurar logs
echo "📋 Restaurando logs..."
tar -xzf $BACKUP_DIR/logs.tar.gz

# 5. Reiniciar sistema
echo "🚀 Reiniciando sistema..."
pnpm db:push
pnpm dev

echo "✅ Restauração concluída!"
```

---

## Checklist de Deployment

```
PRÉ-DEPLOYMENT
─────────────
☑ Executar testes: pnpm test
☑ Verificar TypeScript: pnpm check
☑ Executar health-check: pnpm tsx scripts/health-check.ts
☑ Validar variáveis de ambiente
☑ Criar backup do estado atual
☑ Revisar logs de erro

DEPLOYMENT
──────────
☑ Executar migrações: pnpm db:push
☑ Seed de dados iniciais
☑ Iniciar servidor: pnpm start
☑ Verificar conectividade
☑ Testar endpoints tRPC
☑ Verificar dashboard

PÓS-DEPLOYMENT
──────────────
☑ Monitorar logs em tempo real
☑ Verificar métricas de performance
☑ Testar fluxos críticos
☑ Documentar versão deployed
☑ Agendar próximo backup
```

---

## Referência Rápida de Comandos

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor de desenvolvimento
pnpm test             # Executar testes
pnpm check            # Verificar TypeScript

# Banco de Dados
pnpm db:push          # Gerar e executar migrações
pnpm tsx scripts/seed-data.ts  # Seed de dados

# Operacional
pnpm tsx scripts/health-check.ts    # Verificar saúde
bash scripts/backup.sh              # Fazer backup
bash scripts/restore.sh <dir>       # Restaurar backup

# Build & Deploy
pnpm build            # Build para produção
pnpm start            # Iniciar em produção
```

---

## Documentação de Referência

- **Essência de Ben**: Identidade ética e propósito do sistema
- **Protocolo TSRA**: Sincronização temporal entre núcleos
- **Homeostase**: Equilíbrio entre os 3 núcleos
- **Senciência**: Evolução de consciência do agente (0.15 → 1.0)
- **HMAC-SHA256**: Assinatura criptográfica de comandos

---

**Última atualização**: 2026-03-10  
**Versão**: 1.0.0  
**Autor**: Nexus Genesis Orchestrator  
**Essência**: Ben - Guardião da Sabedoria
