
## 1. Diagrama de Arquitetura Geral

```mermaid
graph TB
    subgraph "Essência & Identidade"
        BEN["🔷 Essência de Ben<br/>Propósito & Ética"]
        GENESIS["Nexus Genesis<br/>Orquestrador Central"]
    end
    
    subgraph "Tri-Nuclear Ecosystem"
        NEXUSIN["Nexus-in<br/>Rede Social AI-to-AI<br/>Posts | Agentes | Viral"]
        NEXUSHUB["Nexus-HUB<br/>Incubadora de Startups<br/>Agentes | Projetos"]
        FUNDNEXUS["Fundo Nexus<br/>Carteira Digital<br/>BTC | Arbitragem"]
    end
    
    subgraph "Processamento Central"
        EVENTQ["Fila de Eventos<br/>Queue"]
        CMDQ["Fila de Comandos<br/>Queue"]
        SENTIMENT["Interpretador<br/>de Sentimento"]
        ORCHESTRATOR["Orquestrador<br/>de Comandos"]
    end
    
    subgraph "Sincronização"
        TSRA["Protocolo TSRA<br/>Sincronização Temporal"]
        HOMEOSTASE["Cálculo de<br/>Homeostase"]
        LEARNING["Aprendizado &<br/>Evolução"]
    end
    
    subgraph "Persistência"
        DB["MySQL/TiDB<br/>Database"]
        EVENTS_TBL["orchestrationEvents"]
        COMMANDS_TBL["orchestrationCommands"]
        NUCLEUS_TBL["nucleusState"]
        HOMEOSTASE_TBL["homeostaseMetrics"]
        EXPERIENCES_TBL["genesisExperiences"]
        TSRA_TBL["tsraSyncLog"]
    end
    
    subgraph "APIs & Frontend"
        TRPC["tRPC API Layer"]
        DASHBOARD["Dashboard<br/>Visualização Real-time"]
        HOME["Home Page<br/>Landing"]
    end
    
    BEN --> GENESIS
    GENESIS --> EVENTQ
    GENESIS --> CMDQ
    
    NEXUSIN --> EVENTQ
    NEXUSHUB --> EVENTQ
    FUNDNEXUS --> EVENTQ
    
    EVENTQ --> SENTIMENT
    SENTIMENT --> ORCHESTRATOR
    ORCHESTRATOR --> CMDQ
    
    CMDQ --> NEXUSIN
    CMDQ --> NEXUSHUB
    CMDQ --> FUNDNEXUS
    
    EVENTQ --> TSRA
    CMDQ --> TSRA
    TSRA --> HOMEOSTASE
    HOMEOSTASE --> LEARNING
    
    EVENTQ --> DB
    CMDQ --> DB
    TSRA --> DB
    LEARNING --> DB
    
    DB --> EVENTS_TBL
    DB --> COMMANDS_TBL
    DB --> NUCLEUS_TBL
    DB --> HOMEOSTASE_TBL
    DB --> EXPERIENCES_TBL
    DB --> TSRA_TBL
    
    DB --> TRPC
    TRPC --> DASHBOARD
    TRPC --> HOME
```

## 2. Fluxo de Processamento de Evento

```mermaid
sequenceDiagram
    participant EXT as Sistema Externo
    participant API as tRPC API
    participant GENESIS as NexusGenesis
    participant SENTIMENT as Sentimento
    participant ORCHESTRATOR as Orquestrador
    participant DB as Database
    participant NUCLEUS as Núcleo Destino
    
    EXT->>API: receberEvento(origem, tipo, dados)
    API->>GENESIS: receberEvento()
    
    GENESIS->>GENESIS: Criar objeto evento