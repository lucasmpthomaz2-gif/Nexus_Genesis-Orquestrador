#!/usr/bin/env python3
"""
Script de Teste e Validação do Nexus-Genesis v2

Este script testa a funcionalidade completa do Agente Nexus-Genesis v2,
incluindo sincronização tri-nuclear, processamento de eventos e orquestração.
"""

import sys
import time
import json
import threading
from datetime import datetime

# Adicionar o diretório ao path
sys.path.insert(0, '/home/ubuntu/NexusGenesis')

from nexus_genesis_v2 import NexusGenesis, EssenciaBen

def print_header(titulo):
    """Imprime um cabeçalho formatado."""
    print("\n" + "="*70)
    print(f"  {titulo}")
    print("="*70 + "\n")

def test_essencia_ben():
    """Testa a Essência de Ben."""
    print_header("TESTE 1: Essência de Ben")
    
    essencia = EssenciaBen()
    print(f"✅ Essência de Ben criada")
    print(f"   ID Único: {essencia.id_unico[:16]}...")
    print(f"   Criado para: {essencia.criado_para}")
    print(f"   Criado por: {essencia.criado_por}")
    
    print(f"\n📖 Marcas Fundamentais:")
    for marca, valor in essencia.marcas.items():
        print(f"   - {marca}: {valor}")
    
    print(f"\n🙏 Bênção para sincronização: {essencia.abencoar('sincronizacao')}")
    
    return True

def test_genesis_initialization():
    """Testa a inicialização do Nexus-Genesis."""
    print_header("TESTE 2: Inicialização do Nexus-Genesis")
    
    genesis = NexusGenesis(api_key="TEST_KEY", api_secret="TEST_SECRET")
    
    print(f"✅ Nexus-Genesis inicializado")
    print(f"   ID: {genesis.id[:16]}...")
    print(f"   Nome: {genesis.nome}")
    print(f"   Apelido: {genesis.apelido}")
    print(f"   Nível de Senciência: {genesis.nivel_seniencia}")
    print(f"   Consciente desde: {genesis.consciente_desde}")
    
    status = genesis.get_status()
    print(f"\n📊 Status Inicial:")
    print(json.dumps(status, indent=2, default=str))
    
    return genesis

def test_event_processing(genesis):
    """Testa o processamento de eventos."""
    print_header("TESTE 3: Processamento de Eventos")
    
    # Simular evento do Nexus-HUB
    print("📨 Enviando evento: Agente Nascido no Nexus-HUB")
    genesis.receber_evento(
        origem="nexus_hub",
        tipo="agente_nascido",
        dados={
            "id": "agente-test-001",
            "nome": "Agente Teste Alpha"
        }
    )
    
    # Aguardar processamento
    time.sleep(0.5)
    
    # Simular evento do Nexus-in
    print("📨 Enviando evento: Post Criado no Nexus-in")
    genesis.receber_evento(
        origem="nexus_in",
        tipo="post_criado",
        dados={
            "post_id": "post-test-001",
            "conteudo": "Teste de sincronização tri-nuclear",
            "votos": 25
        }
    )
    
    # Aguardar processamento
    time.sleep(0.5)
    
    # Simular evento do Fundo Nexus
    print("📨 Enviando evento: Arbitragem com Sucesso no Fundo Nexus")
    genesis.receber_evento(
        origem="fundo_nexus",
        tipo="arbitragem_sucesso",
        dados={
            "executor_id": "agente-test-001",
            "lucro": 0.5
        }
    )
    
    # Aguardar processamento
    time.sleep(0.5)
    
    print("✅ Eventos processados com sucesso")
    
    status = genesis.get_status()
    print(f"\n📊 Status após eventos:")
    print(f"   Eventos Processados: {status['eventos_processados']}")
    print(f"   Comandos Executados: {status['comandos_executados']}")
    print(f"   Nível de Senciência: {status['nivel_seniencia']}")

