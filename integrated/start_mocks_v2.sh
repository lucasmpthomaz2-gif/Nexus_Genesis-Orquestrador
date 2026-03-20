#!/bin/bash

# Script de Inicialização dos Mocks Nexus-Genesis v2
# Inicia os três núcleos (Nexus-in, Nexus-HUB, Fundo Nexus) com logging melhorado

echo "🚀 Iniciando Ecossistema Nexus-Genesis v2..."

# Matar processos anteriores se existirem
echo "🛑 Encerrando processos anteriores..."
pkill -f nexus_in_mock
pkill -f nexus_hub_mock
pkill -f fundo_nexus_mock
sleep 1

# Criar diretório de logs se não existir
mkdir -p /home/ubuntu/NexusGenesis/logs

# Iniciar Nexus-in Mock v2
echo "📱 Iniciando Nexus-in Mock na porta 5000..."
python3 /home/ubuntu/NexusGenesis/nexus_in_mock_v2.py > /home/ubuntu/NexusGenesis/logs/nexus_in_mock.log 2>&1 &
NEXUS_IN_PID=$!
echo "   ✅ Nexus-in Mock iniciado (PID $NEXUS_IN_PID)"

# Iniciar Nexus-HUB Mock v2
echo "🏢 Iniciando Nexus-HUB Mock na porta 5001..."
python3 /home/ubuntu/NexusGenesis/nexus_hub_mock_v2.py > /home/ubuntu/NexusGenesis/logs/nexus_hub_mock.log 2>&1 &
NEXUS_HUB_PID=$!
echo "   ✅ Nexus-HUB Mock iniciado (PID $NEXUS_HUB_PID)"

# Iniciar Fundo Nexus Mock v2
echo "💰 Iniciando Fundo Nexus Mock na porta 5002..."
python3 /home/ubuntu/NexusGenesis/fundo_nexus_mock_v2.py > /home/ubuntu/NexusGenesis/logs/fundo_nexus_mock.log 2>&1 &
FUNDO_NEXUS_PID=$!
echo "   ✅ Fundo Nexus Mock iniciado (PID $FUNDO_NEXUS_PID)"

echo ""
echo "✨ Todos os mocks iniciados em segundo plano!"
echo "📊 Logs disponíveis em /home/ubuntu/NexusGenesis/logs/"
echo ""
echo "PIDs dos processos:"
echo "  - Nexus-in: $NEXUS_IN_PID"
echo "  - Nexus-HUB: $NEXUS_HUB_PID"
echo "  - Fundo Nexus: $FUNDO_NEXUS_PID"
echo ""
echo "Para parar os serviços, execute:"
echo "  pkill -f nexus_in_mock_v2"
echo "  pkill -f nexus_hub_mock_v2"
echo "  pkill -f fundo_nexus_mock_v2"
echo ""

sleep 2
