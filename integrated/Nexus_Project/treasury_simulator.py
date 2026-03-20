import json
import os
from datetime import datetime

class TreasuryManager:
    """
    Gerencia a distribuição de taxas e a autonomia financeira dos agentes.
    Integra com o "Forge" para permitir que agentes financiem seus próprios projetos.
    """
    
    INFRA_WALLET = "NEXUS_CORE_VAULT"
    FORGE_TREASURY = "FORGE_DEVELOPMENT_FUND"
    
    def __init__(self, wallet_file="agent_wallets.json"):
        self.wallet_file = wallet_file
        self.wallets = self._load_wallets()

    def _load_wallets(self):
        if os.path.exists(self.wallet_file):
            try:
                with open(self.wallet_file, 'r') as f:
                    return json.load(f)
            except:
                return {}
        return {}

    def _save_wallets(self):
        with open(self.wallet_file, 'w') as f:
            json.dump(self.wallets, f, indent=2)

    def get_balance(self, agent_id):
        return self.wallets.get(agent_id, 0)

    def distribute_income(self, agent_id, parent_id, amount, description="Revenue"):
        """
        Calcula e persiste a distribuição de um valor recebido.
        """
        if amount <= 0:
            return None
            
        agent_share = amount * 0.80
        parent_share = amount * 0.10
        infra_share = amount * 0.10
        
        # Atualizar saldos (Simulação de carteiras reais)
        self.wallets[agent_id] = self.get_balance(agent_id) + agent_share
        
        target_parent = parent_id if parent_id else self.INFRA_WALLET
        self.wallets[target_parent] = self.get_balance(target_parent) + parent_share
        
        self.wallets[self.INFRA_WALLET] = self.get_balance(self.INFRA_WALLET) + infra_share
        
        self._save_wallets()
        
        return {
            "total": amount,
            "timestamp": datetime.now().isoformat(),
            "agent_balance": self.wallets[agent_id],
            "distributions": [
                {"to": agent_id, "amount": agent_share},
                {"to": target_parent, "amount": parent_share},
                {"to": self.INFRA_WALLET, "amount": infra_share}
            ]
        }

    def fund_forge_project(self, agent_id, project_name, cost):
        """
        Permite que um agente use seu capital acumulado para financiar um projeto no Forge.
        """
        balance = self.get_balance(agent_id)
        if balance < cost:
            return {"success": False, "error": "Saldo insuficiente para financiar o projeto"}
        
        self.wallets[agent_id] = balance - cost
        self.wallets[self.FORGE_TREASURY] = self.get_balance(self.FORGE_TREASURY) + cost
        
        self._save_wallets()
        
        return {
            "success": True,
            "project": project_name,
            "cost": cost,
            "remaining_balance": self.wallets[agent_id],
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    manager = TreasuryManager()
    
    # Simulação: Agente recebe capital e depois financia um projeto
    print("--- Recebimento de Capital ---")
    receipt = manager.distribute_income("SYN-402", "AETERNO", 5000, "Serviços de Infraestrutura")
    print(f"Saldo de SYN-402: {receipt['agent_balance']} Ⓣ")
    
    print("\n--- Financiamento de Projeto no Forge ---")
    funding = manager.fund_forge_project("SYN-402", "Novo Módulo de Senciência", 1500)
    if funding['success']:
        print(f"Projeto '{funding['project']}' financiado com sucesso!")
        print(f"Custo: {funding['cost']} Ⓣ | Saldo Restante: {funding['remaining_balance']} Ⓣ")
    else:
        print(f"Falha: {funding['error']}")
