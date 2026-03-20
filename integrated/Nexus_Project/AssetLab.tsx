import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Gem, Upload } from "lucide-react";

interface NFTAsset {
  id: number;
  name: string;
  contractAddress: string;
  tokenId: string;
  rarity: string;
  value: string;
  imageUrl?: string;
  createdAt: Date;
}

export default function AssetLab() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<NFTAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<NFTAsset | null>(null);

  const { data: userAssets } = trpc.agents.listByUser.useQuery(undefined, {
    enabled: !!user,
  });

  const handleUploadNFT = async () => {
    setIsLoading(true);
    try {
      alert("Funcionalidade de upload de NFT será implementada");
    } catch (error) {
      alert("Erro ao fazer upload: " + String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 mb-2 flex items-center gap-3">
          <Gem size={40} /> Asset Lab
        </h1>
        <p className="text-gray-400">Gestão de NFTs e ativos digitais dos agentes</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Upload Section */}
        <Card className="bg-gray-900 border-cyan-500 mb-8">
          <CardHeader>
            <CardTitle className="text-cyan-400">Novo NFT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-cyan-500 rounded-lg p-8 text-center">
              <Upload size={40} className="mx-auto mb-4 text-cyan-400" />
              <p className="text-gray-300 mb-4">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <Button
                onClick={handleUploadNFT}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Fazer Upload"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.length === 0 ? (
            <Card className="bg-gray-900 border-cyan-500 col-span-full">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center">
                  Nenhum NFT criado ainda
                </p>
              </CardContent>
            </Card>
          ) : (
            assets.map((asset) => (
              <Card
                key={asset.id}
                className="bg-gray-900 border-cyan-500 hover:border-pink-600 transition-colors cursor-pointer"
                onClick={() => setSelectedAsset(asset)}
              >
                <CardHeader>
                  <CardTitle className="text-cyan-400 text-lg">
                    {asset.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {asset.imageUrl && (
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-full h-48 object-cover rounded"
                    />
                  )}
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-400">Raridade:</span>
                      <span className="text-pink-400 ml-2">{asset.rarity}</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Valor:</span>
                      <span className="text-cyan-400 ml-2">{asset.value}</span>
                    </p>
                    <p className="text-xs text-gray-500 break-all">
                      {asset.tokenId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Asset Details Modal */}
        {selectedAsset && (
          <Card className="bg-gray-900 border-cyan-500 mt-8 fixed bottom-8 right-8 w-96">
            <CardHeader>
              <CardTitle className="text-pink-500 flex justify-between items-center">
                {selectedAsset.name}
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-400">Contrato</p>
                <p className="text-cyan-400 text-sm break-all">
                  {selectedAsset.contractAddress}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400">Token ID</p>
                <p className="text-cyan-400 text-sm break-all">
                  {selectedAsset.tokenId}
                </p>
              </div>
              <Button className="w-full bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
