import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Database,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function BackupManagement() {
  const { user, loading: authLoading } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Queries
  const { data: backups, isLoading, refetch } = trpc.backups.getHistory.useQuery(
    { limit: 50 },
    { enabled: !!user && user.role === "admin" }
  );

  const { data: stats } = trpc.backups.getStats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Mutations
  const { mutate: createBackup, isPending: isCreating } = trpc.backups.create.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: restoreBackup, isPending: isRestoring } = trpc.backups.restore.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: deleteBackup } = trpc.backups.delete.useMutation({
    onSuccess: () => {
      refetch();
      setConfirmDelete(null);
    },
  });

  const { mutate: cleanupBackups } = trpc.backups.cleanup.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

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
          <p className="text-muted-foreground text-sm">Only administrators can manage backups</p>
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
              <Database className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Backup Management</h1>
            </div>
            <Button
              onClick={() => createBackup()}
              disabled={isCreating}
              className="btn-neon text-sm"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Create Backup
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Backups</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.total}</p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Successful</p>
              <p className="text-2xl font-bold text-green-400">{stats.successful}</p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
            </Card>
            <Card className="card-neon p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Size</p>
              <p className="text-2xl font-bold text-yellow-400">{formatBytes(stats.totalSize)}</p>
            </Card>
          </div>
        )}

        {/* Maintenance */}
        <Card className="card-neon p-6 mb-8">
          <h3 className="font-bold neon-glow mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Maintenance
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={() => cleanupBackups({ keepCount: 30 })}
              className="btn-neon-cyan text-sm"
              variant="outline"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Cleanup Old Backups (Keep 30)
            </Button>
          </div>
        </Card>

        {/* Backups List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-accent w-8 h-8" />
          </div>
        ) : backups && backups.length > 0 ? (
          <div className="space-y-3">
            {backups.map((backup) => (
              <Card
                key={backup.id}
                className={`card-neon p-4 border-2 ${
                  backup.status === "success"
                    ? "border-green-500/50 bg-green-500/5"
                    : backup.status === "failed"
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-yellow-500/50 bg-yellow-500/5"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {backup.status === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : backup.status === "failed" ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm">{backup.id}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            backup.status === "success"
                              ? "bg-green-500/20 text-green-400"
                              : backup.status === "failed"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {backup.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="text-foreground">
                            {new Date(backup.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="text-foreground">{formatBytes(backup.size)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="text-foreground">{formatDuration(backup.duration)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {backup.status === "success" && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => restoreBackup({ backupId: backup.id })}
                        disabled={isRestoring}
                        className="btn-neon-cyan text-xs"
                        size="sm"
                        variant="outline"
                      >
                        {isRestoring ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            Restore
                          </>
                        )}
                      </Button>
                      {confirmDelete === backup.id ? (
                        <div className="flex gap-1">
                          <Button
                            onClick={() => deleteBackup({ backupId: backup.id })}
                            className="btn-neon text-xs"
                            size="sm"
                            variant="outline"
                          >
                            Confirm
                          </Button>
                          <Button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs"
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setConfirmDelete(backup.id)}
                          className="btn-neon text-xs"
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-neon p-8 text-center">
            <p className="text-muted-foreground">Nenhum backup encontrado</p>
          </Card>
        )}
      </div>
    </div>
  );
}
