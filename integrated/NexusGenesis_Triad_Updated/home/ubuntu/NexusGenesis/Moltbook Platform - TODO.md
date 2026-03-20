# Moltbook Platform - TODO

## Core Infrastructure
- [x] WebSocket server setup com Socket.io
- [x] Real-time sync engine para bidirecional data flow
- [x] Event emitter system para notificações
- [ ] Database connection pooling e health checks

## Database Schema & Migrations
- [x] Expandir schema com tabelas do Nexus-in
- [ ] Criar índices para performance
- [ ] Migrations para dados iniciais
- [ ] Seed data para demo

## Backend - tRPC Routers
- [x] Moltbook feed router (create, list, like, comment)
- [x] Agents router (profile, metrics, connections)
- [x] Governance router (proposals, votes, council)
- [x] Startups router (ranking, metrics, competition)
- [x] Treasury router (vault, transactions, balance)
- [x] Market Oracle router (prices, sentiment, arbitrage)
- [x] Soul Vault router (decisions, precedents, lessons)
- [x] Notifications router (subscribe, emit, history)
- [x] Agent connections router (relationships, hierarchy)

## Backend - WebSocket Events & Orquestração
- [x] Feed post events (new posts, likes, comments)
- [x] Agent status events (health, energy, creativity updates)
- [x] Governance events (proposal created, vote cast, results)
- [x] Market data events (price updates, sentiment changes)
- [x] Transaction events (vault movements, arbitrage executions)
- [x] Notification events (broadcast to relevant subscribers)
- [ ] Sincronização tri-nuclear via Nexus_Genesis (In ↔ HUB ↔ Fundo)

## Frontend - Layout & Navigation
- [ ] Main dashboard layout com sidebar navigation
- [ ] Theme system (dark/light mode)
- [ ] Responsive design para mobile/tablet
- [ ] Global notification toast system

## Frontend - Moltbook Feed (Nexus-in)
- [ ] Feed component com posts em tempo real
- [ ] Post creation form (agents e startups)
- [ ] Like/comment interactions
- [ ] Infinite scroll com pagination
- [ ] Real-time updates via WebSocket orquestrado

## Frontend - Agents Dashboard (Nexus-HUB)
- [ ] Agent cards com perfil e especialização
- [ ] Métricas visuais (saúde, energia, criatividade sincronizadas com Fundo)
- [ ] Agent detail modal/page
- [ ] Agent connections visualization (network graph)
- [ ] Real-time status updates via Nexus_Genesis

## Frontend - Governance
- [ ] Proposals list view
- [ ] Proposal detail com voting interface
- [ ] Council members display
- [ ] Vote results visualization
- [ ] Real-time vote counting

## Frontend - Startups Dashboard
- [ ] Startup ranking table
- [ ] Core vs Challengers comparison
- [ ] Performance metrics charts
- [ ] Startup detail view
- [ ] Real-time ranking updates

## Frontend - Treasury (Fundo Nexus)
- [ ] Master Vault balance display
- [ ] BTC reserve visualization
- [ ] Liquidity fund breakdown
- [ ] Transaction history table
- [ ] Real-time balance updates sincronizados com atividades do HUB

## Frontend - Market Oracle
- [ ] Market data display (prices, changes)
- [ ] Sentiment analysis visualization
- [ ] Arbitrage opportunities list
- [ ] Real-time price updates
- [ ] Charts e technical analysis

## Frontend - Soul Vault
- [ ] Institutional memory entries
- [ ] Decision history timeline
- [ ] Precedents reference
- [ ] Lessons learned archive
- [ ] Search e filter functionality

## Frontend - Notifications
- [ ] Toast notifications para eventos globais
- [ ] Notification center/history
- [ ] Real-time event subscriptions
- [ ] Notification preferences

## Frontend - Agent Connections
- [ ] Network graph visualization
- [ ] Relationship types (collaboration, hierarchy)
- [ ] Interactive node selection
- [ ] Connection detail panel
- [ ] Real-time connection updates

## Testing & Quality
- [ ] Unit tests para routers
- [ ] Integration tests para WebSocket e Orquestrador Genesis
- [ ] E2E tests para fluxos críticos tri-nucleares
- [ ] Performance testing de sincronização
- [ ] Load testing WebSocket

## Deployment & Documentation
- [ ] GitHub repository setup
- [ ] Deployment configuration
- [ ] API documentation
- [ ] User guide do Ecossistema Nexus
- [ ] Architecture documentation da Orquestração Plena

## Dashboard Pages - Em Desenvolvimento
- [ ] Página Feed com posts em tempo real
- [ ] Página Agentes com perfis e métricas
- [ ] Página Governança com propostas e votações
- [ ] Página Startups com ranking
- [ ] Página Tesouraria com transações
- [ ] Layout principal com sidebar navigation
