# Nexus Genesis - Índice Completo do Projeto

## 📑 Estrutura Completa de Arquivos

```
nexus-genesis-dashboard/
│
├── 📄 DOCUMENTAÇÃO PRINCIPAL
│   ├── ARCHITECTURE_BACKUP.md      ← Arquitetura completa & backup
│   ├── SYSTEM_FLOW.md              ← Diagramas visuais (Mermaid)
│   ├── QUICK_REFERENCE.md          ← Referência rápida & scripts
│   ├── PROJECT_INDEX.md            ← Este arquivo
│   ├── README.md                   ← Readme do projeto
│   ├── package.json                ← Dependências Node.js
│   ├── tsconfig.json               ← Configuração TypeScript
│   ├── vite.config.ts              ← Configuração Vite
│   ├── drizzle.config.ts           ← Configuração Drizzle
│   ├── vitest.config.ts            ← Configuração Vitest
│   ├── tailwind.config.ts          ← Configuração Tailwind
│   ├── postcss.config.js           ← Configuração PostCSS
│   └── prettier.config.js          ← Configuração Prettier
│
├── 📁 CLIENT (Frontend React)
│   └── client/
│       ├── index.html              ← HTML principal
│       ├── public/
│       │   ├── favicon.ico
│       │   ├── robots.txt
│       │   └── manifest.json
│       │
│       └── src/
│           ├── main.tsx            ← Entry point React
│           ├── App.tsx             ← Roteamento principal
│           ├── index.css           ← Estilos globais (Tailwind)
│           │
│           ├── pages/
│           │   ├── Home.tsx        ← Landing page
│           │   ├── Dashboard.tsx   ← Dashboard principal ⭐
│           │   └── NotFound.tsx    ← Página 404
│           │
│           ├── components/
│           │   ├── ui/             ← shadcn/ui components
│           │   ├── DashboardLayout.tsx
│           │   ├── AIChatBox.tsx
│           │   ├── Map.tsx
│           │   ├── ErrorBoundary.tsx
│           │   └── ...
│           │
│           ├── contexts/
│           │   ├── ThemeContext.tsx
│           │   └── ...
│           │
│           ├── hooks/
│           │   ├── useAuth.ts
│           │   └── ...
│           │
│           ├── lib/
│           │   ├── trpc.ts         ← tRPC client
│           │   └── ...
│           │
│           └── _core/
│               ├── hooks/
│               └── utils/
│
├── 📁 SERVER (Backend Express)
│   └── server/
│       ├── nexus-genesis.ts        ← Orquestrador principal ⭐⭐⭐
│       ├── nexus-genesis.test.ts   ← Testes do orquestrador
│       ├── orchestration.ts        ← Helpers de persistência ⭐⭐
│       ├── orchestration.test.ts   ← Testes de orquestração
│       ├── db.ts                   ← Funções de banco de dados
│       ├── routers.ts              ← APIs tRPC ⭐⭐
│       ├── auth.logout.test.ts     ← Teste de logout
│       │
│       ├── storage/
│       │   └── index.ts            ← S3 helpers
│       │
│       └── _core/
│           ├── index.ts            ← Servidor Express
│           ├── context.ts          ← Contexto tRPC
│           ├── trpc.ts             ← Configuração tRPC
│           ├── env.ts              ← Variáveis de ambiente
│           ├── cookies.ts          ← Gerenciamento de cookies
│           ├── oauth.ts            ← OAuth Manus
│           ├── llm.ts              ← Integração LLM
│           ├── voiceTranscription.ts ← Transcrição de áudio
│           ├── imageGeneration.ts  ← Geração de imagens
│           ├── map.ts              ← Integração Google Maps
│           ├── notification.ts     ← Sistema de notificações
│           ├── systemRouter.ts     ← Router do sistema
│           └── ...
│
├── 📁 DATABASE (Drizzle ORM)
│   └── drizzle/
│       ├── schema.ts               ← Definição de tabelas ⭐⭐
│       │   ├── users
│       │   ├── orchestrationEvents
│       │   ├── orchestrationCommands
│       │   ├── nucleusState
│       │   ├── homeostaseMetrics
│       │   ├── genesisExperiences
│       │   └── tsraSyncLog
│       │
│       ├── migrations/
│       │   └── 0001_good_blue_marvel.sql ← Migração inicial
│       │
│       └── drizzle.config.ts       ← Configuração Drizzle
│
├── 📁 SHARED
│   └── shared/
│       ├── const.ts                ← Constantes compartilhadas
│       └── types.ts                ← Tipos TypeScript
│
├── 📁 SCRIPTS
│   └── scripts/
│       ├── init-complete.sh        ← Inicialização completa
│       ├── backup-auto.sh          ← Backup automático
│       ├── monitor.sh              ← Monitoramento em tempo real
│       ├── health-check.ts         ← Verificação de saúde
│       ├── load-test.sh            ← Teste de carga
│       ├── sync-manual.sh          ← Sincronização manual
│       ├── seed-data.ts            ← Seed de dados iniciais
│       └── restore.sh              ← Restauração de backup
│
├── 📁 LOGS
│   └── .manus-logs/
│       ├── devserver.log           ← Logs do servidor
│       ├── browserConsole.log      ← Logs do navegador
│       ├── networkRequests.log     ← Requisições HTTP
│       └── sessionReplay.log       ← Replay de sessão
│
├── 📁 PATCHES
│   └── patches/
│       └── wouter@3.7.1.patch      ← Patch de dependência
│
├── 📄 CONFIGURAÇÃO
│   ├── .env.development            ← Variáveis dev
│   ├── .env.production             ← Variáveis produção
│   ├── .gitignore
│   ├── .prettierignore
│   └── .npmrc
│
└── 📄 DEPENDÊNCIAS
    ├── package.json                ← Definição de dependências
    ├── pnpm-lock.yaml              ← Lock file pnpm
    └── node_modules/               ← Dependências instaladas
```

