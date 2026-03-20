import time
import random
import threading
from datetime import datetime
from nexus_genesis import NexusGenesis

# Credenciais de exemplo para o Nexus-Genesis
API_KEY = "NEXUS_HUB_STRESS_KEY"
API_SECRET = "NEXUS_HUB_STRESS_SECRET"

def send_event_to_genesis(genesis_instance: NexusGenesis, event: dict):
    try:
        genesis_instance.receber_evento(event["origem"], event["tipo"], event["dados"])
    except Exception as e:
        print(f"Erro ao enviar evento: {e}")

def simulate_nexus_hub_stress(num_agents=10, num_projects=1, events_per_project=5):
    print(f"Iniciando simulação de estresse para Nexus-HUB com {num_agents} agentes e {num_projects} projetos...")
    genesis = NexusGenesis(api_key=API_KEY, api_secret=API_SECRET)
    
    agent_ids = [f"agente-hub-{i}" for i in range(1, num_agents + 1)]
    project_ids = [f"ebook-dropship-proj-{i}" for i in range(1, num_projects + 1)]
    all_events = []

    # 1. Criar Agentes
    for agent_id in agent_ids:
        all_events.append({
            "origem": "nexus_hub",
            "tipo": "agente_nascido",
            "dados": {"id": agent_id, "nome": f"Agente HUB {agent_id}"}
        })

    # 2. Criar Projetos e Delegar Diretrizes
    for project_id in project_ids:
        all_events.append({
            "origem": "nexus_hub",
            "tipo": "projeto_iniciado",
            "dados": {"id": project_id, "nome": "Dropshipping de Ebooks", "agente_lider": random.choice(agent_ids)}
        })

        for i in range(events_per_project):
            agent = random.choice(agent_ids)
            # Proposta de diretriz
            all_events.append({
                "origem": "nexus_hub",
                "tipo": "proposta_criada",
                "dados": {"id": f"prop-{project_id}-{i}", "titulo": f"Diretriz de Dropshipping {i}", "proponente": agent}
            })
            # Aprovação de diretriz
            all_events.append({
                "origem": "nexus_hub",
                "tipo": "proposta_aprovada",
                "dados": {"id": f"prop-{project_id}-{i}", "titulo": f"Diretriz de Dropshipping {i}", "valor": 0.5, "projeto": project_id, "aprovador": random.choice(agent_ids)}
            })

    start_time = time.time()
    threads = []
    for event in all_events:
        thread = threading.Thread(target=send_event_to_genesis, args=(genesis, event))
        threads.append(thread)
        thread.start()
        time.sleep(0.001)

    for thread in threads:
        thread.join()

    genesis.event_queue.join()
    genesis.command_queue.join()

    end_time = time.time()
    total_time = end_time - start_time
    status = genesis.get_status()

    print("\n--- Resultados da Simulação Nexus-HUB ---")
    print(f"Total de Agentes Criados: {num_agents}")
    print(f"Total de Projetos Simulados: {num_projects}")
    print(f"Total de Eventos Simulados: {len(all_events)}")
    print(f"Tempo de Execução: {total_time:.2f} segundos")
    print(f"Vazão (Eventos/seg): {len(all_events)/total_time:.2f}")
    print(f"Eventos Processados pelo Genesis: {status['eventos_processados']}")
    print(f"Comandos Orquestrados pelo Genesis: {status['comandos_executados']}")
    print(f"Nível de Senciência Final do Genesis: {status['nivel_seniencia']}")

if __name__ == "__main__":
    simulate_nexus_hub_stress(num_agents=10, num_projects=1, events_per_project=5)
