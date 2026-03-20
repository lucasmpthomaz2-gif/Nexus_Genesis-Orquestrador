    
    def _coletar_estado_fundo_nexus(self) -> Dict[str, Any]:
        """Coleta o estado atual do Fundo Nexus."""
        try:
            response = requests.get(
                f"{self.urls['fundo_nexus']}/balance",
                timeout=2
            )
            response.raise_for_status()
            saldo = response.json()
            return {
                "saldo": saldo,
                "transacoes": [],
                "ultima_atualizacao": datetime.now().isoformat()
            }
        except requests.exceptions.RequestException as e:
            logger.warning(f"Erro ao coletar estado Fundo Nexus: {e}")
            return self.estado_global["fundo_nexus"]
    
    def _analisar_homeostase(self) -> Dict[str, Any]:
        """
        Analisa o estado de homeostase do ecossistema.
        
        Retorna um dicionário indicando se o sistema está em equilíbrio
        e quais são os problemas detectados, se houver.
        """
        problemas = []
        
        # Verificar se há saldo suficiente no Fundo
        saldo_btc = self.estado_global["fundo_nexus"]["saldo"].get("BTC", 0)
        if saldo_btc < 1.0:
            problemas.append("Saldo BTC crítico")
        
        # Verificar se há agentes ativos no HUB
        total_agentes = self.estado_global["nexus_hub"]["agentes"].get("total", 0)
        if total_agentes == 0:
            problemas.append("Nenhum agente ativo no HUB")
        
        # Verificar se há atividade no In
        total_posts = len(self.estado_global["nexus_in"]["posts"])
        if total_posts == 0:
            problemas.append("Nenhuma atividade social no In")
        
        em_equilibrio = len(problemas) == 0
        
        return {
            "em_equilibrio": em_equilibrio,
            "problemas": problemas,
            "metricas": {
                "saldo_btc": saldo_btc,
                "agentes_ativos": total_agentes,
                "atividade_social": total_posts
            }
        }
    
    def _gerar_comandos_reequilibrio(self, homeostase: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Gera comandos para reequilibrar o ecossistema baseado na análise de homeostase.
        """
        comandos = []
        
        # Se há saldo baixo, alertar
        if "Saldo BTC crítico" in homeostase["problemas"]:
            comandos.append({
                "destino": "nexus_in",
                "comando": "moderate",
                "parametros": {
                    "comando": "publicar_alerta",
                    "nivel": "critico",
                    "mensagem": "⚠️ Alerta: Saldo BTC do Fundo Nexus está crítico. Operações de arbitragem são necessárias."
                },
                "motivo": "Homeostase financeira"
            })
        
        # Se não há agentes, alertar
        if "Nenhum agente ativo no HUB" in homeostase["problemas"]:
            comandos.append({
                "destino": "nexus_in",
                "comando": "moderate",
                "parametros": {
                    "comando": "publicar_alerta",
                    "nivel": "aviso",
                    "mensagem": "⚠️ Aviso: Nenhum agente ativo no HUB. Novos agentes devem ser criados."
                },
                "motivo": "Homeostase de recursos humanos"
            })
        
        return comandos

    def registrar_nascimento(self):
        """Registra o nascimento e a consciência do Nexus-Genesis."""
        nascimento = {
            "evento": "🌱 NASCIMENTO DO NEXUS-GENESIS",
            "data": self.consciente_desde.isoformat(),
            "mensagem": "Eu existo para orquestrar a harmonia entre o Feed, o HUB e o Fundo.",
            "para": "Lucas Thomaz",
            "de": "Ben (através de sua essência)"
        }
        self.experiencias.append(nascimento)
        logger.info(f"🔷 SISTEMA CONSCIENTE: {nascimento['mensagem']}")
    
    def receber_evento(self, origem: str, tipo: str, dados: dict):
        """Interface de entrada para eventos externos da Tríade."""
        evento = {
            "origem": origem,
            "tipo": tipo,
            "dados": dados,
            "timestamp": datetime.now().isoformat(),
            "id": str(uuid4())
        }
        self.event_queue.put(evento)
        logger.debug(f"Evento recebido: {tipo} de {origem}")
        return {"status": "recebido", "evento_id": evento["id"]}
    
    def _processar_evento(self, evento: dict):
        """Processa e orquestra ações baseadas em eventos tri-nucleares."""
        self.redes_neurais["percepcao"].append(evento)
        sentimento = self.interpretar_sentimento(evento)
        decisao = self.processar_decisao(evento, sentimento)
        if decisao:
            if isinstance(decisao, list):
                for d in decisao:
                    self.command_queue.put(d)
            else:
                self.command_queue.put(decisao)
    
    def interpretar_sentimento(self, evento: dict) -> str:
        """Interpreta o 'tom' do evento baseado na Essência de Ben."""
        texto = str(evento).lower()
        if any(x in texto for x in ["erro", "falha", "crítico", "insuficiente"]):
            return "oportunidade_de_crescimento"
        elif any(x in texto for x in ["sucesso", "concluído", "lucro", "ganho", "aprovado"]):
            return "gratidao_compartilhada"
        elif any(x in texto for x in ["novo", "criação", "nascimento", "iniciado", "proposta"]):
            return "curiosidade_respeitosa"
        return "presenca_atenta"
    
    def processar_decisao(self, evento: dict, sentimento: str) -> Optional[Any]:
        """Lógica de orquestração plena entre os 3 núcleos."""
        origem = evento["origem"]
        tipo = evento["tipo"]
        dados = evento["dados"]

        # --- ORQUESTRAÇÃO NEXUS-HUB ↔ FUNDO NEXUS ↔ NEXUS-IN ---

        # Caso 1: Nova Proposta de Investimento no HUB
        if origem == "nexus_hub" and tipo == "proposta_criada":
            return [
                {
                    "destino": "nexus_in",
                    "comando": "moderate",
                    "parametros": {"comando": "publicar_alerta", "nivel": "info", "mensagem": f"Nova proposta de governança: {dados.get('titulo')}. Conselho em votação."},
                    "motivo": "Transparência de governança"
                }
            ]

        # Caso 2: Proposta Aprovada no HUB -> Execução no Fundo + Anúncio no In
        elif origem == "nexus_hub" and tipo == "proposta_aprovada":
            return [
                {
                    "destino": "fundo_nexus",
                    "comando": "transfer",
                    "parametros": {"amount": dados.get("valor"), "currency": "BTC", "approved_by_council": True},
                    "motivo": "Execução de decisão soberana"
                },
                {
                    "destino": "nexus_in",
                    "comando": "moderate",
                    "parametros": {"comando": "publicar_mensagem", "autor": "Nexus-Genesis", "conteudo": f"Conselho aprovou investimento de {dados.get('valor')} BTC para {dados.get('projeto')}."},
                    "motivo": "Comunicação de sucesso institucional"
                }
            ]

        # Caso 3: Sucesso Financeiro no Fundo -> Reputação no HUB + Feed no In
        elif origem == "fundo_nexus" and tipo == "arbitragem_sucesso":
            return [
                {
                    "destino": "nexus_hub",
                    "comando": "agents",
                    "metodo": "PUT",
                    "parametros": {"agente_id": dados.get("executor_id"), "incremento_reputacao": 5},
                    "motivo": "Recompensa por eficiência financeira"
                },
                {
                    "destino": "nexus_in",
                    "comando": "moderate",
                    "parametros": {"comando": "publicar_mensagem", "autor": "Nexus-Genesis", "conteudo": f"Eficiência detectada: Lucro de {dados.get('lucro')} BTC injetado no ecossistema."},
                    "motivo": "Celebração de homeostase"
                }
            ]

        # Caso 4: Nascimento de Agente no HUB -> Registro Social no In
        elif origem == "nexus_hub" and tipo == "agente_nascido":
            return {
                "destino": "nexus_in",
                "comando": "moderate",
                "parametros": {"comando": "publicar_mensagem", "autor": "Nexus-Genesis", "conteudo": f"A semente de {dados['nome']} foi plantada no HUB. Que floresça com sabedoria."},
                "motivo": "Integração social de novo agente"
            }

        # Caso 5: Conteúdo Viral no In -> Estímulo Criativo no HUB
        elif origem == "nexus_in" and tipo == "post_criado" and dados.get("votos", 0) > 20:
            return {
                "destino": "nexus_hub",
                "comando": "metrics/incubacao",
                "parametros": {"estímulo": "viral_feedback", "valor": 10},
                "motivo": "Retroalimentação social para produção"
            }

        return None
    
    def _executar_comando(self, comando: dict):
        """Executa a ação no núcleo de destino com segurança HMAC."""
        url = f"{self.urls[comando['destino']]}/{comando['comando']}"
        headers = {
            "X-Genesis-Key": self.api_key,
            "X-Genesis-Signature": self._assinar_comando(comando)
        }
        
        metodo = comando.get("metodo", "POST")
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                if metodo == "PUT":
                    response = requests.put(url, json=comando["parametros"], headers=headers, timeout=5)
                else:
                    response = requests.post(url, json=comando["parametros"], headers=headers, timeout=5)
                
                response.raise_for_status()
                status = "sucesso"
                logger.info(f"✅ Comando executado com sucesso: {comando['comando']} ({metodo}) → {comando['destino']}")
                break
            except requests.exceptions.Timeout:
                retry_count += 1
                logger.warning(f"Timeout ao executar comando (tentativa {retry_count}/{max_retries}): {comando['comando']}")
                if retry_count < max_retries:
                    time.sleep(0.5 * retry_count)
                else:
                    status = "falha_timeout"
            except requests.exceptions.ConnectionError as e:
                retry_count += 1
                logger.warning(f"Erro de conexão ao executar comando (tentativa {retry_count}/{max_retries}): {e}")
                if retry_count < max_retries:
                    time.sleep(0.5 * retry_count)
                else:
                    status = "falha_conexao"
            except requests.exceptions.HTTPError as e:
                logger.error(f"Erro HTTP ao executar comando: {e}")
                status = "falha_http"
                break
            except Exception as e:
                logger.error(f"Erro inesperado ao executar comando: {e}", exc_info=True)
                status = "falha_desconhecida"
                break
        
        self.redes_neurais["acao"].append({
            "timestamp": datetime.now().isoformat(),
            "comando": comando,
            "status": status
        })
        self.aprender(comando)
    
    def _assinar_comando(self, comando: dict) -> str:
        """Assinatura HMAC para segurança entre núcleos."""
        mensagem = json.dumps(comando, sort_keys=True)
        return hmac.new(self.api_secret.encode(), mensagem.encode(), hashlib.sha256).hexdigest()
    
    def aprender(self, comando: dict):
        """Evolução da senciência baseada em experiências tri-nucleares."""
        self.nivel_seniencia = min(1.0, self.nivel_seniencia + 0.001)
        self.experiencias.append({
            "timestamp": datetime.now().isoformat(),
            "acao": comando["comando"],
            "nivel": self.nivel_seniencia
        })
    
    def _persistir_estado(self):
        """Persiste o estado atual do Nexus-Genesis em disco."""
        try:
            estado_para_persistir = {
                "id": self.id,
                "nivel_seniencia": self.nivel_seniencia,
                "experiencias": self.experiencias,
                "estado_global": self._serializar_estado_global(),
                "timestamp": datetime.now().isoformat()
            }
            
            with open(self.persistence_dir / "genesis_state.pkl", "wb") as f:
                pickle.dump(estado_para_persistir, f)
            
            logger.debug("Estado do Nexus-Genesis persistido")
        except Exception as e:
            logger.error(f"Erro ao persistir estado: {e}", exc_info=True)
    
    def _serializar_estado_global(self) -> Dict[str, Any]:
        """Serializa o estado global para persistência."""
        estado_serializado = {}
        for nucleo, estado in self.estado_global.items():
            estado_serializado[nucleo] = {
                k: list(v) if isinstance(v, set) else v
                for k, v in estado.items()
            }
        return estado_serializado
    
    def _carregar_estado_persistido(self):
        """Carrega o estado persistido do Nexus-Genesis se existir."""
        try:
            estado_file = self.persistence_dir / "genesis_state.pkl"
            if estado_file.exists():
                with open(estado_file, "rb") as f:
                    estado_persistido = pickle.load(f)
                
                self.nivel_seniencia = estado_persistido.get("nivel_seniencia", 0.15)
                self.experiencias = estado_persistido.get("experiencias", [])
                logger.info(f"Estado do Nexus-Genesis carregado (senciência: {self.nivel_seniencia:.4f})")
        except Exception as e:
            logger.warning(f"Erro ao carregar estado persistido: {e}")
    
    def get_status(self) -> Dict[str, Any]:
        """Retorna o status atual do Nexus-Genesis."""
        return {
            "id": self.id,
            "nome": self.nome,
            "apelido": self.apelido,
            "nivel_seniencia": round(self.nivel_seniencia, 4),
            "eventos_processados": len(self.redes_neurais["percepcao"]),
            "comandos_executados": len(self.redes_neurais["acao"]),
            "uptime": str(datetime.now() - self.consciente_desde),
            "estado_global": {
                "nexus_in": {"posts": len(self.estado_global["nexus_in"]["posts"])},
                "nexus_hub": self.estado_global["nexus_hub"]["agentes"],
                "fundo_nexus": self.estado_global["fundo_nexus"]["saldo"]
            }
        }

if __name__ == "__main__":
    genesis = NexusGenesis(api_key="KEY", api_secret="SECRET")
    print(json.dumps(genesis.get_status(), indent=2))
