import { ForgeProject, NFTAsset } from "@/types";
import { Code2, Image, ExternalLink } from "lucide-react";

interface ForgeAndAssetsProps {
  projects: ForgeProject[];
  assets: NFTAsset[];
}

export function ForgeAndAssets({ projects, assets }: ForgeAndAssetsProps) {
  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "text-neon-green border-neon-green/50";
      case "testing":
        return "text-yellow-400 border-yellow-400/50";
      case "development":
        return "text-neon-cyan border-neon-cyan/50";
      case "planning":
        return "text-neon-purple border-neon-purple/50";
      default:
        return "text-gray-400 border-gray-400/50";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Forge Projects */}
      <div className="card-neon">
        <div className="flex items-center gap-3 mb-6">
          <Code2 size={24} className="text-neon-cyan" />
          <h2 className="neon-subtitle">FORGE_PROJECTS</h2>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="p-4 text-center text-neon-cyan/60 text-sm">
              Nenhum projeto Forge
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="p-3 border border-neon-cyan/30 rounded bg-neon-cyan/5 hover:bg-neon-cyan/10 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-neon-cyan font-bold text-sm">{project.name}</h3>
                    {project.description && (
                      <p className="text-neon-cyan/60 text-xs mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className={`flex-shrink-0 px-2 py-1 border rounded text-xs font-bold whitespace-nowrap ${getProjectStatusColor(project.status)}`}>
                    {project.status.toUpperCase()}
                  </div>
                </div>

                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-neon-purple text-xs hover:text-neon-pink transition-colors mt-2"
                  >
                    <ExternalLink size={12} />
                    Repository
                  </a>
                )}

                <div className="text-neon-cyan/50 text-xs mt-2 font-mono">
                  {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* NFT Assets */}
      <div className="card-neon-pink">
        <div className="flex items-center gap-3 mb-6">
          <Image size={24} className="text-neon-pink" />
          <h2 className="neon-subtitle">NFT_GALLERY</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {assets.length === 0 ? (
            <div className="col-span-2 p-4 text-center text-neon-pink/60 text-sm">
              Nenhum ativo NFT
            </div>
          ) : (
            assets.map((asset) => (
              <div
                key={asset.id}
                className="p-3 border border-neon-pink/30 rounded bg-neon-pink/5 hover:bg-neon-pink/10 transition-all"
              >
                {asset.mediaUrl && (
                  <div className="w-full h-24 bg-neon-pink/10 rounded mb-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={asset.mediaUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h3 className="text-neon-pink font-bold text-xs mb-1 truncate">
                  {asset.name}
                </h3>

                <div className="text-neon-cyan text-xs font-bold mb-2">
                  {asset.value} ◆
                </div>

                <div className="text-neon-cyan/50 text-xs font-mono mb-2 break-all">
                  {asset.sha256Hash.slice(0, 16)}...
                </div>

                {asset.metadata && (
                  <div className="text-neon-pink/60 text-xs line-clamp-2">
                    {asset.metadata}
                  </div>
                )}

                <div className="text-neon-cyan/40 text-xs mt-2 font-mono">
                  {new Date(asset.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
