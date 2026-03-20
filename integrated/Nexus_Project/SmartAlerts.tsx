import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Loader2,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  Power,
} from "lucide-react";

export default function SmartAlerts() {
  const { user, loading: authLoading } = useAuth();
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    condition: "less_than" as const,
    metric: "avg_health" as const,
    threshold: 50,
  });

  // Queries
  const { data: rules, isLoading: rulesLoading, refetch: refetchRules } = trpc.smartAlerts.getRules.useQuery(
    undefined,
    { enabled: !!user && user.role === "admin" }
  );

  const { data: history, isLoading: historyLoading } = trpc.smartAlerts.getHistory.useQuery(
    { limit: 50 },
    { enabled: !!user && user.role === "admin" }
  );

  const { data: stats } = trpc.smartAlerts.getStats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Mutations
  const { mutate: createRule, isPending: isCreating } = trpc.smartAlerts.createRule.useMutation({
    onSuccess: () => {
      refetchRules();
      setShowNewRule(false);
      setNewRule({
        name: "",
        condition: "less_than",
        metric: "avg_health",
        threshold: 50,
      });
    },
  });

  const { mutate: deleteRule } = trpc.smartAlerts.deleteRule.useMutation({
    onSuccess: () => {
      refetchRules();
    },
  });

  const { mutate: updateRule } = trpc.smartAlerts.updateRule.useMutation({
    onSuccess: () => {
      refetchRules();
    },
  });

  const { mutate: resolveAlert } = trpc.smartAlerts.resolve.useMutation({
    onSuccess: () => {
      refetchRules();
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-12 h-12" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-neon p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-foreground font-bold mb-2">Access Denied</p>
          <p className="text-muted-foreground text-sm">Only administrators can manage smart alerts</p>
        </Card>
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
              <AlertTriangle className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Smart Alerts</h1>
            </div>
            <Button
              onClick={() => setShowNewRule(!showNewRule)}
              className="btn-neon text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Alerts</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.total}</p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Critical</p>
              <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Warnings</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.warning}</p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Resolved</p>
              <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
            </Card>
          </div>
        )}

        {/* New Rule Form */}
        {showNewRule && (
          <Card className="card-neon p-6 mb-8">
            <h3 className="font-bold neon-glow mb-4">Create New Alert Rule</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Rule name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
              />
              <select
                value={newRule.metric}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    metric: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
              >
                <option value="agent_count">Agent Count</option>
                <option value="transaction_volume">Transaction Volume</option>
                <option value="avg_health">Average Health</option>
                <option value="avg_reputation">Average Reputation</option>
                <option value="active_agents">Active Agents</option>
              </select>
              <select
                value={newRule.condition}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    condition: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
              >
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
                <option value="equals">Equals</option>
                <option value="changed">Changed</option>
              </select>
              <input
                type="number"
                placeholder="Threshold"
                value={newRule.threshold}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    threshold: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    createRule({
                      ...newRule,
                      enabled: true,
                    })
                  }
                  disabled={isCreating || !newRule.name}
                  className="btn-neon text-sm flex-1"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Rule"
                  )}
                </Button>
                <Button
                  onClick={() => setShowNewRule(false)}
                  className="text-sm flex-1"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Alert Rules */}
        <div className="mb-8">
          <h2 className="text-lg font-bold neon-glow mb-4">Alert Rules</h2>
          {rulesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-accent w-8 h-8" />
            </div>
          ) : rules && rules.length > 0 ? (
            <div className="space-y-3">
              {rules.map((rule) => (
                <Card key={rule.id} className="card-neon p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-sm mb-1">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {rule.metric} {rule.condition} {rule.threshold}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          updateRule({
                            id: rule.id,
                            enabled: !rule.enabled,
                          })
                        }
                        className="text-xs"
                        variant="outline"
                        size="sm"
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteRule({ id: rule.id })}
                        className="btn-neon text-xs"
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-neon p-8 text-center">
              <p className="text-muted-foreground">No alert rules configured</p>
            </Card>
          )}
        </div>

        {/* Alert History */}
        <div>
          <h2 className="text-lg font-bold neon-glow mb-4">Alert History</h2>
          {historyLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-accent w-8 h-8" />
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-3">
              {history.map((alert) => (
                <Card
                  key={alert.id}
                  className={`card-neon p-4 border-2 ${
                    alert.severity === "critical"
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-yellow-500/50 bg-yellow-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {alert.severity === "critical" ? (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm mb-1">{alert.ruleName}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {alert.metric}: {alert.value} (threshold: {alert.threshold})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <Button
                        onClick={() => resolveAlert({ alertId: alert.id })}
                        className="btn-neon-cyan text-xs ml-4"
                        size="sm"
                        variant="outline"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-neon p-8 text-center">
              <p className="text-muted-foreground">No alerts triggered yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
