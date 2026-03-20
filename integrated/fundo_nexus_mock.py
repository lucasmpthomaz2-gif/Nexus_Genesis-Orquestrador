from flask import Flask, request, jsonify
import threading
import time

app = Flask(__name__)

# Saldo inicial simulado
current_balance = {
    "BTC": 28000.00,
    "BNJ57": 1000000.00
}

transaction_history = []

@app.route("/api/v1/balance", methods=["GET"])
def get_balance():
    print(f"[Fundo Nexus Mock] Saldo solicitado: {current_balance}")
    return jsonify(current_balance), 200

@app.route("/api/v1/trade", methods=["POST"])
def execute_trade():
    trade_data = request.json
    amount = trade_data.get("amount", 0)
    currency = trade_data.get("currency")
    trade_type = trade_data.get("trade_type") # 'buy' or 'sell'

    if currency not in current_balance:
        return jsonify({"status": "error", "message": "Moeda não suportada"}), 400

    if trade_type == "buy":
        current_balance[currency] += amount
        message = f"Compra de {amount} {currency} executada."
    elif trade_type == "sell":
        if current_balance[currency] >= amount:
            current_balance[currency] -= amount
            message = f"Venda de {amount} {currency} executada."
        else:
            return jsonify({"status": "error", "message": "Saldo insuficiente para venda"}), 400
    else:
        return jsonify({"status": "error", "message": "Tipo de transação inválido"}), 400

    transaction_history.append({
        "timestamp": time.time(),
        "type": "trade",
        "details": trade_data,
        "balance_after": current_balance.copy()
    })
    print(f"[Fundo Nexus Mock] {message}. Novo saldo: {current_balance}")
    return jsonify({"status": "ok", "message": message, "new_balance": current_balance}), 200

@app.route("/api/v1/transfer", methods=["POST"])
def transfer_funds():
    transfer_data = request.json
    amount = transfer_data.get("amount", 0)
    currency = transfer_data.get("currency")
    approved_by_council = transfer_data.get("approved_by_council", False)

    if not approved_by_council:
        return jsonify({"status": "error", "message": "Transferência requer aprovação do Conselho"}), 403

    if currency not in current_balance:
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
        print(f"[Fundo Nexus Mock] {message}. Novo saldo: {current_balance}")
        return jsonify({"status": "ok", "message": message, "new_balance": current_balance}), 200
    else:
        return jsonify({"status": "error", "message": "Saldo insuficiente para transferência"}), 400

@app.route("/api/v1/transactions", methods=["GET"])
def get_transactions():
    print("[Fundo Nexus Mock] Histórico de transações solicitado.")
    return jsonify(transaction_history), 200

def run_fundo_nexus_mock():
    print("[Fundo Nexus Mock] Iniciando Fundo Nexus Mock na porta 5002...")
    app.run(port=5002, debug=False, use_reloader=False)

if __name__ == "__main__":
    run_fundo_nexus_mock()