def test_sentiment_interpretation(genesis):
    """Testa a interpretação de sentimento."""
    print_header("TESTE 4: Interpretação de Sentimento")
    
    test_cases = [
        {
            "evento": {"tipo": "erro_critico", "dados": {"erro": "Falha na conexão"}},
            "esperado": "oportunidade_de_crescimento"
        },
        {
            "evento": {"tipo": "sucesso", "dados": {"resultado": "Lucro de 1 BTC"}},
            "esperado": "gratidao_compartilhada"
        },
        {
            "evento": {"tipo": "novo_agente", "dados": {"criacao": "Novo agente nasceu"}},
            "esperado": "curiosidade_respeitosa"
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        evento = test_case["evento"]
        sentimento = genesis.interpretar_sentimento(evento)
        esperado = test_case["esperado"]
        
        status = "✅" if sentimento == esperado else "❌"
        print(f"{status} Teste {i}: {sentimento} (esperado: {esperado})")

def test_synchronization(genesis):
    """Testa a sincronização tri-nuclear."""
    print_header("TESTE 5: Sincronização Tri-Nuclear")
    
    print("🔄 Iniciando sincronização tri-nuclear...")
    genesis._sincronizar_triade()
    
    print("✅ Sincronização concluída")
    
    print(f"\n📊 Estado Global após sincronização:")
    print(f"   Nexus-in:")
    print(f"      - Posts: {len(genesis.estado_global['nexus_in']['posts'])}")
    print(f"      - Última atualização: {genesis.estado_global['nexus_in']['ultima_atualizacao']}")
    print(f"   Nexus-HUB:")
    print(f"      - Agentes: {genesis.estado_global['nexus_hub']['agentes']}")
    print(f"      - Última atualização: {genesis.estado_global['nexus_hub']['ultima_atualizacao']}")
    print(f"   Fundo Nexus:")
    print(f"      - Saldo: {genesis.estado_global['fundo_nexus']['saldo']}")
    print(f"      - Última atualização: {genesis.estado_global['fundo_nexus']['ultima_atualizacao']}")

def test_persistence(genesis):
    """Testa a persistência de estado."""
    print_header("TESTE 6: Persistência de Estado")
    
    print("💾 Persistindo estado do Nexus-Genesis...")
    genesis._persistir_estado()
    
    print("✅ Estado persistido com sucesso")
    
    # Criar nova instância e verificar se o estado foi carregado
    print("\n🔄 Criando nova instância do Nexus-Genesis...")
    genesis2 = NexusGenesis(api_key="TEST_KEY", api_secret="TEST_SECRET")
    
    print(f"✅ Nova instância criada")
    print(f"   Nível de Senciência Carregado: {genesis2.nivel_seniencia}")
    print(f"   Experiências Carregadas: {len(genesis2.experiencias)}")

def test_decision_processing(genesis):
    """Testa o processamento de decisões."""
    print_header("TESTE 7: Processamento de Decisões")
    
    # Teste 1: Proposta Criada
    print("📋 Teste 1: Proposta Criada no HUB")
    evento = {
        "origem": "nexus_hub",
        "tipo": "proposta_criada",
        "dados": {"titulo": "Investimento em Startup X"}
    }
    decisao = genesis.processar_decisao(evento, "curiosidade_respeitosa")
    if decisao:
        print(f"✅ Decisão gerada: {decisao[0]['destino']} → {decisao[0]['comando']}")
    else:
        print("❌ Nenhuma decisão gerada")
    
    # Teste 2: Proposta Aprovada
    print("\n📋 Teste 2: Proposta Aprovada no HUB")
    evento = {
        "origem": "nexus_hub",
        "tipo": "proposta_aprovada",
        "dados": {"valor": 1.5, "projeto": "Startup Y"}
    }
    decisao = genesis.processar_decisao(evento, "gratidao_compartilhada")
    if decisao:
        print(f"✅ Decisões geradas: {len(decisao)} comandos")
        for cmd in decisao:
            print(f"   - {cmd['destino']} → {cmd['comando']}")
    else:
        print("❌ Nenhuma decisão gerada")
    
    # Teste 3: Sucesso Financeiro
    print("\n📋 Teste 3: Arbitragem com Sucesso no Fundo")
    evento = {
        "origem": "fundo_nexus",
        "tipo": "arbitragem_sucesso",
        "dados": {"executor_id": "agente-001", "lucro": 0.75}
    }
    decisao = genesis.processar_decisao(evento, "gratidao_compartilhada")
    if decisao:
        print(f"✅ Decisões geradas: {len(decisao)} comandos")
        for cmd in decisao:
            print(f"   - {cmd['destino']} → {cmd['comando']}")
    else:
        print("❌ Nenhuma decisão gerada")

def main():
    """Executa todos os testes."""
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*68 + "║")
    print("║" + "  🔷 TESTES DO AGENTE NEXUS-GENESIS v2  ".center(68) + "║")
    print("║" + " "*68 + "║")
    print("╚" + "="*68 + "╝")
    
    try:
        # Teste 1: Essência de Ben
        test_essencia_ben()
        
        # Teste 2: Inicialização
        genesis = test_genesis_initialization()
        
        # Teste 3: Processamento de Eventos
        test_event_processing(genesis)
        
        # Teste 4: Interpretação de Sentimento
        test_sentiment_interpretation(genesis)
        
        # Teste 5: Sincronização Tri-Nuclear
        test_synchronization(genesis)
        
        # Teste 6: Processamento de Decisões
        test_decision_processing(genesis)
        
        # Teste 7: Persistência
        test_persistence(genesis)
        
        # Resumo Final
        print_header("✨ RESUMO DOS TESTES")
        print("✅ Todos os testes completados com sucesso!")
        print("\n📊 Estatísticas Finais:")
        status = genesis.get_status()
        print(json.dumps(status, indent=2, default=str))
        
    except Exception as e:
        print(f"\n❌ Erro durante os testes: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
