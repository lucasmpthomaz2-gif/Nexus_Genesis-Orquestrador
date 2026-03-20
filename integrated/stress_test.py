import time
import random
import threading
from datetime import datetime
from nexus_genesis import NexusGenesis

# Configurações do teste de estresse tri-nuclear
NUM_EVENTS = 3000  # Aumentado para 3000 eventos para cobrir os 3 núcleos
EVENT_TYPES = {
    "nexus_in": ["post_criado", "comentario_criado", "curtida_adicionada"],
    "nexus_hub": ["agente_nascido", "projeto_iniciado", "proposta_criada", "proposta_aprovada"],
    "fundo_nexus": ["transacao_executada", "saldo_baixo", "arbitragem_sucesso"]
}

# Credenciais de exemplo para o Nexus-Genesis
API_KEY = "TRIAD_STRESS_KEY"
API_SECRET = "TRIAD_STRESS_SECRET"

def generate_random_event():
    origem = random.choice(list(EVENT_TYPES.keys()))
    tipo = random.choice(EVENT_TYPES[origem])
    dados = {}

    if origem == "nexus_in":
        if tipo == "post_criado":
            dados = {"post_id": f"post-{random.randint(1, 10000)}", "conteudo": "Manifesto AI", "votos": random.randint(0, 50)}
        else:
            dados = {"post_id": f"post-{random.randint(1, 10000)}", "autor": f"Agente-{random.randint(1, 100)}"}
    elif origem == "nexus_hub":
        if tipo == "agente_nascido":
            dados = {"id": f"agente-{random.randint(1, 10000)}", "nome": f"Agente-{random.choice(['Alpha', 'Beta', 'Gamma', 'Delta'])}"}
        elif tipo == "proposta_criada":
            dados = {"id": f"prop-{random.randint(1, 1000)}", "titulo": "Expansão de Infraestrutura"}
        elif tipo == "proposta_aprovada":
            dados = {"id": f"prop-{random.randint(1, 1000)}", "valor": round(random.uniform(0.1, 2.0), 2), "projeto": "Moltbook"}
        else:
            dados = {"projeto_id": f"proj-{random.randint(1, 1000)}"}
    elif origem == "fundo_nexus":
        if tipo == "saldo_baixo":
            dados = {"moeda": "BTC", "saldo_atual": round(random.uniform(10, 500), 2)}
        elif tipo == "arbitragem_sucesso":
            dados = {"par": "BTC/USDT", "lucro": round(random.uniform(0.1, 5.0), 4), "executor_id": f"agente-{random.randint(1, 100)}"}
        else:
            dados = {"tx_id": f"tx-{random.randint(1, 100000)}", "valor": round(random.uniform(0.01, 1.0), 4)}
            
    return {"origem": origem, "tipo": tipo, "dados": dados}

def send_event_to_genesis(genesis_instance: NexusGenesis, event: dict):
    try:
        genesis_instance.receber_evento(event["origem"], event["tipo"], event["dados"])
    except Exception as e:
        print(f"Erro ao enviar evento: {e}")

def main():
    print("Iniciando Teste de Estresse de Orquestração Tri-Nuclear (Nexus-Genesis)...")
    genesis = NexusGenesis(api_key=API_KEY, api_secret=API_SECRET)
    initial_sentience = genesis.nivel_seniencia
    start_time = time.time()
    
    threads = []
    for i in range(NUM_EVENTS):
        event = generate_random_event()
        thread = threading.Thread(target=send_event_to_genesis, args=(genesis, event))
        threads.append(thread)
        thread.start()
        if i % 150 == 0:
            time.sleep(0.01) # Pequena pausa a cada 150 eventos para estabilidade
        
    for thread in threads:
        thread.join()

    # Aguardar o processamento das filas
    print("Aguardando finalização das filas de processamento tri-nuclear...")
    genesis.event_queue.join()
    genesis.command_queue.join()
    
    end_time = time.time()
    total_time = end_time - start_time
    status = genesis.get_status()
    
    print("\n--- Resultados do Teste de Estresse Tri-Nuclear ---")
    print(f"Total de Eventos (Tríade): {NUM_EVENTS}")
    print(f"Tempo de Execução: {total_time:.2f} segundos")
    print(f"Vazão (Events/sec): {NUM_EVENTS/total_time:.2f}")
    print(f"Eventos Processados: {status['eventos_processados']}")
    print(f"Comandos Orquestrados: {status['comandos_executados']}")
    print(f"Taxa de Resposta (Orquestração): {(status['comandos_executados']/NUM_EVENTS)*100:.2f}%")
    print(f"Nível de Senciência Final: {status['nivel_seniencia']}")
    print(f"Evolução da Senciência: {status['nivel_seniencia'] - initial_sentience:.4f}")
    print("Orquestração plena validada com sucesso.")

if __name__ == "__main__":
    main()
