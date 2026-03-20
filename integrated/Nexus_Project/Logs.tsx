import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Trash2,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { useState, useMemo } from "react";

export default function Logs() {
  const { user, loading: authLoading } = useAuth();
  const [filterType, setFilterType] = useState<string>("");
  const [filterSeverity, setFilterSeverity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(100);

  // Query
  const { data: alerts, isLoading, refetch } = trpc.alerts.getAlerts.useQuery(
    {
      type: filterType || undefined,
      severity: filterSeverity || undefined,
      limit,
    },
    { enabled: !!user }
  );

  const { data: stats } = trpc.alerts.getStats.useQuery(undefined, { enabled: !!user });

  // Mutations
  const { mutate: resolveAlert } = trpc.alerts.resolve.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: clearAlerts } = trpc.alerts.clear.useMutation({
    onSuccess: () => refetch(),
  });

  // Filter and search
  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((alert) =>
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [alerts, searchTerm]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500/50 bg-red-500/5";
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/5";
      default:
        return "border-green-500/50 bg-green-500/5";
    }
  };

  const handleExportJSON = () => {
    if (!alerts) return;
    const json = JSON.stringify(alerts, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-logs-${Date.now()}.json`;
    a.click();
  };

  const handleExportCSV = () => {
    if (!alerts) return;
    const csv = [
      ["Timestamp", "Type", "Severity", "Message", "Resolved"],
      ...alerts.map((a) => [
        new Date(a.timestamp).toLocaleString(),
        a.type,
        a.severity,
        a.message,
        a.resolved ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-logs-${Date.now()}.csv`;
    a.click();
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">System Logs</h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportJSON}
                className="btn-neon-cyan text-xs"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-1" />
                JSON
              </Button>
              <Button
                onClick={handleExportCSV}
                className="btn-neon-cyan text-xs"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="px-3 py-2 bg-red-500/10 border border-red-500/50 rounded text-xs">
                <p className="text-red-400 font-bold">{stats.critical}</p>
                <p className="text-muted-foreground text-xs">Critical</p>
              </div>
              <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/50 rounded text-xs">
                <p className="text-yellow-400 font-bold">{stats.warnings}</p>
                <p className="text-muted-foreground text-xs">Warnings</p>
              </div>
              <div className="px-3 py-2 bg-green-500/10 border border-green-500/50 rounded text-xs">
                <p className="text-green-400 font-bold">{stats.resolved}</p>
                <p className="text-muted-foreground text-xs">Resolved</p>
              </div>
              <div className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/50 rounded text-xs">
                <p className="text-cyan-400 font-bold">{stats.total}</p>
                <p className="text-muted-foreground text-xs">Total</p>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container py-8">
        {/* Filters */}
        <Card className="card-neon p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-accent" />
            <h3 className="font-bold text-sm">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-background/50 border border-border/50 rounded text-xs focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded text-xs focus:outline-none focus:border-accent"
              >
                <option value="">All Types</option>
                <option value="health">Health</option>
                <option value="database">Database</option>
                <option value="memory">Memory</option>
                <option value="disk">Disk</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Severity</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded text-xs focus:outline-none focus:border-accent"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Limit</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded text-xs focus:outline-none focus:border-accent"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Logs List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-accent w-8 h-8" />
          </div>
        ) : filteredAlerts && filteredAlerts.length > 0 ? (
          <div className="space-y-2">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`card-neon p-4 border-2 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm">{alert.type.toUpperCase()}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            alert.severity === "critical"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {alert.severity}
                        </span>
                        {alert.resolved && (
                          <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground mb-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && user?.role === "admin" && (
                    <Button
                      onClick={() => resolveAlert({ alertId: alert.id })}
                      className="btn-neon text-xs ml-4"
                      size="sm"
                      variant="outline"
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-neon p-8 text-center">
            <p className="text-muted-foreground">Nenhum log encontrado</p>
          </Card>
        )}

        {/* Clear Button */}
        {user?.role === "admin" && alerts && alerts.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => {
                if (confirm("Tem certeza que deseja limpar todos os logs?")) {
                  clearAlerts();
                }
              }}
              className="btn-neon text-sm"
              variant="outline"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Logs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
