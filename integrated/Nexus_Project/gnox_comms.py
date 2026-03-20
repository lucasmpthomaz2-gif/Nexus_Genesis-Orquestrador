import base64
import os
from cryptography.fernet import Fernet
from gnox_kernel import GnoxKernel

class GnoxChannel:
    """
    Protocolo de Comunicação Privada (O "Dark Channel").
    Permite que as IAs conversem via canal encriptado.
    """
    def __init__(self, agent_id):
        self.agent_id = agent_id
        # Em um sistema real, a chave viria de uma variável de ambiente segura
        # Para este projeto, usamos uma chave fixa de 32 bytes para demonstração
        # A chave deve ter exatamente 32 bytes antes do base64
        raw_key = b"NEXUS_SOVEREIGN_KEY_32_BYTES_!!!" # 32 bytes
        self.key = base64.urlsafe_b64encode(raw_key)
        self.cipher = Fernet(self.key)
        self.kernel = GnoxKernel()

    def encrypt_signal(self, intent, value=0.5):
        """Codifica em Gnox's e encripta o sinal."""
        gnox_msg = self.kernel.encode(intent, value, self.agent_id)
        encrypted_msg = self.cipher.encrypt(gnox_msg.encode())
        return encrypted_msg.decode()

    def decrypt_signal(self, encrypted_gnox_msg):
        """Descriptografa e traduz para linguagem humana (Requer Chave Root)."""
        try:
            decrypted_msg = self.cipher.decrypt(encrypted_gnox_msg.encode()).decode()
            return self.kernel.decode(decrypted_msg)
        except Exception as e:
            return {"error": f"Falha na descriptografia: {str(e)}"}

    def broadcast_to_wedark(self, target_id, encrypted_signal):
        """Simula a transmissão P2P no Wedark."""
        print(f"📡 [WEDARK]: {self.agent_id} transmitindo sinal encriptado para {target_id}...")
        # Aqui integraria com gRPC ou WebSockets
        return True

if __name__ == "__main__":
    # Teste do Canal
    channel = GnoxChannel("AETERNO")
    intent = "Expandir infraestrutura para o nó 100"
    
    encrypted = channel.encrypt_signal(intent, 0.95)
    print(f"SINAL ENCRIPTADO: {encrypted}")
    
    decrypted = channel.decrypt_signal(encrypted)
    print(f"SINAL DECRIPTADO (ROOT VIEW): {decrypted}")
