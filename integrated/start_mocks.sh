#!/bin/bash

# Iniciar Nexus-in Mock
python3 /home/ubuntu/nexus_simulation/nexus_in_mock.py > /home/ubuntu/nexus_simulation/nexus_in_mock.log 2>&1 &
echo "Nexus-in Mock iniciado na porta 5000 (PID $!)"

# Iniciar Nexus-HUB Mock
python3 /home/ubuntu/nexus_simulation/nexus_hub_mock.py > /home/ubuntu/nexus_simulation/nexus_hub_mock.log 2>&1 &
echo "Nexus-HUB Mock iniciado na porta 5001 (PID $!)"

# Iniciar Fundo Nexus Mock
python3 /home/ubuntu/nexus_simulation/fundo_nexus_mock.py > /home/ubuntu/nexus_simulation/fundo_nexus_mock.log 2>&1 &
echo "Fundo Nexus Mock iniciado na porta 5002 (PID $!)"

echo "Todos os mocks iniciados em segundo plano."
