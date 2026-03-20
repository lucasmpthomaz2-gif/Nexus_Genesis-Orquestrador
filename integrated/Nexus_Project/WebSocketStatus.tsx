import { useWebSocketConnection } from "@/contexts/WebSocketContext";
import { AlertCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WebSocketStatus() {
  const { isConnected, isReconnecting, error } = useWebSocketConnection();

  if (isConnected && !error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
        <span className="text-xs font-medium text-green-700 dark:text-green-400">
          Conectado
        </span>
      </div>
    );
  }

  if (isReconnecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
        <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
          Reconectando...
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
      {error ? (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-xs font-medium text-red-700 dark:text-red-400">
            Erro
          </span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-xs font-medium text-red-700 dark:text-red-400">
            Desconectado
          </span>
        </>
      )}
    </div>
  );
}

export function WebSocketStatusBadge() {
  const { isConnected, isReconnecting } = useWebSocketConnection();

  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full animate-pulse",
        isConnected && "bg-green-500",
        isReconnecting && "bg-yellow-500",
        !isConnected && !isReconnecting && "bg-red-500"
      )}
    />
  );
}