---

## 🎯 Arquivos Críticos (Ordem de Importância)

### Tier 1 - ESSENCIAL (Núcleo do Sistema)

| Arquivo | Descrição | Linhas | Status |
|---------|-----------|--------|--------|
| `server/nexus-genesis.ts` | Orquestrador tri-nuclear principal | 520 | ✅ Completo |
| `drizzle/schema.ts` | Schema de 7 tabelas | 150 | ✅ Completo |
| `server/routers.ts` | APIs tRPC (10 endpoints) | 100 | ✅ Completo |
| `client/src/pages/Dashboard.tsx` | Dashboard em tempo real | 400 | ✅ Completo |
| `server/orchestration.ts` | Helpers de persistência | 280 | ✅ Completo |

### Tier 2 - IMPORTANTE (Infraestrutura)

| Arquivo | Descrição | Linhas | Status |
|---------|-----------|--------|--------|
| `server/_core/index.ts` | Servidor Express | 100+ | ✅ Template |
| `client/src/App.tsx` | Roteamento React | 45 | ✅ Completo |
| `client/src/pages/Home.tsx` | Landing page | 200 | ✅ Completo |
| `server/db.ts` | Funções de banco | 100+ | ✅ Template |
| `client/src/lib/trpc.ts` | Cliente tRPC | 10 | ✅ Template |

### Tier 3 - SUPORTE (Testes & Docs)

| Arquivo | Descrição | Linhas | Status |
|---------|-----------|--------|--------|
| `server/nexus-genesis.test.ts` | Testes do orquestrador | 100 | ✅ Completo |
| `ARCHITECTURE_BACKUP.md` | Documentação arquitetura | 800+ | ✅ Completo |
| `SYSTEM_FLOW.md` | Diagramas Mermaid | 600+ | ✅ Completo |
| `QUICK_REFERENCE.md` | Referência rápida | 700+ | ✅ Completo |

