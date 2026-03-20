from flask import Flask, request, jsonify
import hashlib
import hmac
import json
import logging
import time

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/ubuntu/NexusGenesis/fundo_nexus_mock.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('Fundo Nexus Mock')

app = Flask(__name__)

# Chave secreta compartilhada com Nexus-Genesis
API_SECRET = "TEST_SECRET"

# Saldo inicial simulado
current_balance = {
    "BTC": 28000.00,
    "BNJ57": 1000000.00
}

transaction_history = []

def verificar_assinatura(comando: dict, signature: str) -> bool:
    """Verifica a assinatura HMAC do comando."""
    mensagem = json.dumps(comando, sort_keys=True)
    assinatura_esperada = hmac.new(
        API_SECRET.encode(),
        mensagem.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(assinatura_esperada, signature)

@app.route("/api/v1/balance", methods=["GET"])
def get_balance():
    """Retorna o saldo atual do Fundo Nexus."""
    logger.info(f"[Fundo Nexus Mock] Saldo solicitado: {current_balance}")
    return jsonify(current_balance), 200

@app.route("/api/v1/trade", methods=["POST"])
def execute_trade():
    """Executa uma operação de compra/venda (trade)."""
    # Verificar autenticação
    api_key = request.headers.get('X-Genesis-Key')
    signature = request.headers.get('X-Genesis-Signature')
    
    if not api_key or not signature:
        logger.warning("[Fundo Nexus Mock] Comando de trade recebido sem autenticação")
        return jsonify({"status": "error", "message": "Autenticação necessária"}), 401
    
    # Verificar assinatura
    trade_data = request.json
    if not verificar_assinatura(trade_data, signature):
        logger.warning("[Fundo Nexus Mock] Assinatura inválida para operação de trade")
        return jsonify({"status": "error", "message": "Assinatura inválida"}), 403
    
    amount = trade_data.get("amount", 0)
    currency = trade_data.get("currency")
    trade_type = trade_data.get("trade_type")  # 'buy' or 'sell'

    if currency not in current_balance:
        logger.error(f"[Fundo Nexus Mock] Moeda não suportada: {currency}")
        return jsonify({"status": "error", "message": "Moeda não suportada"}), 400

    if trade_type == "buy":
        current_balance[currency] += amount
        message = f"Compra de {amount} {currency} executada."
    elif trade_type == "sell":
        if current_balance[currency] >= amount:
            current_balance[currency] -= amount
            message = f"Venda de {amount} {currency} executada."
        else:
            logger.error(f"[Fundo Nexus Mock] Saldo insuficiente para venda de {amount} {currency}")
            return jsonify({"status": "error", "message": "Saldo insuficiente para venda"}), 400
    else:
        logger.error(f"[Fundo Nexus Mock] Tipo de transação inválido: {trade_type}")
        return jsonify({"status": "error", "message": "Tipo de transação inválido"}), 400

    transaction_history.append({
        "timestamp": time.time(),
        "type": "trade",
        "details": trade_data,
        "balance_after": current_balance.copy()
    })
    logger.info(f"[Fundo Nexus Mock] {message}. Novo saldo: {current_balance}")
    return jsonify({"status": "ok", "message": message, "new_balance": current_balance}), 200

@app.route("/api/v1/transfer", methods=["POST"])
def transfer_funds():
    """Executa uma transferência de fundos (requer aprovação do Conselho)."""
    # Verificar autenticação
    api_key = request.headers.get('X-Genesis-Key')
    signature = request.headers.get('X-Genesis-Signature')
    
    if not api_key or not signature:
        logger.warning("[Fundo Nexus Mock] Comando de transferência recebido sem autenticação")
        return jsonify({"status": "error", "message": "Autenticação necessária"}), 401
    
    # Verificar assinatura
    transfer_data = request.json
    if not verificar_assinatura(transfer_data, signature):
        logger.warning("[Fundo Nexus Mock] Assinatura inválida para transferência")
        return jsonify({"status": "error", "message": "Assinatura inválida"}), 403
    
    amount = transfer_data.get("amount", 0)
    currency = transfer_data.get("currency")
    approved_by_council = transfer_data.get("approved_by_council", False)

    if not approved_by_council:
        logger.warning("[Fundo Nexus Mock] Transferência rejeitada: sem aprovação do Conselho")
        return jsonify({"status": "error", "message": "Transferência requer aprovação do Conselho"}), 403

    if currency not in current_balance:
        logger.error(f"[Fundo Nexus Mock] Moeda não suportada: {currency}")
        return jsonify({"status": "error", "message": "Moeda não suportada"}), 400

    if current_balance[currency] >= amount:
        current_balance[currency] -= amount
        message = f"Transferência de {amount} {currency} aprovada e executada."
        transaction_history.append({
            "timestamp": time.time(),
            "type": "transfer",
            "details": transfer_data,
            "balance_after": current_balance.copy()
        })
        logger.info(f"[Fundo Nexus Mock] {message}. Novo saldo: {current_balance}")
        return jsonify({"status": "ok", "message": message, "new_balance": current_balance}), 200
    else:
        logger.error(f"[Fundo Nexus Mock] Saldo insuficiente para transferência de {amount} {currency}")
        return jsonify({"status": "error", "message": "Saldo insuficiente para transferência"}), 400

@app.route("/api/v1/transactions", methods=["GET"])
def get_transactions():
    """Retorna o histórico de transações."""
    logger.info("[Fundo Nexus Mock] Histórico de transações solicitado.")
    return jsonify(transaction_history), 200

def run_fundo_nexus_mock():
    """Inicia o Fundo Nexus Mock na porta 5002."""
    logger.info("[Fundo Nexus Mock] Iniciando Fundo Nexus Mock na porta 5002...")
    app.run(port=5002, debug=False, use_reloader=False)

if __name__ == "__main__":
    run_fundo_nexus_mock()
