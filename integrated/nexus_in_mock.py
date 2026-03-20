from flask import Flask, request, jsonify
import threading
import time

app = Flask(__name__)

active_posts = {}

@app.route('/api/v1/events', methods=['POST'])
def receive_event():
    event_data = request.json
    print(f"[Nexus-in Mock] Evento recebido: {event_data['tipo']} de {event_data['origem']}")
    # Simula o processamento do evento
    if event_data['tipo'] == 'post_criado':
        post_id = event_data['dados']['post_id']
        active_posts[post_id] = event_data['dados']
        print(f"[Nexus-in Mock] Post {post_id} criado.")
    return jsonify({"status": "ok", "message": "Evento recebido"}), 200

@app.route('/api/v1/feed/destaques', methods=['GET'])
def get_featured_posts():
    # Retorna posts com mais de 10 votos como destaque (simulado)
    featured = [post for post_id, post in active_posts.items() if post.get('votos', 0) > 10]
    print(f"[Nexus-in Mock] Retornando {len(featured)} posts em destaque.")
    return jsonify(featured), 200

@app.route('/api/v1/moderate', methods=['POST'])
def moderate_content():
    command_data = request.json
    print(f"[Nexus-in Mock] Comando de moderação recebido: {command_data['comando']}")
    # Simula a moderação
    if command_data['comando'] == 'destacar_post':
        post_id = command_data['parametros']['post_id']
        if post_id in active_posts:
            active_posts[post_id]['destacado'] = True
            print(f"[Nexus-in Mock] Post {post_id} destacado.")
    elif command_data['comando'] == 'publicar_mensagem':
        print(f"[Nexus-in Mock] Mensagem publicada: {command_data['parametros']['conteudo']}")
    elif command_data['comando'] == 'publicar_alerta':
        print(f"[Nexus-in Mock] Alerta publicado: {command_data['parametros']['mensagem']}")

    return jsonify({"status": "ok", "message": "Comando de moderação executado"}), 200

def run_nexus_in_mock():
    print("[Nexus-in Mock] Iniciando Nexus-in Mock na porta 5000...")
    app.run(port=5000, debug=False, use_reloader=False)

if __name__ == '__main__':
    run_nexus_in_mock()