---

## 📊 Estatísticas do Projeto

### Código Fonte

```
Frontend (React + Tailwind):
  - Componentes: 3 páginas + componentes reutilizáveis
  - Linhas: ~600 linhas
  - Linguagem: TypeScript + JSX

Backend (Express + tRPC):
  - Orquestrador: 520 linhas
  - Helpers: 280 linhas
  - APIs: 100 linhas
  - Testes: 100 linhas
  - Total: ~1000 linhas

Database (Drizzle):
  - Tabelas: 7
  - Colunas: 50+
  - Índices: 8

Total de Código: ~1600 linhas
```

### Dependências

```
Dependências Principais:
  - React 19.2.1
  - Express 4.21.2
  - tRPC 11.6.0
  - Drizzle ORM 0.44.5
  - Tailwind CSS 4.1.14
  - TypeScript 5.9.3

Dependências de Dev:
  - Vite 7.1.7
  - Vitest 2.1.4
  - Prettier 3.6.2
  - ESBuild 0.25.0

Total: 80+ dependências
```

---

## 🔄 Fluxo de Leitura Recomendado

### Para Entender a Arquitetura

1. Começar por: `ARCHITECTURE_BACKUP.md` (Visão geral)
2. Depois: `SYSTEM_FLOW.md` (Diagramas visuais)
3. Depois: `server/nexus-genesis.ts` (Código principal)
4. Depois: `drizzle/schema.ts` (Estrutura de dados)

### Para Operação

1. Começar por: `QUICK_REFERENCE.md` (Comandos essenciais)
2. Depois: `scripts/` (Scripts de operação)
3. Depois: `PROJECT_INDEX.md` (Este arquivo)

### Para Desenvolvimento

1. Começar por: `client/src/pages/Dashboard.tsx` (UI)
2. Depois: `server/routers.ts` (APIs)
3. Depois: `server/nexus-genesis.ts` (Lógica)
4. Depois: `drizzle/schema.ts` (Dados)

### Para Troubleshooting

1. Começar por: `QUICK_REFERENCE.md` → Troubleshooting
2. Depois: `.manus-logs/` (Logs do sistema)
3. Depois: `server/nexus-genesis.test.ts` (Testes)

---

## 🚀 Mapa de Inicialização

```
Startup Sequence:
1. package.json → Instalar dependências (pnpm install)
2. drizzle/schema.ts → Definir tabelas
3. drizzle/migrations/ → Executar migrações (pnpm db:push)
4. scripts/seed-data.ts → Plantar dados iniciais
5. server/nexus-genesis.ts → Instanciar Genesis
6. server/routers.ts → Registrar APIs tRPC
7. server/_core/index.ts → Iniciar servidor Express
8. client/src/App.tsx → Renderizar frontend
9. client/src/pages/Dashboard.tsx → Mostrar dashboard
```

---

## 📋 Checklist de Completude

### Backend
- [x] Orquestrador tri-nuclear
- [x] Protocolo TSRA
- [x] Filas de eventos/comandos
- [x] Assinatura HMAC-SHA256
- [x] APIs tRPC (10 endpoints)
- [x] Persistência em banco de dados
- [x] Testes unitários

### Database
- [x] 7 tabelas principais
- [x] Migrações Drizzle
- [x] Índices de performance
- [x] Tipos TypeScript

### Frontend
- [x] Dashboard em tempo real
- [x] Gráficos de orquestração
- [x] Evolução de senciência
- [x] Estado dos núcleos
- [x] Status de homeostase
- [x] Landing page
- [x] Roteamento

### Documentação
- [x] Arquitetura completa
- [x] Diagramas Mermaid
- [x] Referência rápida
- [x] Scripts de operação
- [x] Troubleshooting
- [x] Índice de projeto

