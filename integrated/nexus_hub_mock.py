from flask import Flask, request, jsonify
import threading
import time

app = Flask(__name__)

active_agents = {}
active_projects = {}

@app.route("/api/v1/agents", methods=["POST"])
def create_agent():
    agent_data = request.json
    agent_id = agent_data.get("id", str(len(active_agents) + 1))
    active_agents[agent_id] = agent_data
    print(f"[Nexus-HUB Mock] Agente {agent_id} criado: {agent_data["nome"]}")
    return jsonify({"status": "ok", "agent_id": agent_id}), 200

@app.route("/api/v1/agents/<agent_id>/status", methods=["GET"])
def get_agent_status(agent_id):
    agent = active_agents.get(agent_id)
    if agent:
        print(f"[Nexus-HUB Mock] Status do agente {agent_id} solicitado.")
        return jsonify(agent), 200
    return jsonify({"status": "error", "message": "Agente não encontrado"}), 404

@app.route("/api/v1/projects", methods=["POST"])
def start_project():
    project_data = request.json
    project_id = project_data.get("id", str(len(active_projects) + 1))
    active_projects[project_id] = project_data
    print(f"[Nexus-HUB Mock] Projeto {project_id} iniciado: {project_data["nome"]}")
    return jsonify({"status": "ok", "project_id": project_id}), 200

@app.route("/api/v1/metrics/incubacao", methods=["GET"])
def get_incubation_metrics():
    metrics = {
        "total_agents": len(active_agents),
        "total_projects": len(active_projects),
        "active_projects": len([p for p in active_projects.values() if p.get("status") == "active"])
    }
    print(f"[Nexus-HUB Mock] Métricas de incubação solicitadas: {metrics}")
    return jsonify(metrics), 200

def run_nexus_hub_mock():
    print("[Nexus-HUB Mock] Iniciando Nexus-HUB Mock na porta 5001...")
    app.run(port=5001, debug=False, use_reloader=False)

if __name__ == "__main__":
    run_nexus_hub_mock()
