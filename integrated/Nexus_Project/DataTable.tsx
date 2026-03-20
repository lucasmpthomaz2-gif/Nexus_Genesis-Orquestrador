import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  title?: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  searchableFields?: (keyof T)[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  columns,
  data,
  searchableFields = [],
  onRowClick,
  emptyMessage = "Nenhum dado disponível",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter by search term
    if (searchTerm && searchableFields.length > 0) {
      result = result.filter((row) =>
        searchableFields.some((field) =>
          String(row[field])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortKey, sortOrder, searchableFields]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const content = (
    <>
      {/* Search Bar */}
      {searchableFields.length > 0 && (
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="text-slate-500 hover:text-slate-400"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-border/50 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    "text-slate-400 font-semibold",
                    column.width && `w-${column.width}`
                  )}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(column.key)}
                      className="h-auto p-0 text-slate-400 hover:text-slate-200 font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        {column.label}
                        <ArrowUpDown
                          className={cn(
                            "h-4 w-4 transition-all",
                            sortKey === column.key && "text-blue-400"
                          )}
                        />
                      </span>
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-slate-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((row, idx) => (
                <TableRow
                  key={idx}
                  className={cn(
                    "border-border/50 hover:bg-slate-900/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className="text-slate-300 py-3"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      {filteredAndSortedData.length > 0 && (
        <div className="mt-4 text-sm text-slate-500">
          Mostrando {filteredAndSortedData.length} de {data.length} registros
        </div>
      )}
    </>
  );

  if (title) {
    return (
      <Card className="nexus-card border-border/50">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}