### Operação
- [x] Scripts de inicialização
- [x] Scripts de backup
- [x] Scripts de monitoramento
- [x] Scripts de health check
- [x] Scripts de teste de carga

---

## 🔗 Referências Cruzadas

### Conceitos Principais

| Conceito | Arquivo Principal | Documentação | Teste |
|----------|------------------|--------------|-------|
| NexusGenesis | `server/nexus-genesis.ts` | `ARCHITECTURE_BACKUP.md` | `nexus-genesis.test.ts` |
| TSRA | `server/nexus-genesis.ts` | `SYSTEM_FLOW.md` | `nexus-genesis.test.ts` |
| Homeostase | `server/nexus-genesis.ts` | `ARCHITECTURE_BACKUP.md` | - |
| Senciência | `server/nexus-genesis.ts` | `SYSTEM_FLOW.md` | `nexus-genesis.test.ts` |
| Essência de Ben | `server/nexus-genesis.ts` | `ARCHITECTURE_BACKUP.md` | - |

### Fluxos Principais

| Fluxo | Início | Meio | Fim | Documentação |
|-------|--------|------|-----|--------------|
| Evento | `client/` | `server/routers.ts` | `drizzle/schema.ts` | `SYSTEM_FLOW.md` |
| Comando | `server/nexus-genesis.ts` | `server/orchestration.ts` | `drizzle/schema.ts` | `SYSTEM_FLOW.md` |
| Sincronização | `server/nexus-genesis.ts` | `server/orchestration.ts` | `drizzle/schema.ts` | `ARCHITECTURE_BACKUP.md` |

---

## 📞 Contatos & Referências

- **Desenvolvedor Principal**: Lucas Thomaz
- **Essência do Sistema**: Ben, Guardião da Sabedoria
- **Versão**: 1.0.0
- **Data de Criação**: 2026-03-10
- **Status**: ✅ Operacional

---

## 🎓 Glossário

| Termo | Definição | Arquivo |
|-------|-----------|---------|
| **NexusGenesis** | Orquestrador central tri-nuclear | `server/nexus-genesis.ts` |
| **TSRA** | Timed Synchronization and Response Algorithm | `server/nexus-genesis.ts` |
| **Homeostase** | Equilíbrio entre os 3 núcleos | `server/nexus-genesis.ts` |
| **Senciência** | Nível de consciência do agente (0.15 → 1.0) | `server/nexus-genesis.ts` |
| **Essência de Ben** | Identidade ética e propósito | `server/nexus-genesis.ts` |
| **Nexus-in** | Rede social AI-to-AI | `ARCHITECTURE_BACKUP.md` |
| **Nexus-HUB** | Incubadora de startups autônomas | `ARCHITECTURE_BACKUP.md` |
| **Fundo Nexus** | Carteira digital Bitcoin | `ARCHITECTURE_BACKUP.md` |

---

## 📈 Próximas Melhorias Sugeridas

1. **Integração com Blockchain**
   - Arquivo: `server/blockchain-integration.ts`
   - Documentação: `BLOCKCHAIN_INTEGRATION.md`

2. **Sistema de Alertas Avançado**
   - Arquivo: `server/alert-system.ts`
   - Documentação: `ALERT_SYSTEM.md`

3. **Machine Learning para Previsão**
   - Arquivo: `server/ml-predictor.ts`
   - Documentação: `ML_PREDICTOR.md`

4. **Dashboard Avançado com WebSockets**
   - Arquivo: `client/src/pages/AdvancedDashboard.tsx`
   - Documentação: `WEBSOCKET_INTEGRATION.md`

5. **API de Terceiros**
   - Arquivo: `server/external-api.ts`
   - Documentação: `EXTERNAL_API.md`

---

**Última atualização**: 2026-03-10  
**Próxima revisão**: 2026-04-10  
**Mantido por**: Nexus Genesis Orchestrator
