import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Download, Eye, Code } from "lucide-react";
import { toast } from "sonner";

interface CodePreviewProps {
  code: string;
  language: string;
  description?: string;
}

export default function CodePreview({ code, language, description }: CodePreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado!");
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Código baixado!");
  };

  const getFileExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      html: "html",
      css: "css",
      jsx: "jsx",
      tsx: "tsx",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      ruby: "rb",
      php: "php",
      go: "go",
      rust: "rs",
    };
    return extensions[lang] || "txt";
  };

  const renderPreview = () => {
    try {
      if (language === "html" || language === "jsx") {
        return (
          <div className="w-full h-96 border border-border rounded bg-white">
            <iframe
              srcDoc={code}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Code Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        );
      } else if (language === "javascript" || language === "typescript") {
        // For JS/TS, show console output simulation
        return (
          <div className="w-full h-96 bg-background/50 border border-border rounded p-4 font-mono text-sm overflow-y-auto">
            <div className="text-green-400">
              <p>&gt; Executando código...</p>
              <p className="mt-2 text-cyan-400">// Saída do código será exibida aqui</p>
              <p className="mt-2 text-muted-foreground">// Abra o console do navegador para ver resultados</p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="w-full h-96 bg-background/50 border border-border rounded p-4 font-mono text-sm overflow-y-auto">
            <div className="text-muted-foreground">
              <p>Preview não disponível para {language}</p>
              <p className="mt-2 text-xs">Copie o código e execute em seu ambiente</p>
            </div>
          </div>
        );
      }
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : "Erro ao renderizar preview");
      return (
        <div className="w-full h-96 bg-red-900/20 border border-red-500 rounded p-4">
          <p className="text-red-400">Erro ao renderizar: {previewError}</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <Card className="hud-border-pink bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-pink-400" />
                Código Gerado
              </CardTitle>
              <CardDescription>{language.toUpperCase()}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyCode}
                className="border-border hover:border-cyan-500"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadCode}
                className="border-border hover:border-green-500"
              >
                <Download className="w-4 h-4" />
              </Button>
              {(language === "html" || language === "jsx" || language === "javascript") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="border-border hover:border-pink-500"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-background/50 rounded p-4 max-h-64 overflow-y-auto">
            <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-words">
              <code>{code}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {showPreview && (
        <Card className="hud-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Preview em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>{renderPreview()}</CardContent>
        </Card>
      )}

      {/* Description */}
      {description && (
        <Card className="hud-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm">Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
