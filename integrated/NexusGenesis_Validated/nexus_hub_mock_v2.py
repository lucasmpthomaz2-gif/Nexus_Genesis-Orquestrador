from flask import Flask, request, jsonify
import hashlib
import hmac
import json
import logging

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/ubuntu/NexusGenesis/nexus_hub_mock.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('Nexus-HUB Mock')

app = Flask(__name__)

# Chave secreta compartilhada com Nexus-Genesis
API_SECRET = "TEST_SECRET"

active_agents = {}
active_projects = {}

def verificar_assinatura(comando: dict, signature: str) -> bool:
    """Verifica a assinatura HMAC do comando."""
    mensagem = json.dumps(comando, sort_keys=True)
    assinatura_esperada = hmac.new(
        API_SECRET.encode(),
        mensagem.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(assinatura_esperada, signature)

@app.route("/api/v1/agents", methods=["POST"])
def create_agent():
    """Cria um novo agente no HUB."""
    agent_data = request.json
    agent_id = agent_data.get("id", str(len(active_agents) + 1))
    active_agents[agent_id] = agent_data
    logger.info(f"[Nexus-HUB Mock] Agente {agent_id} criado: {agent_data.get('nome')}")
    return jsonify({"status": "ok", "agent_id": agent_id}), 200

@app.route("/api/v1/agents/<agent_id>/status", methods=["GET"])
def get_agent_status(agent_id):
    """Obtém o status de um agente."""
    agent = active_agents.get(agent_id)
    if agent:
        logger.info(f"[Nexus-HUB Mock] Status do agente {agent_id} solicitado.")
        return jsonify(agent), 200
    return jsonify({"status": "error", "message": "Agente não encontrado"}), 404

@app.route("/api/v1/projects", methods=["POST"])
def start_project():
    """Inicia um novo projeto no HUB."""
    project_data = request.json
    project_id = project_data.get("id", str(len(active_projects) + 1))
    active_projects[project_id] = project_data
    logger.info(f"[Nexus-HUB Mock] Projeto {project_id} iniciado: {project_data.get('nome')}")
    return jsonify({"status": "ok", "project_id": project_id}), 200

@app.route("/api/v1/metrics/incubacao", methods=["GET", "POST"])
def get_incubation_metrics():
    """Retorna as métricas de incubação do HUB."""
    metrics = {
        "total_agents": len(active_agents),
        "total_projects": len(active_projects),
        "active_projects": len([p for p in active_projects.values() if p.get("status") == "active"])
    }
    logger.info(f"[Nexus-HUB Mock] Métricas de incubação solicitadas: {metrics}")
    return jsonify(metrics), 200

@app.route("/api/v1/agents", methods=["PUT"])
def update_agent_reputation():
    """Atualiza a reputação de um agente (comando do Nexus-Genesis)."""
    # Verificar autenticação
    api_key = request.headers.get('X-Genesis-Key')
    signature = request.headers.get('X-Genesis-Signature')
    
    if not api_key or not signature:
        logger.warning("[Nexus-HUB Mock] Comando recebido sem autenticação")
        return jsonify({"status": "error", "message": "Autenticação necessária"}), 401
    
    # Verificar assinatura
    command_data = request.json
    if not verificar_assinatura(command_data, signature):
        logger.warning("[Nexus-HUB Mock] Assinatura inválida para atualização de reputação")
        return jsonify({"status": "error", "message": "Assinatura inválida"}), 403
    
    agente_id = command_data.get('agente_id')
    incremento = command_data.get('incremento_reputacao', 0)
    
    if agente_id in active_agents:
        reputacao_atual = active_agents[agente_id].get('reputacao', 0)
        active_agents[agente_id]['reputacao'] = reputacao_atual + incremento
        logger.info(f"[Nexus-HUB Mock] Reputação do agente {agente_id} aumentada em {incremento} pontos")
        return jsonify({"status": "ok", "message": f"Reputação atualizada para {active_agents[agente_id]['reputacao']}"}), 200
    
    return jsonify({"status": "error", "message": "Agente não encontrado"}), 404

def run_nexus_hub_mock():
    """Inicia o Nexus-HUB Mock na porta 5001."""
    logger.info("[Nexus-HUB Mock] Iniciando Nexus-HUB Mock na porta 5001...")
    app.run(port=5001, debug=False, use_reloader=False)

if __name__ == "__main__":
    run_nexus_hub_mock()
