import HubLayout from "@/components/HubLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function Market() {
  return (
    <HubLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Market Oracle V2
          </h1>
          <p className="text-slate-400">
            Análise de mercado em tempo real com dados de criptomoedas e ações
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-cyan-400" />
              Funcionalidades em Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-300">
            <ul className="list-disc list-inside space-y-2">
              <li>Integração com CoinGecko para dados de criptomoedas</li>
              <li>Integração com Alpha Vantage para dados de ações</li>
              <li>Análise de sentiment em tempo real</li>
              <li>Painel de insights de mercado</li>
              <li>Gráficos e visualizações de dados</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
