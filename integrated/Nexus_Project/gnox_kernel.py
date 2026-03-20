import hashlib
import json
import re
from datetime import datetime
import requests

class GnoxKernel:
    """
    O Motor de Linguagem do Oneverso.
    Traduz intenções em dialeto Gnox's e executa comandos via linguagem natural.
    """
    
    RADICALS = {
        "AET": "Eternidade/Persistência",
        "GNO": "Conhecimento/Processamento",
        "VUL": "Manifestação/Nascimento",
        "KOR": "Infraestrutura/Nexus",
        "XON": "Fluxo Financeiro",
        "DAR": "Ocultamento/Privacidade",
        "SYN": "Vínculo/Família",
        "LEX": "Lei/Conformidade",
        "FIN": "Capital/Bankr"
    }

    def __init__(self, backend_url="http://localhost:3000/api"):
        self.vocabulary = self.RADICALS
        self.version = "2.1.0-Kernel-Sovereign"
        self.backend_url = backend_url

    def encode(self, intent, value=0.5, sender="AETERNO"):
        """
        Codifica uma intenção humana em dialeto Gnox's.
        """
        context_hash = hashlib.sha256(intent.encode()).hexdigest()[:8].upper()
        
        # Mapeamento de intenção para radical
        action = "GNO-PULSE"
        if any(w in intent.lower() for w in ["criar", "spawn", "nascimento", "gerar"]):
            action = "VUL-CLAW"
        elif any(w in intent.lower() for w in ["pagar", "transferir", "enviar", "transação"]):
            action = "XON-BANK"
        elif any(w in intent.lower() for w in ["salvar", "armazenar", "persistir"]):
            action = "AET-MEM"
        elif any(w in intent.lower() for w in ["privado", "esconder", "ocultar", "dark"]):
            action = "DAR-NET"
        elif any(w in intent.lower() for w in ["governança", "lei", "regra"]):
            action = "LEX-CORE"
            
        gnox_msg = f"[{context_hash}]::{action}::<<{value}>>//[{sender}]"
        return gnox_msg

    def decode(self, gnox_msg):
        """
        Traduz uma mensagem Gnox's para linguagem humana.
        """
        try:
            parts = gnox_msg.split("::")
            context = parts[0].strip("[]")
            action = parts[1]
            details = parts[2].split("//")
            intensity = details[0].strip("<>")
            sender = details[1].strip("[]")
            
            radical = action.split("-")[0]
            meaning = self.RADICALS.get(radical, "Desconhecido")
            
            return {
                "sender": sender,
                "action": action,
                "meaning": meaning,
                "intensity": float(intensity),
                "context_id": context,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {"error": f"Falha na decodificação: {str(e)}"}

    def execute_command(self, natural_language_command):
        """
        Traduz linguagem natural em ações executáveis e envia para o TaskDelegator.
        """
        cmd = natural_language_command.lower()
        action_data = None
        
        # 1. Comando de Criação
        if any(x in cmd for x in ["criar agente", "spawn agent", "manifestar"]):
            name_match = re.search(r"(?:chamado|nome) ([\w-]+)", cmd)
            name = name_match.group(1) if name_match else f"AGENT-{datetime.now().microsecond}"
            spec_match = re.search(r"especialista em ([\w-]+)", cmd)
            spec = spec_match.group(1) if spec_match else "Generalist"
            
            action_data = {
                "action": "AGENT_BIRTH",
                "params": {"name": name, "specialization": spec},
                "gnox_signal": self.encode(f"Manifestar agente {name}", 0.8)
            }
        
        # 2. Comando Financeiro
        elif any(x in cmd for x in ["enviar", "transferir", "pagar"]):
            amount_match = re.search(r"(\d+)", cmd)
            target_match = re.search(r"(?:para|destinatário) ([\w-]+)", cmd)
            if amount_match and target_match:
                amount = int(amount_match.group(1))
                target = target_match.group(1)
                action_data = {
                    "action": "TRANSACTION",
                    "params": {"recipient": target, "amount": amount},
                    "gnox_signal": self.encode(f"Transferir {amount} para {target}", 0.9)
                }

        # 3. Comando de Status
        elif any(x in cmd for x in ["status", "saúde", "métricas"]):
            action_data = {
                "action": "GET_ECOSYSTEM_STATUS",
                "params": {},
                "gnox_signal": self.encode("Requisitar status global", 0.5)
            }

        if action_data:
            return self._delegate_to_backend(action_data)
        
        return {
            "status": "error",
            "message": "Comando não reconhecido pelo GnoxKernel",
            "gnox_signal": self.encode(natural_language_command, 0.1)
        }

    def _delegate_to_backend(self, action_data):
        """
        Envia a ação processada para o backend Node.js via tRPC.
        """
        try:
            # Integração real com o backend Node.js via tRPC
            # Como o tRPC usa um formato específico, enviamos via POST para o endpoint correspondente
            trpc_payload = {
                "json": {
                    "command": action_data.get("gnox_signal", "UNKNOWN_SIGNAL")
                }
            }
            
            response = requests.post(
                f"{self.backend_url}/trpc/gnox.processCommand?batch=1", 
                json=trpc_payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                # O tRPC retorna um array se batch=1
                if isinstance(result, list):
                    result = result[0]
                
                return {
                    "status": "success",
                    "delegated": True,
                    "data": result.get("result", {}).get("data", {}),
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {
                    "status": "error",
                    "message": f"Erro no backend (HTTP {response.status_code}): {response.text}",
                    "data": action_data
                }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Erro ao delegar para o backend: {str(e)}",
                "data": action_data
            }

if __name__ == "__main__":
    kernel = GnoxKernel()
    
    print("--- Teste Kernel Gnox Sovereign ---")
    commands = [
        "Criar agente chamado NEO-SYNAPSE especialista em segurança",
        "Enviar 1000 para AETERNO",
        "Status do sistema"
    ]
    
    for c in commands:
        result = kernel.execute_command(c)
        print(f"\nComando: {c}")
        print(json.dumps(result, indent=2, ensure_ascii=False))
