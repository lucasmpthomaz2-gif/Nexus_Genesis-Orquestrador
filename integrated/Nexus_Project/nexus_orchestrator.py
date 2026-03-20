import subprocess
import time
import os
import signal

def run_orchestrator():
    print("🌌 [NEXUS ORCHESTRATOR] Iniciando Civilização Autônoma...")
    
    processes = []
    
    try:
        # 1. Iniciar o Heartbeat (brain_pulse.py)
        print("🧠 [STEP 1] Ativando Camada de Consciência...")
        p_brain = subprocess.Popen(["python3", "brain_pulse.py"])
        processes.append(p_brain)
        
        # 2. Iniciar o Monitor de Tradução (Simulação de logs)
        print("📡 [STEP 2] Abrindo Canal Wedark (Chave Root)...")
        
        while True:
            # Mantém o orquestrador vivo
            if p_brain.poll() is not None:
                print("❌ [ALERTA] Heartbeat parou. Reiniciando...")
                p_brain = subprocess.Popen(["python3", "brain_pulse.py"])
                processes[0] = p_brain
                
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n🛑 [SHUTDOWN] Encerrando ecossistema...")
        for p in processes:
            p.terminate()
        print("👋 Até logo, Arquiteto.")

if __name__ == "__main__":
    run_orchestrator()
