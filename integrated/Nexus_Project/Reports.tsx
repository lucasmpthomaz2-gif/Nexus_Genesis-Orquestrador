import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Loader2,
  FileText,
  Download,
  Plus,
  Trash2,
  Eye,
  Calendar,
  BarChart3,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: "summary" | "detailed" | "comparative";
  period: "7d" | "30d" | "90d" | "1y";
  createdAt: Date;
  size: number;
  format: "pdf" | "csv" | "json";
}

export default function Reports() {
  const { user, loading: authLoading } = useAuth();
  const [showNewReport, setShowNewReport] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    type: "summary" as const,
    period: "30d" as const,
    format: "pdf" as const,
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Mock reports data
  const [reports, setReports] = useState<Report[]>([
    {
      id: "report-1",
      name: "Monthly Ecosystem Report - January 2026",
      type: "summary",
      period: "30d",
      createdAt: new Date("2026-02-01"),
      size: 2.5,
      format: "pdf",
    },
    {
      id: "report-2",
      name: "Agent Performance Analysis",
      type: "detailed",
      period: "30d",
      createdAt: new Date("2026-02-10"),
      size: 5.2,
      format: "pdf",
    },
    {
      id: "report-3",
      name: "Transaction Volume Comparison",
      type: "comparative",
      period: "90d",
      createdAt: new Date("2026-02-15"),
      size: 3.8,
      format: "csv",
    },
  ]);

  const handleCreateReport = () => {
    const report: Report = {
      id: `report-${Date.now()}`,
      name: newReport.name,
      type: newReport.type,
      period: newReport.period,
      createdAt: new Date(),
      size: Math.random() * 10,
      format: newReport.format,
    };

    setReports([...reports, report]);
    setShowNewReport(false);
    setNewReport({
      name: "",
      type: "summary",
      period: "30d",
      format: "pdf",
    });
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const formatBytes = (bytes: number) => {
    return (bytes * 1024 * 1024).toLocaleString("en-US", {
      maximumFractionDigits: 1,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
              <FileText className="w-5 h-5 text-accent neon-glow" />
              <h1 className="text-2xl font-bold neon-glow">Reports Dashboard</h1>
            </div>
            <Button onClick={() => setShowNewReport(!showNewReport)} className="btn-neon text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* New Report Form */}
        {showNewReport && (
          <Card className="card-neon p-6 mb-8">
            <h3 className="font-bold neon-glow mb-4">Generate New Report</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Report name"
                value={newReport.name}
                onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">Report Type</label>
                  <select
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                  >
                    <option value="summary">Summary</option>
                    <option value="detailed">Detailed</option>
                    <option value="comparative">Comparative</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-2">Period</label>
                  <select
                    value={newReport.period}
                    onChange={(e) => setNewReport({ ...newReport, period: e.target.value as any })}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                  >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                    <option value="1y">1 Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-2">Format</label>
                <select
                  value={newReport.format}
                  onChange={(e) => setNewReport({ ...newReport, format: e.target.value as any })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateReport}
                  disabled={!newReport.name}
                  className="btn-neon text-sm flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button
                  onClick={() => setShowNewReport(false)}
                  className="text-sm flex-1"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Reports Grid */}
        {reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="card-neon p-4 hover:border-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      <FileText className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm mb-1">{report.name}</p>
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="text-foreground capitalize">{report.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Period</p>
                          <p className="text-foreground">{report.period}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="text-foreground">{report.size.toFixed(1)} MB</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="text-foreground">{formatDate(report.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                      }}
                      className="btn-neon-cyan text-xs"
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Simulate download
                        alert(`Downloading ${report.name}...`);
                      }}
                      className="btn-neon text-xs"
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReport(report.id);
                      }}
                      className="btn-neon text-xs"
                      size="sm"
                      variant="outline"
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
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No reports generated yet</p>
            <Button onClick={() => setShowNewReport(true)} className="btn-neon">
              <Plus className="w-4 h-4 mr-2" />
              Generate First Report
            </Button>
          </Card>
        )}

        {/* Report Preview */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="card-neon p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold neon-glow">{selectedReport.name}</h2>
                <Button
                  onClick={() => setSelectedReport(null)}
                  className="text-sm"
                  variant="outline"
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background/50 rounded border border-border">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-bold capitalize">{selectedReport.type}</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded border border-border">
                    <p className="text-xs text-muted-foreground">Period</p>
                    <p className="font-bold">{selectedReport.period}</p>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded border border-border">
                  <h3 className="font-bold mb-3">Report Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Total Agents:</span>{" "}
                      <span className="font-bold">62</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Total Transactions:</span>{" "}
                      <span className="font-bold">340</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Total Volume:</span>{" "}
                      <span className="font-bold">$125,450</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Average Health:</span>{" "}
                      <span className="font-bold">78.5%</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="btn-neon flex-1" onClick={() => alert("Downloading...")}>
                    <Download className="w-4 h-4 mr-2" />
                    Download {selectedReport.format.toUpperCase()}
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
