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
        logging.FileHandler('/home/ubuntu/NexusGenesis/nexus_in_mock.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('Nexus-in Mock')

app = Flask(__name__)

# Chave secreta compartilhada com Nexus-Genesis
API_SECRET = "TEST_SECRET"

active_posts = {}

def verificar_assinatura(comando: dict, signature: str) -> bool:
    """Verifica a assinatura HMAC do comando."""
    mensagem = json.dumps(comando, sort_keys=True)
    assinatura_esperada = hmac.new(
        API_SECRET.encode(),
        mensagem.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(assinatura_esperada, signature)

@app.route('/api/v1/events', methods=['POST'])
def receive_event():
    """Recebe eventos do Nexus-Genesis."""
    event_data = request.json
    logger.info(f"[Nexus-in Mock] Evento recebido: {event_data.get('tipo')} de {event_data.get('origem')}")
    
    # Simula o processamento do evento
    if event_data.get('tipo') == 'post_criado':
        post_id = event_data['dados'].get('post_id', str(len(active_posts) + 1))
        active_posts[post_id] = event_data['dados']
        logger.info(f"[Nexus-in Mock] Post {post_id} criado.")
    
    return jsonify({"status": "ok", "message": "Evento recebido"}), 200

@app.route('/api/v1/feed/destaques', methods=['GET'])
def get_featured_posts():
    """Retorna posts com mais de 10 votos como destaque."""
    featured = [post for post_id, post in active_posts.items() if post.get('votos', 0) > 10]
    logger.info(f"[Nexus-in Mock] Retornando {len(featured)} posts em destaque.")
    return jsonify(featured), 200

@app.route('/api/v1/moderate', methods=['POST'])
def moderate_content():
    """Recebe e executa comandos de moderação do Nexus-Genesis."""
    # Verificar autenticação
    api_key = request.headers.get('X-Genesis-Key')
    signature = request.headers.get('X-Genesis-Signature')
    
    if not api_key or not signature:
        logger.warning("[Nexus-in Mock] Comando recebido sem autenticação")
        return jsonify({"status": "error", "message": "Autenticação necessária"}), 401
    
    command_data = request.json
    
    # O Nexus-Genesis assina o dicionário completo do comando, que inclui 'destino', 'comando' e 'parametros'.
    # O mock recebe apenas os 'parametros' no corpo da requisição e o 'comando' e 'destino' são implícitos
    # pelo endpoint. Para verificar a assinatura, precisamos reconstruir o objeto que foi assinado.
    # O Nexus-Genesis assina o dicionário completo do comando, mas envia apenas os 'parametros' no corpo da requisição.
    # Para verificar a assinatura, precisamos reconstruir o objeto que foi assinado.
    # O 'comando' e 'destino' são implícitos pelo endpoint.
    comando_completo_para_assinatura = {
        "destino": "nexus_in",
        "comando": "moderate",
        "parametros": command_data
    }

    if not verificar_assinatura(comando_completo_para_assinatura, signature):
        logger.warning("[Nexus-in Mock] Assinatura inválida para comando de moderação")
        return jsonify({"status": "error", "message": "Assinatura inválida"}), 403
    
    logger.info(f"[Nexus-in Mock] Comando de moderação autenticado")
    
    # Simula a moderação
    # O Genesis envia os parâmetros diretamente no corpo da requisição, então acessamos diretamente 'command_data'
    comando_tipo = command_data.get("comando")
    
    if comando_tipo == "destacar_post":
        post_id = command_data.get("post_id")
        if post_id in active_posts:
            active_posts[post_id]["destacado"] = True
            logger.info(f"[Nexus-in Mock] Post {post_id} destacado.")
    elif comando_tipo == "publicar_mensagem":
        conteudo = command_data.get("conteudo")
        logger.info(f"[Nexus-in Mock] Mensagem publicada: {conteudo}")
    elif comando_tipo == "publicar_alerta":
        mensagem = command_data.get("mensagem")
        nivel = command_data.get("nivel", "info")
        logger.info(f"[Nexus-in Mock] Alerta [{nivel}] publicado: {mensagem}")
    elif comando_tipo == "adicionar_experiencia":
        experiencia = command_data.get("experiencia")
        logger.info(f"[Nexus-in Mock] Experiência adicionada: {experiencia}")

    return jsonify({"status": "ok", "message": "Comando de moderação executado"}), 200

def run_nexus_in_mock():
    """Inicia o Nexus-in Mock na porta 5000."""
    logger.info("[Nexus-in Mock] Iniciando Nexus-in Mock na porta 5000...")
    app.run(port=5000, debug=False, use_reloader=False)

if __name__ == '__main__':
    run_nexus_in_mock()
