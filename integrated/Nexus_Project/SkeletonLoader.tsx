import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  className?: string;
}

export function SkeletonLoader({
  count = 1,
  height = "h-12",
  className,
}: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg animate-pulse",
            height,
            className
          )}
        />
      ))}
    </>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="nexus-card border-border/50">
          <CardHeader>
            <SkeletonLoader count={2} height="h-4" className="mb-2" />
          </CardHeader>
          <CardContent>
            <SkeletonLoader count={3} height="h-6" className="mb-3" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonLoader key={i} height="h-12" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="nexus-card border-border/50">
      <CardHeader>
        <SkeletonLoader count={2} height="h-4" className="mb-2" />
      </CardHeader>
      <CardContent>
        <SkeletonLoader height="h-64" />
      </CardContent>
    </Card>
  );
}
