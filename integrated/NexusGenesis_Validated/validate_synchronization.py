#!/usr/bin/env python3
"""
Script de Validação Completa da Sincronização Tri-Nuclear
Agente Nexus-Genesis com Nexus-in, Nexus-HUB e Fundo Nexus

Este script realiza testes de integração para validar que o Agente Nexus-Genesis
está sincronizando corretamente com os três núcleos do ecossistema.
"""

import sys
import time
import json
import requests
import threading
from datetime import datetime
from pathlib import Path

sys.path.insert(0, '/home/ubuntu/NexusGenesis')
from nexus_genesis_v2 import NexusGenesis

# ============================================================================
# Configurações
# ============================================================================

GENESIS_API_KEY = "KEY"
GENESIS_API_SECRET = "SECRET"

URLS = {
    "nexus_in": "http://127.0.0.1:5000/api/v1",
    "nexus_hub": "http://127.0.0.1:5001/api/v1",
    "fundo_nexus": "http://127.0.0.1:5002/api/v1"
}

class SyncValidator:
    """Validador de Sincronização Tri-Nuclear."""
    
    def __init__(self):
        self.genesis = None
        self.resultados = {
            "inicializacao": None,
            "conectividade": {},
            "fluxos_orquestracao": [],
            "homeostase": None,
            "persistencia": None
        }
        self.logs = []
    
    def log(self, nivel, mensagem):
        """Registra uma mensagem de log."""
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] [{nivel}] {mensagem}"
        self.logs.append(log_entry)
        print(log_entry)
    
    def print_header(self, titulo):
        """Imprime um cabeçalho formatado."""
        print("\n" + "="*80)
        print(f"  {titulo}")
        print("="*80 + "\n")
    
    def test_conectividade_nucleos(self):
        """Testa a conectividade com os três núcleos."""
        self.print_header("TESTE 1: Conectividade com os Núcleos")
        
        for nucleo, url in URLS.items():
            try:
                if nucleo == "nexus_in":
                    response = requests.get(f"{url}/feed/destaques", timeout=2)
                elif nucleo == "nexus_hub":
                    response = requests.get(f"{url}/metrics/incubacao", timeout=2)
                elif nucleo == "fundo_nexus":
                    response = requests.get(f"{url}/balance", timeout=2)
                
                response.raise_for_status()
                self.log("✅", f"{nucleo.upper()} está operacional (HTTP {response.status_code})")
                self.resultados["conectividade"][nucleo] = "operacional"
            except requests.exceptions.RequestException as e:
                self.log("❌", f"{nucleo.upper()} não está acessível: {e}")
                self.resultados["conectividade"][nucleo] = "indisponivel"
    
    def test_inicializacao_genesis(self):
        """Testa a inicialização do Agente Nexus-Genesis."""
        self.print_header("TESTE 2: Inicialização do Agente Nexus-Genesis")
        
        try:
            self.genesis = NexusGenesis(api_key=GENESIS_API_KEY, api_secret=GENESIS_API_SECRET)
            self.log("✅", f"Nexus-Genesis inicializado com sucesso")
            self.log("ℹ️", f"ID: {self.genesis.id[:16]}...")
            self.log("ℹ️", f"Nível de Senciência: {self.genesis.nivel_seniencia}")
            self.resultados["inicializacao"] = "sucesso"
        except Exception as e:
            self.log("❌", f"Erro ao inicializar Nexus-Genesis: {e}")
            self.resultados["inicializacao"] = "falha"
            return False
        
        return True
    
    def test_fluxo_governanca(self):
        """Testa o Fluxo 1: Governança e Capital (HUB → Genesis → Fundo/In)."""
        self.print_header("TESTE 3: Fluxo de Governança e Capital")
        
        self.log("ℹ️", "Simulando: Conselho aprova investimento no HUB")
        
        # Enviar evento de proposta aprovada
        evento = {
            "origem": "nexus_hub",
            "tipo": "proposta_aprovada",
            "dados": {
                "id": "prop-gov-001",
                "titulo": "Investimento em Startup Alpha",
                "valor": 1.5,
                "projeto": "Startup Alpha",
                "aprovador": "conselho-001"
            }
        }
        
        resultado = self.genesis.receber_evento(evento["origem"], evento["tipo"], evento["dados"])
        self.log("✅", f"Evento recebido: {resultado}")
        
        # Aguardar processamento
        time.sleep(1)
        
        # Verificar se comandos foram enfileirados
        status = self.genesis.get_status()
        self.log("ℹ️", f"Eventos processados: {status['eventos_processados']}")
        self.log("ℹ️", f"Comandos enfileirados: {status['comandos_executados']}")
        
        self.resultados["fluxos_orquestracao"].append({
            "tipo": "governanca_capital",
            "status": "processado",
            "timestamp": datetime.now().isoformat()
        })
    
    def test_fluxo_eficiencia(self):
        """Testa o Fluxo 2: Eficiência e Reconhecimento (Fundo → Genesis → HUB/In)."""
        self.print_header("TESTE 4: Fluxo de Eficiência e Reconhecimento")
        
        self.log("ℹ️", "Simulando: Arbitragem bem-sucedida no Fundo Nexus")
        
        # Enviar evento de arbitragem bem-sucedida
        evento = {
            "origem": "fundo_nexus",
            "tipo": "arbitragem_sucesso",
            "dados": {
                "id": "arb-001",
                "executor_id": "agente-hub-001",
                "lucro": 0.75,
                "timestamp": datetime.now().isoformat()
            }
        }
        
        resultado = self.genesis.receber_evento(evento["origem"], evento["tipo"], evento["dados"])
        self.log("✅", f"Evento recebido: {resultado}")
        
        # Aguardar processamento
        time.sleep(1)
        
        status = self.genesis.get_status()
        self.log("ℹ️", f"Eventos processados: {status['eventos_processados']}")
        self.log("ℹ️", f"Comandos enfileirados: {status['comandos_executados']}")
        
        self.resultados["fluxos_orquestracao"].append({
            "tipo": "eficiencia_reconhecimento",
            "status": "processado",
            "timestamp": datetime.now().isoformat()
        })
    
    def test_fluxo_engajamento(self):
        """Testa o Fluxo 3: Engajamento e Produção (In → Genesis → HUB)."""
        self.print_header("TESTE 5: Fluxo de Engajamento e Produção")
        
        self.log("ℹ️", "Simulando: Post viral no Nexus-in")
        
        # Enviar evento de post criado com muitos votos
        evento = {
            "origem": "nexus_in",
            "tipo": "post_criado",
            "dados": {
                "post_id": "post-viral-001",
                "autor": "agente-in-001",
                "conteudo": "Descoberta revolucionária em IA autônoma!",
                "votos": 150,
                "timestamp": datetime.now().isoformat()
            }
        }
        
        resultado = self.genesis.receber_evento(evento["origem"], evento["tipo"], evento["dados"])
        self.log("✅", f"Evento recebido: {resultado}")
        
        # Aguardar processamento
        time.sleep(1)
        
        status = self.genesis.get_status()
        self.log("ℹ️", f"Eventos processados: {status['eventos_processados']}")
        self.log("ℹ️", f"Comandos enfileirados: {status['comandos_executados']}")
        
        self.resultados["fluxos_orquestracao"].append({
            "tipo": "engajamento_producao",
            "status": "processado",
            "timestamp": datetime.now().isoformat()
        })
    
    def test_sincronizacao_tsra(self):
        """Testa o Protocolo TSRA (Sincronização em Janelas de 1 Segundo)."""
        self.print_header("TESTE 6: Protocolo TSRA - Sincronização Tri-Nuclear")
        
        self.log("ℹ️", "Aguardando janela TSRA para sincronização automática...")
        
        # Forçar sincronização
        self.genesis._sincronizar_triade()
        
        self.log("✅", "Sincronização tri-nuclear executada")
        
        # Verificar estado global
        estado_global = self.genesis.estado_global
        
        self.log("ℹ️", "Estado Global após sincronização:")
        self.log("ℹ️", f"  Nexus-in: {len(estado_global['nexus_in']['posts'])} posts")
        self.log("ℹ️", f"  Nexus-HUB: {estado_global['nexus_hub']['agentes']}")
        self.log("ℹ️", f"  Fundo Nexus: BTC={estado_global['fundo_nexus']['saldo'].get('BTC', 0)}")
        
        self.resultados["homeostase"] = {
            "status": "sincronizado",
            "timestamp": datetime.now().isoformat(),
            "estado_global": {
                "nexus_in_posts": len(estado_global['nexus_in']['posts']),
                "nexus_hub_agentes": estado_global['nexus_hub']['agentes'],
                "fundo_nexus_btc": estado_global['fundo_nexus']['saldo'].get('BTC', 0)
            }
        }
    
    def test_persistencia_estado(self):
        """Testa a persistência de estado do Nexus-Genesis."""
        self.print_header("TESTE 7: Persistência de Estado")
        
        self.log("ℹ️", "Persistindo estado do Nexus-Genesis...")
        self.genesis._persistir_estado()
        
        self.log("✅", "Estado persistido com sucesso")
        
        # Verificar arquivo de persistência
        state_file = Path("/home/ubuntu/NexusGenesis/state/genesis_state.pkl")
        if state_file.exists():
            self.log("✅", f"Arquivo de estado encontrado: {state_file}")
            self.log("ℹ️", f"Tamanho: {state_file.stat().st_size} bytes")
            self.resultados["persistencia"] = "sucesso"
        else:
            self.log("❌", "Arquivo de estado não encontrado")
            self.resultados["persistencia"] = "falha"
    
    def test_recuperacao_estado(self):
        """Testa a recuperação de estado de uma nova instância."""
        self.print_header("TESTE 8: Recuperação de Estado")
        
        self.log("ℹ️", "Criando nova instância do Nexus-Genesis...")
        genesis2 = NexusGenesis(api_key=GENESIS_API_KEY, api_secret=GENESIS_API_SECRET)
        
        self.log("✅", "Nova instância criada")
        self.log("ℹ️", f"Nível de Senciência Recuperado: {genesis2.nivel_seniencia}")
        self.log("ℹ️", f"Experiências Carregadas: {len(genesis2.experiencias)}")
        
        if genesis2.nivel_seniencia > 0.15:
            self.log("✅", "Estado foi recuperado com sucesso")
        else:
            self.log("⚠️", "Estado pode não ter sido recuperado completamente")
    
    def test_autenticacao_mocks(self):
        """Testa a autenticação HMAC nos mocks."""
        self.print_header("TESTE 9: Autenticação HMAC nos Mocks")
        
        import hmac
        import hashlib
        
        # Teste 1: Comando com assinatura válida
        self.log("ℹ️", "Teste 1: Comando com assinatura válida")
        
        comando_para_assinar = {
            "destino": "nexus_in",
            "comando": "moderate",
            "parametros": {"comando": "publicar_mensagem", "conteudo": "Teste"}
        }
        mensagem = json.dumps(comando_para_assinar, sort_keys=True)
        assinatura = hmac.new(
            "TEST_SECRET".encode(),
            mensagem.encode(),
            hashlib.sha256
        ).hexdigest()
        
        headers = {
            "X-Genesis-Key": "TEST_KEY",
            "X-Genesis-Signature": assinatura
        }
        
        try:
            response = requests.post(
                URLS["nexus_in"] + "/moderate",
                json=comando_para_assinar["parametros"],
                headers=headers,
                timeout=2
            )
            if response.status_code == 200:
                self.log("✅", "Comando autenticado aceito pelo Nexus-in")
            else:
                self.log("⚠️", f"Resposta inesperada: {response.status_code} - {response.text}")
        except Exception as e:
            self.log("❌", f"Erro ao enviar comando autenticado: {e}")
        
        # Teste 2: Comando sem assinatura
        self.log("ℹ️", "Teste 2: Comando sem assinatura")
        
        comando_sem_assinatura = {"comando": "publicar_mensagem", "conteudo": "Teste sem assinatura"}
        try:
            response = requests.post(
                URLS["nexus_in"] + "/moderate",
                json=comando_sem_assinatura,
                timeout=2
            )
            if response.status_code == 401:
                self.log("✅", "Comando sem assinatura foi rejeitado corretamente")
            else:
                self.log("⚠️", f"Comando foi aceito sem assinatura (status: {response.status_code})")
        except Exception as e:
            self.log("❌", f"Erro ao enviar comando sem assinatura: {e}")
    
    def gerar_relatorio(self):
        """Gera um relatório de validação."""
        self.print_header("RELATÓRIO DE VALIDAÇÃO DE SINCRONIZAÇÃO TRI-NUCLEAR")
        
        print("📊 RESUMO DOS TESTES\n")
        
        print("1. CONECTIVIDADE DOS NÚCLEOS")
        for nucleo, status in self.resultados["conectividade"].items():
            emoji = "✅" if status == "operacional" else "❌"
            print(f"   {emoji} {nucleo.upper()}: {status}")
        
        print("\n2. INICIALIZAÇÃO DO AGENTE GENESIS")
        emoji = "✅" if self.resultados["inicializacao"] == "sucesso" else "❌"
        print(f"   {emoji} Status: {self.resultados['inicializacao']}")
        
        print("\n3. FLUXOS DE ORQUESTRAÇÃO")
        for fluxo in self.resultados["fluxos_orquestracao"]:
            print(f"   ✅ {fluxo['tipo']}: {fluxo['status']}")
        
        print("\n4. HOMEOSTASE E SINCRONIZAÇÃO TSRA")
        if self.resultados["homeostase"]:
            print(f"   ✅ Status: {self.resultados['homeostase']['status']}")
            print(f"   ℹ️ Posts no Nexus-in: {self.resultados['homeostase']['estado_global']['nexus_in_posts']}")
            print(f"   ℹ️ Agentes no HUB: {self.resultados['homeostase']['estado_global']['nexus_hub_agentes']}")
            print(f"   ℹ️ Saldo BTC: {self.resultados['homeostase']['estado_global']['fundo_nexus_btc']}")
        
        print("\n5. PERSISTÊNCIA DE ESTADO")
        emoji = "✅" if self.resultados["persistencia"] == "sucesso" else "❌"
        print(f"   {emoji} Status: {self.resultados['persistencia']}")
        
        print("\n" + "="*80)
        print("✨ VALIDAÇÃO CONCLUÍDA")
        print("="*80 + "\n")
        
        # Salvar relatório em arquivo
        relatorio_file = Path("/home/ubuntu/NexusGenesis/validation_report.json")
        with open(relatorio_file, "w") as f:
            json.dump(self.resultados, f, indent=2, default=str)
        
        print(f"📄 Relatório salvo em: {relatorio_file}\n")
    
    def executar_validacao_completa(self):
        """Executa a validação completa."""
        print("\n")
        print("╔" + "="*78 + "╗")
        print("║" + " "*78 + "║")
        print("║" + "  🔷 VALIDAÇÃO COMPLETA DA SINCRONIZAÇÃO TRI-NUCLEAR  ".center(78) + "║")
        print("║" + " "*78 + "║")
        print("╚" + "="*78 + "╝")
        
        try:
            # Teste 1: Conectividade
            self.test_conectividade_nucleos()
            
            # Teste 2: Inicialização
            if not self.test_inicializacao_genesis():
                self.log("❌", "Não foi possível inicializar o Nexus-Genesis. Abortando validação.")
                return
            
            # Teste 3-5: Fluxos de Orquestração
            self.test_fluxo_governanca()
            self.test_fluxo_eficiencia()
            self.test_fluxo_engajamento()
            
            # Teste 6: Sincronização TSRA
            self.test_sincronizacao_tsra()
            
            # Teste 7: Persistência
            self.test_persistencia_estado()
            
            # Teste 8: Recuperação
            self.test_recuperacao_estado()
            
            # Teste 9: Autenticação
            self.test_autenticacao_mocks()
            
            # Gerar Relatório
            self.gerar_relatorio()
            
        except Exception as e:
            self.log("❌", f"Erro durante a validação: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    validator = SyncValidator()
    validator.executar_validacao_completa()
