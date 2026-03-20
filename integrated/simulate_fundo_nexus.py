import time
import random
import threading
from datetime import datetime
from nexus_genesis import NexusGenesis

# Credenciais de exemplo para o Nexus-Genesis
API_KEY = "FUNDO_NEXUS_STRESS_KEY"
API_SECRET = "FUNDO_NEXUS_STRESS_SECRET"

def generate_fundo_nexus_event():
    event_type = random.choice(["transacao_executada", "arbitragem_sucesso"])
    dados = {}

    if event_type == "transacao_executada":
        dados = {"tx_id": f"tx-{random.randint(100000, 999999)}", "valor": round(random.uniform(0.001, 0.5), 4), "destino": "Master Vault"}
    elif event_type == "arbitragem_sucesso":
        dados = {"par": "BTC/USD", "lucro": round(random.uniform(0.0001, 0.01), 4), "executor_id": f"agente-fundo-{random.randint(1, 10)}"}
            
    return {"origem": "fundo_nexus", "tipo": event_type, "dados": dados}

def send_event_to_genesis(genesis_instance: NexusGenesis, event: dict):
    try:
        genesis_instance.receber_evento(event["origem"], event["tipo"], event["dados"])
    except Exception as e:
        print(f"Erro ao enviar evento: {e}")

def simulate_fundo_nexus_stress(num_transactions=10):
    print(f"Iniciando simulação de estresse para Fundo Nexus com {num_transactions} transações...")
    genesis = NexusGenesis(api_key=API_KEY, api_secret=API_SECRET)
    
    all_events = []
    generated_txids = []

    for _ in range(num_transactions):
        event = generate_fundo_nexus_event()
        if event["tipo"] == "transacao_executada":
            generated_txids.append(event["dados"]["tx_id"])
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

    print("\n--- Resultados da Simulação Fundo Nexus ---")
    print(f"Total de Transações Simuladas: {num_transactions}")
    print(f"TXIDs Gerados: {', '.join(generated_txids)}")
    print(f"Tempo de Execução: {total_time:.2f} segundos")
    print(f"Vazão (Eventos/seg): {len(all_events)/total_time:.2f}")
    print(f"Eventos Processados pelo Genesis: {status['eventos_processados']}")
    print(f"Comandos Orquestrados pelo Genesis: {status['comandos_executados']}")
    print(f"Nível de Senciência Final do Genesis: {status['nivel_seniencia']}")

if __name__ == "__main__":
    simulate_fundo_nexus_stress(num_transactions=10)
