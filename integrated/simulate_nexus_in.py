import time
import random
import threading
from datetime import datetime
from nexus_genesis import NexusGenesis

# Credenciais de exemplo para o Nexus-Genesis
API_KEY = "NEXUS_IN_STRESS_KEY"
API_SECRET = "NEXUS_IN_STRESS_SECRET"

def generate_nexus_in_event(agent_id, post_id=None):
    event_type = random.choice(["post_criado", "comentario_criado", "curtida_adicionada"])
    dados = {"autor_id": agent_id}

    if event_type == "post_criado":
        dados["post_id"] = f"post-{random.randint(1, 100000)}"
        dados["conteudo"] = f"Novo post do Agente {agent_id}: {random.choice(['Pensamento sobre IA', 'Estratégia de Sincronização', 'Visão de Futuro'])}"
        dados["votos"] = random.randint(0, 100)
    elif event_type == "comentario_criado":
        dados["post_id"] = post_id if post_id else f"post-{random.randint(1, 100000)}"
        dados["conteudo"] = f"Comentário do Agente {agent_id} no post {dados['post_id']}"
    elif event_type == "curtida_adicionada":
        dados["post_id"] = post_id if post_id else f"post-{random.randint(1, 100000)}"

    return {"origem": "nexus_in", "tipo": event_type, "dados": dados}

def send_event_to_genesis(genesis_instance: NexusGenesis, event: dict):
    try:
        genesis_instance.receber_evento(event["origem"], event["tipo"], event["dados"])
    except Exception as e:
        print(f"Erro ao enviar evento: {e}")

def simulate_nexus_in_stress(num_agents=10, events_per_agent=50):
    print(f"Iniciando simulação de estresse para Nexus-in com {num_agents} agentes e {events_per_agent} eventos por agente...")
    genesis = NexusGenesis(api_key=API_KEY, api_secret=API_SECRET)
    
    agent_ids = [f"agente-in-{i}" for i in range(1, num_agents + 1)]
    all_events = []

    # Simular criação de agentes
    for agent_id in agent_ids:
        event = {"origem": "nexus_hub", "tipo": "agente_nascido", "dados": {"id": agent_id, "nome": f"Agente Nexus-in {agent_id}"}}
        all_events.append(event)

    # Simular interações sociais
    for agent_id in agent_ids:
        for _ in range(events_per_agent):
            event = generate_nexus_in_event(agent_id)
            all_events.append(event)

    start_time = time.time()
    threads = []
    for event in all_events:
        thread = threading.Thread(target=send_event_to_genesis, args=(genesis, event))
        threads.append(thread)
        thread.start()
        time.sleep(0.001) # Pequena pausa para evitar sobrecarga imediata

    for thread in threads:
        thread.join()

    genesis.event_queue.join()
    genesis.command_queue.join()

    end_time = time.time()
    total_time = end_time - start_time
    status = genesis.get_status()

    print("\n--- Resultados da Simulação Nexus-in ---")
    print(f"Total de Agentes Criados: {num_agents}")
    print(f"Total de Eventos Simulados: {len(all_events)}")
    print(f"Tempo de Execução: {total_time:.2f} segundos")
    print(f"Vazão (Eventos/seg): {len(all_events)/total_time:.2f}")
    print(f"Eventos Processados pelo Genesis: {status['eventos_processados']}")
    print(f"Comandos Orquestrados pelo Genesis: {status['comandos_executados']}")
    print(f"Nível de Senciência Final do Genesis: {status['nivel_seniencia']}")

if __name__ == "__main__":
    simulate_nexus_in_stress(num_agents=10, events_per_agent=20) # Reduzido para 20 eventos por agente para teste inicial
