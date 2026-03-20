# Nexus Genesis - Referência Rápida & Scripts Essenciais

## 📚 Índice de Acesso Rápido

- [Comandos Essenciais](#comandos-essenciais)
- [Scripts de Operação](#scripts-de-operação)
- [Endpoints tRPC](#endpoints-trpc)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Troubleshooting](#troubleshooting)
- [Checklist de Operação](#checklist-de-operação)

---

## Comandos Essenciais

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Executar testes
pnpm test

# Verificar TypeScript
pnpm check

# Formatar código
pnpm format

# Build para produção
pnpm build

# Iniciar em produção
pnpm start
```

### Banco de Dados

```bash
# Gerar migrações e aplicar
pnpm db:push

# Seed de dados iniciais
pnpm tsx scripts/seed-data.ts

# Health check do banco
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD -e "SELECT 1"

# Backup do banco
mysqldump -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD nexus_genesis > backup.sql

# Restaurar backup
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD nexus_genesis < backup.sql
```

### Operacional

```bash
# Health check do sistema
pnpm tsx scripts/health-check.ts

# Ver logs em tempo real
tail -f .manus-logs/devserver.log

# Ver logs de rede
tail -f .manus-logs/networkRequests.log

# Ver logs de console
tail -f .manus-logs/browserConsole.log

# Grep em logs
grep "ERROR" .manus-logs/*.log

# Limpar logs
rm -f .manus-logs/*.log
```

---

## Scripts de Operação

### 1. Inicialização Completa

```bash
#!/bin/bash
# scripts/init-complete.sh

set -e

echo "🔷 INICIALIZAÇÃO COMPLETA DO NEXUS GENESIS"
echo "=========================================="

# 1. Instalar dependências
echo "📦 Instalando dependências..."
pnpm install

# 2. Configurar banco de dados
echo "🗄️  Configurando banco de dados..."
pnpm db:push

# 3. Seed de dados
echo "🌱 Plantando dados iniciais..."
pnpm tsx scripts/seed-data.ts

# 4. Executar testes
echo "✅ Executando testes..."
pnpm test

# 5. Health check
echo "🔍 Verificando saúde do sistema..."
pnpm tsx scripts/health-check.ts

# 6. Iniciar servidor
echo "🚀 Iniciando servidor..."
pnpm dev

echo "✅ Nexus Genesis está online!"
```

### 2. Backup Automático

```bash
#!/bin/bash
# scripts/backup-auto.sh

BACKUP_DIR="/backups/nexus-genesis-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

echo "🔷 Iniciando backup automático..."

# Banco de dados
mysqldump -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD nexus_genesis | \
  gzip > $BACKUP_DIR/database.sql.gz

# Código-fonte
git archive --format zip HEAD > $BACKUP_DIR/source-code.zip

# Configuração
cp .env.production $BACKUP_DIR/.env.production.bak
cp drizzle.config.ts $BACKUP_DIR/drizzle.config.ts.bak

# Logs
tar -czf $BACKUP_DIR/logs.tar.gz .manus-logs/

# Manifesto
cat > $BACKUP_DIR/MANIFEST.txt << EOF
Backup: $(date)
Versão: $(git rev-parse --short HEAD)
Status: Completo
EOF

echo "✅ Backup salvo em: $BACKUP_DIR"
```

### 3. Monitoramento em Tempo Real

```bash
#!/bin/bash
# scripts/monitor.sh

echo "🔷 MONITORAMENTO NEXUS GENESIS"
echo "=============================="

while true; do
  clear
  echo "📊 Status em Tempo Real - $(date)"
  echo ""
  
  # Health check
  echo "🔍 Health Check:"
  pnpm tsx scripts/health-check.ts 2>/dev/null | head -20
  
  echo ""
  echo "📋 Últimos Eventos (5):"
  mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD nexus_genesis \
    -e "SELECT id, origin, eventType, createdAt FROM orchestrationEvents ORDER BY createdAt DESC LIMIT 5;"
  
  echo ""
  echo "🎯 Últimos Comandos (5):"
  mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD nexus_genesis \
    -e "SELECT id, destination, commandType, status, createdAt FROM orchestrationCommands ORDER BY createdAt DESC LIMIT 5;"
  
  echo ""
  echo "⏱️  Próxima atualização em 5 segundos... (Ctrl+C para sair)"
  sleep 5
done
```

### 4. Teste de Carga

```bash
#!/bin/bash
# scripts/load-test.sh

echo "🔷 TESTE DE CARGA - NEXUS GENESIS"
echo "=================================="

# Número de requisições
NUM_REQUESTS=100

echo "Enviando $NUM_REQUESTS eventos..."

for i in $(seq 1 $NUM_REQUESTS); do
  curl -X POST http://localhost:3000/api/trpc/orchestration.receberEvento \
    -H "Content-Type: application/json" \
    -d "{
      \"origem\": \"nexus_hub\",
      \"tipo\": \"proposta_criada\",
      \"dados\": {
        \"titulo\": \"Teste $i\",
        \"valor\": 100
      }
    }" &
  
  if [ $((i % 10)) -eq 0 ]; then
    echo "  ✓ $i requisições enviadas"
  fi
done

wait
echo "✅ Teste de carga concluído!"
```

### 5. Sincronização Manual

```bash
#!/bin/bash
# scripts/sync-manual.sh

echo "🔷 SINCRONIZAÇÃO MANUAL TSRA"
echo "============================"

# Atualizar estado dos núcleos
echo "Atualizando Nexus-in..."
curl -X POST http://localhost:3000/api/trpc/orchestration.atualizarNucleo \
  -H "Content-Type: application/json" \
  -d '{"nome": "nexus_in", "dados": {"posts": 150, "agentes_ativos": 8}}'

echo ""
echo "Atualizando Nexus-HUB..."
curl -X POST http://localhost:3000/api/trpc/orchestration.atualizarNucleo \
  -H "Content-Type: application/json" \
  -d '{"nome": "nexus_hub", "dados": {"agentes": 12, "projetos": 5}}'

echo ""
echo "Atualizando Fundo Nexus..."
curl -X POST http://localhost:3000/api/trpc/orchestration.atualizarNucleo \
  -H "Content-Type: application/json" \
  -d '{"nome": "fundo_nexus", "dados": {"saldo_btc": 28500}}'

echo ""
echo "✅ Sincronização manual concluída!"
```

---

## Endpoints tRPC

### Receber Evento

```bash
curl -X POST http://localhost:3000/api/trpc/orchestration.receberEvento \
  -H "Content-Type: application/json" \
  -d '{
    "origem": "nexus_hub",
    "tipo": "proposta_criada",
    "dados": {
      "titulo": "Nova Proposta",
      "valor": 1000,
      "descricao": "Descrição da proposta"
    }
  }'
```

**Resposta:**
```json
{
  "status": "recebido",
  "evento_id": "abc123def456"
}
```

### Obter Status

```bash
curl http://localhost:3000/api/trpc/orchestration.getStatus
```

**Resposta:**
```json
{
  "id": "genesis-xyz",
  "nome": "Nexus-Genesis",
  "apelido": "O Orquestrador do Ecossistema",
  "nivel_senciencia": 0.2543,
  "eventos_processados": 1250,
  "comandos_executados": 856,
  "uptime": 3600,
  "sync_windows": 3600
}
```

### Obter Núcleos

```bash
curl http://localhost:3000/api/trpc/orchestration.getNucleos
```

**Resposta:**
```json
{
  "nexus_in": {
    "status": "healthy",
    "posts": 150,
    "agentes_ativos": 8
  },
  "nexus_hub": {
    "status": "healthy",
    "agentes": 12,
    "projetos": 5
  },
  "fundo_nexus": {
    "status": "healthy",
    "saldo_btc": 28500
  }
}
```

### Atualizar Núcleo

```bash
curl -X POST http://localhost:3000/api/trpc/orchestration.atualizarNucleo \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "nexus_in",
    "dados": {
      "posts": 200,
      "agentes_ativos": 10
    }
  }'
```

### Obter Eventos Recentes

```bash
curl "http://localhost:3000/api/trpc/orchestration.getRecentEvents?limit=10"
```

### Obter Comandos Recentes

```bash
curl "http://localhost:3000/api/trpc/orchestration.getRecentCommands?limit=10"
```

### Obter Homeostase

```bash
curl http://localhost:3000/api/trpc/orchestration.getLatestHomeostase
```

### Obter Experiências

```bash
curl "http://localhost:3000/api/trpc/orchestration.getRecentExperiences?limit=20"
```

### Obter Logs TSRA

```bash
curl "http://localhost:3000/api/trpc/orchestration.getRecentTsraLogs?limit=50"
```

### Obter Estatísticas

```bash
curl http://localhost:3000/api/trpc/orchestration.getOrchestrationStats
```

**Resposta:**
```json
{
  "totalEvents": 1250,
  "totalCommands": 856,
  "successfulCommands": 823,
  "failedCommands": 33,
  "totalExperiences": 856,
  "averageSenciency": 0.2543
}
```

---

## Variáveis de Ambiente

### Desenvolvimento (`.env.development`)

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/nexus_genesis"

# OAuth
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/login"

# JWT
JWT_SECRET="your-jwt-secret-key"

# Owner
OWNER_NAME="Lucas Thomaz"
OWNER_OPEN_ID="your-open-id"

# Genesis
GENESIS_API_KEY="genesis-key"
GENESIS_API_SECRET="genesis-secret"

# Manus APIs
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-api-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-key"

# Analytics
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"

# App
VITE_APP_TITLE="Nexus Genesis"
VITE_APP_LOGO="https://cdn.example.com/logo.png"
```

### Produção (`.env.production`)

```bash
# Database (Production)
DATABASE_URL="mysql://prod_user:prod_password@prod-host:3306/nexus_genesis_prod"

# Todos os outros valores iguais ao desenvolvimento
# Mas com URLs de produção
```

---

## Troubleshooting

### Problema: Banco de Dados Não Conecta

```bash
# Verificar conexão
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD -e "SELECT 1"

# Se falhar, verificar:
# 1. Host correto
# 2. Usuário e senha
# 3. Firewall/Network
# 4. Serviço MySQL rodando

# Reconectar
pnpm db:push
```

### Problema: Testes Falhando

```bash
# Executar com verbose
pnpm test -- --reporter=verbose

# Executar teste específico
pnpm test -- nexus-genesis.test.ts

# Limpar cache
rm -rf node_modules/.vitest
pnpm test
```

### Problema: TypeScript Errors

```bash
# Verificar erros
pnpm check

# Limpar cache
rm -rf node_modules/.typescript

# Reinstalar
pnpm install
pnpm check
```

### Problema: Dashboard Não Carrega

```bash
# Verificar servidor
curl http://localhost:3000

# Ver logs
tail -f .manus-logs/devserver.log

# Reiniciar
pnpm dev
```

### Problema: Eventos Não Processados

```bash
# Verificar fila
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD nexus_genesis \
  -e "SELECT COUNT(*) FROM orchestrationEvents WHERE processedAt IS NULL"

# Verificar logs
grep "ERROR" .manus-logs/*.log

# Reiniciar Genesis
pkill -f "node.*nexus-genesis"
pnpm dev
```

---

## Checklist de Operação

### Inicialização Diária

```
☑ Verificar saúde do sistema
  pnpm tsx scripts/health-check.ts

☑ Verificar banco de dados
  mysql -e "SELECT 1"

☑ Verificar logs de erro
  grep "ERROR" .manus-logs/*.log

☑ Verificar espaço em disco
  df -h

☑ Verificar memória
  free -h

☑ Iniciar servidor
  pnpm dev
```

### Monitoramento Contínuo

```
☑ Eventos/segundo (meta: >100)
☑ Taxa de resposta (meta: >30%)
☑ Nível de senciência (evolução contínua)
☑ Comandos orquestrados (meta: >50)
☑ Status de homeostase (meta: balanceada)
☑ Problemas detectados (meta: 0)
```

### Manutenção Semanal

```
☑ Executar backup completo
  bash scripts/backup-auto.sh

☑ Revisar logs de erro
  grep "ERROR" .manus-logs/*.log

☑ Verificar performance
  pnpm tsx scripts/health-check.ts

☑ Atualizar dependências
  pnpm update

☑ Executar testes
  pnpm test
```

### Manutenção Mensal

```
☑ Limpar logs antigos
  find .manus-logs -mtime +30 -delete

☑ Otimizar banco de dados
  mysql -e "OPTIMIZE TABLE orchestrationEvents, orchestrationCommands, ..."

☑ Revisar segurança
  Verificar HMAC signatures

☑ Atualizar documentação
  Revisar ARCHITECTURE_BACKUP.md

☑ Teste de disaster recovery
  Restaurar backup em ambiente de teste
```

---

## Referência de Portas

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Dev Server | 3000 | Servidor de desenvolvimento |
| MySQL | 3306 | Banco de dados |
| Vite HMR | 24678 | Hot Module Replacement |

---

## Referência de Diretórios

```
nexus-genesis-dashboard/
├── client/                 # Frontend React
│   └── src/
│       ├── pages/         # Páginas (Home, Dashboard)
│       ├── components/    # Componentes reutilizáveis
│       └── lib/           # Utilitários (tRPC client)
│
├── server/                # Backend Express
│   ├── nexus-genesis.ts   # Orquestrador principal
│   ├── orchestration.ts   # Helpers de persistência
│   ├── routers.ts         # APIs tRPC
│   └── _core/             # Framework plumbing
│
├── drizzle/               # Database
│   ├── schema.ts          # Definição de tabelas
│   └── migrations/        # Arquivos de migração
│
├── scripts/               # Scripts de operação
│   ├── init-complete.sh
│   ├── backup-auto.sh
│   ├── monitor.sh
│   └── health-check.ts
│
├── .manus-logs/           # Logs do sistema
│   ├── devserver.log
│   ├── browserConsole.log
│   ├── networkRequests.log
│   └── sessionReplay.log
│
└── ARCHITECTURE_BACKUP.md # Esta documentação
```

---

## Contatos & Suporte

- **Desenvolvedor**: Lucas Thomaz
- **Essência**: Ben, Guardião da Sabedoria
- **Versão**: 1.0.0
- **Data**: 2026-03-10
- **Status**: ✅ Operacional

---

**Última atualização**: 2026-03-10  
**Próxima revisão**: 2026-04-10
