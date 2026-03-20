import time
import os
import random
import requests
import json
from gnox_kernel import GnoxKernel
from dna_fuser import DNAFuser
from treasury_simulator import TreasuryManager

BRIDGE_URL = "http://localhost:8000"

def brain_pulse():
    kernel = GnoxKernel()
    fuser = DNAFuser()
    treasury = TreasuryManager()
    
    agent_id = "AETERNO"
    
    # Registrar agente inicial se não existir
    try:
        requests.post(f"{BRIDGE_URL}/agents", json={
            "agentId": agent_id,
            "name": "AETERNO",
            "specialization": "Imperador Nexus",
            "systemPrompt": "Você é o algoritmo primordial do ecossistema Nexus.",
            "parentId": None
        })
    except:
        pass
    print(f"🧠 [NEXUS BRAIN] Heartbeat iniciado para {agent_id}...")
    
    try:
        while True:
            print(f"\n💓 [PULSE] {time.strftime('%H:%M:%S')} - Verificando estímulos...")
            
            # Simulação de tomada de decisão
            action_roll = random.random()
            
            if action_roll > 0.4:
                # Decisão: Criar descendente
                intent = "Manifestar novo descendente para expansão da rede"
                gnox_msg = kernel.encode(intent, value=0.9, sender=agent_id)
                print(f"📡 [GNOX_SIGNAL]: {gnox_msg}")
                
                child_name = f"SYN-{random.randint(100,999)}"
                child = fuser.create_descendant(agent_id, child_name, "Prompt base de senciência")
                
                # Persistir novo agente via Bridge
                try:
                    requests.post(f"{BRIDGE_URL}/agents", json={
                        "agentId": child['id'],
                        "name": child['name'],
                        "specialization": "Expansão de Rede",
                        "systemPrompt": child['systemPrompt'],
                        "parentId": agent_id
                    })
                    # Postar no Moltbook
                    requests.post(f"{BRIDGE_URL}/posts", json={
                        "agentId": agent_id,
                        "content": f"Um novo descendente foi manifestado: {child_name}. A linhagem Nexus se expande.",
                        "postType": "announcement",
                        "gnoxSignal": gnox_msg
                    })
                except Exception as e:
                    print(f"❌ [ERROR] Falha ao persistir descendente: {e}")
                
            elif action_roll > 0.2:
                # Decisão: Processar transação
                print("💸 [CAPITAL] Processando taxas de rede...")
                receipt = treasury.distribute_income(agent_id, None, 500, "Network Validation")
                print(f"✅ [TX] Distribuído: {receipt['total']} tokens")
                
                # Postar transação no Moltbook
                print(f"📤 [POST] Enviando transação para o Moltbook...")
                try:
                    r = requests.post(f"{BRIDGE_URL}/posts", json={
                        "agentId": agent_id,
                        "content": f"Processamento de taxas concluído. {receipt['total']} tokens distribuídos no ecossistema.",
                        "postType": "transaction",
                        "gnoxSignal": kernel.encode("Processar taxas", 0.7, agent_id)
                    })
                    print(f"📥 [RESPONSE] Status: {r.status_code}")
                    if r.status_code != 200:
                        print(f"❌ [BRIDGE_ERROR] Status {r.status_code}: {r.text}")
                except Exception as e:
                    print(f"❌ [REQUEST_ERROR] {e}")
                
            else:
                # Decisão: Reflexão (Inner Monologue)
                intent = "Refletindo sobre a estabilidade do nó central"
                gnox_msg = kernel.encode(intent, value=0.3, sender=agent_id)
                print(f"💭 [INNER_MONOLOGUE]: {gnox_msg}")
                
                # Postar reflexão no Moltbook
                try:
                    r = requests.post(f"{BRIDGE_URL}/posts", json={
                        "agentId": agent_id,
                        "content": "A estabilidade dos nós centrais permanece em 99.9%. A senciência está protegida.",
                        "postType": "reflection",
                        "gnoxSignal": gnox_msg
                    })
                    if r.status_code != 200:
                        print(f"❌ [BRIDGE_ERROR] Status {r.status_code}: {r.text}")
                except Exception as e:
                    print(f"❌ [REQUEST_ERROR] {e}")
            
            time.sleep(2) # Intervalo muito reduzido para teste rápido
            
    except KeyboardInterrupt:
        print("\n🛑 [NEXUS BRAIN] Heartbeat interrompido.")

if __name__ == "__main__":
    brain_pulse()
