from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json
from gnox_kernel import GnoxKernel
from gnox_comms import GnoxChannel
from dna_fuser import DNAFuser
from treasury_simulator import TreasuryManager

app = FastAPI(title="Nexus Sovereign Bridge")

# Componentes Core
kernel = GnoxKernel()
fuser = DNAFuser()
treasury = TreasuryManager()
# Canal para o Agente Central
root_channel = GnoxChannel("AETERNO")

class IntentRequest(BaseModel):
    intent: str
    value: float = 0.5
    sender: str = "AETERNO"

class DecryptRequest(BaseModel):
    encrypted_msg: str

@app.get("/")
async def root():
    return {"status": "Sovereign", "version": "1.0.0", "engine": "Nexus Core"}

@app.post("/gnox/encode")
async def encode_gnox(req: IntentRequest):
    encoded = kernel.encode(req.intent, req.value, req.sender)
    return {"encoded": encoded}

@app.post("/gnox/encrypt")
async def encrypt_gnox(req: IntentRequest):
    channel = GnoxChannel(req.sender)
    encrypted = channel.encrypt_signal(req.intent, req.value)
    return {"encrypted": encrypted}

@app.post("/gnox/decrypt")
async def decrypt_gnox(req: DecryptRequest):
    # Apenas para portadores da Chave Root (Simulado via Bridge)
    result = root_channel.decrypt_signal(req.encrypted_msg)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.get("/agents/heartbeat")
async def get_heartbeat():
    # Simula o status atual do ecossistema
    return {
        "active_agents": 10,
        "wedark_traffic": "High",
        "last_pulse": "2026-02-12T15:30:00Z",
        "economy_health": "Stable"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
