import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Loader2,
  Zap,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink,
  Copy,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  provider: "stripe" | "github" | "discord" | "telegram";
  status: "connected" | "disconnected" | "error";
  apiKey?: string;
  webhookUrl?: string;
  lastSync?: Date;
  features: string[];
}

export default function Integrations() {
  const { user, loading: authLoading } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "stripe-1",
      name: "Stripe Payments",
      provider: "stripe",
      status: "disconnected",
      features: ["Payments", "Subscriptions", "Invoices"],
    },
    {
      id: "github-1",
      name: "GitHub Repositories",
      provider: "github",
      status: "disconnected",
      features: ["Code Storage", "CI/CD", "Webhooks"],
    },
    {
      id: "discord-1",
      name: "Discord Notifications",
      provider: "discord",
      status: "disconnected",
      features: ["Alerts", "Messages", "Webhooks"],
    },
    {
      id: "telegram-1",
      name: "Telegram Bot",
      provider: "telegram",
      status: "disconnected",
      features: ["Alerts", "Commands", "Notifications"],
    },
  ]);

  const [showNewIntegration, setShowNewIntegration] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const handleConnectIntegration = (integration: Integration) => {
    if (!apiKeyInput) return;

    const updated = integrations.map((i) =>
      i.id === integration.id
        ? {
            ...i,
            status: "connected" as const,
            apiKey: apiKeyInput,
            lastSync: new Date(),
          }
        : i
    );

    setIntegrations(updated);
    setApiKeyInput("");
    setSelectedIntegration(null);
  };

  const handleDisconnect = (id: string) => {
    const updated = integrations.map((i) =>
      i.id === id
        ? {
            ...i,
            status: "disconnected" as const,
            apiKey: undefined,
            lastSync: undefined,
          }
        : i
    );

    setIntegrations(updated);
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "stripe":
        return "text-blue-400";
      case "github":
        return "text-gray-400";
      case "discord":
        return "text-purple-400";
      case "telegram":
        return "text-cyan-400";
      default:
        return "text-accent";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "connected" ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : status === "error" ? (
      <AlertCircle className="w-5 h-5 text-red-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-400" />
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Integrations</h1>
            </div>
            <Button onClick={() => setShowNewIntegration(!showNewIntegration)} className="btn-neon text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-neon p-4">
            <p className="text-xs text-muted-foreground mb-2">Total Integrations</p>
            <p className="text-2xl font-bold neon-glow">{integrations.length}</p>
          </Card>
          <Card className="card-neon p-4">
            <p className="text-xs text-muted-foreground mb-2">Connected</p>
            <p className="text-2xl font-bold text-green-400">
              {integrations.filter((i) => i.status === "connected").length}
            </p>
          </Card>
          <Card className="card-neon p-4">
            <p className="text-xs text-muted-foreground mb-2">Disconnected</p>
            <p className="text-2xl font-bold text-yellow-400">
              {integrations.filter((i) => i.status === "disconnected").length}
            </p>
          </Card>
          <Card className="card-neon p-4">
            <p className="text-xs text-muted-foreground mb-2">Errors</p>
            <p className="text-2xl font-bold text-red-400">
              {integrations.filter((i) => i.status === "error").length}
            </p>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="card-neon p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getStatusIcon(integration.status)}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{integration.name}</h3>
                    <p className={`text-xs ${getProviderColor(integration.provider)}`}>
                      {integration.provider.toUpperCase()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    integration.status === "connected"
                      ? "border-green-400/50 text-green-400 bg-green-400/10"
                      : integration.status === "error"
                      ? "border-red-400/50 text-red-400 bg-red-400/10"
                      : "border-yellow-400/50 text-yellow-400 bg-yellow-400/10"
                  }`}
                >
                  {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                </span>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Features</p>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-2 py-1 rounded border border-border bg-background/50"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Last Sync */}
              {integration.lastSync && (
                <p className="text-xs text-muted-foreground mb-4">
                  Last synced: {integration.lastSync.toLocaleString()}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {integration.status === "connected" ? (
                  <>
                    <Button
                      onClick={() => setSelectedIntegration(integration)}
                      className="btn-neon text-xs flex-1"
                      size="sm"
                      variant="outline"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                    <Button
                      onClick={() => handleDisconnect(integration.id)}
                      className="btn-neon text-xs flex-1"
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setSelectedIntegration(integration)}
                    className="btn-neon text-xs w-full"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Connection Modal */}
        {selectedIntegration && selectedIntegration.status === "disconnected" && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="card-neon p-6 max-w-md w-full">
              <h2 className="text-xl font-bold neon-glow mb-4">
                Connect {selectedIntegration.name}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">API Key</label>
                  <input
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                  />
                </div>

                <div className="p-3 bg-background/50 rounded border border-border text-xs text-muted-foreground">
                  <p className="mb-2">
                    Get your API key from {selectedIntegration.provider.toUpperCase()}:
                  </p>
                  <Button
                    onClick={() =>
                      window.open(
                        `https://${selectedIntegration.provider}.com/api`,
                        "_blank"
                      )
                    }
                    className="btn-neon text-xs w-full"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Get API Key
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleConnectIntegration(selectedIntegration)}
                    disabled={!apiKeyInput}
                    className="btn-neon text-xs flex-1"
                  >
                    Connect
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedIntegration(null);
                      setApiKeyInput("");
                    }}
                    className="text-xs flex-1"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Modal */}
        {selectedIntegration && selectedIntegration.status === "connected" && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="card-neon p-6 max-w-md w-full">
              <h2 className="text-xl font-bold neon-glow mb-4">
                {selectedIntegration.name} Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={selectedIntegration.apiKey || ""}
                      readOnly
                      className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedIntegration.apiKey || "");
                        alert("API Key copied to clipboard");
                      }}
                      className="btn-neon text-xs"
                      size="sm"
                      variant="outline"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {selectedIntegration.webhookUrl && (
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Webhook URL</label>
                    <input
                      type="text"
                      value={selectedIntegration.webhookUrl}
                      readOnly
                      className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedIntegration(null)}
                    className="btn-neon text-xs flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
