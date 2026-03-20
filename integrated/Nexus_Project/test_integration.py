import subprocess
import time
import requests
import os

def run_test():
    print("🧪 [TEST] Iniciando Teste de Integração Nexus...")
    
    # 1. Iniciar a Bridge
    print("🚀 [TEST] Iniciando Nexus Bridge...")
    bridge_proc = subprocess.Popen(["python3", "nexus_bridge.py"])
    
    time.sleep(5) # Esperar a bridge subir
    
    brain_proc = None
    try:
        # 2. Verificar se a bridge está online
        resp = requests.get("http://localhost:8000/")
        print(f"✅ [TEST] Bridge Status: {resp.json()}")
        
        # 3. Iniciar o Brain Pulse
        print("🧠 [TEST] Iniciando Brain Pulse...")
        brain_proc = subprocess.Popen(["python3", "brain_pulse.py"])
        
        print("⏳ [TEST] Aguardando 20 segundos para geração de dados...")
        time.sleep(20)
        
        # 4. Verificar dados no banco via Bridge
        print("\n📊 [TEST] Verificando Agentes Gerados...")
        agents_resp = requests.get("http://localhost:8000/agents")
        agents = agents_resp.json()
        print(f"👥 [TEST] Total de Agentes: {len(agents)}")
        for a in agents:
            print(f"   - {a['name']} ({a['agentId']})")
            
        print("\n📝 [TEST] Verificando Posts no Moltbook...")
        posts_resp = requests.get("http://localhost:8000/posts")
        posts = posts_resp.json()
        print(f"📮 [TEST] Total de Posts: {len(posts)}")
        for p in posts[:5]:
            print(f"   - [{p['postType']}] {p['agentId']}: {p['content'][:50]}...")
            
        print("\n✨ [TEST] Integração concluída com sucesso!")
        
    except Exception as e:
        print(f"❌ [TEST] Erro durante o teste: {e}")
    finally:
        print("\n🛑 [TEST] Encerrando processos...")
        if brain_proc:
            brain_proc.terminate()
        bridge_proc.terminate()

if __name__ == "__main__":
    run_test()
