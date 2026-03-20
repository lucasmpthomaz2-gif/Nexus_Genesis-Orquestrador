import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  triggerClassName?: string;
}

export function InfoTooltip({
  content,
  side = "top",
  className,
  triggerClassName,
}: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle
            className={cn(
              "h-4 w-4 text-slate-500 hover:text-slate-400 cursor-help transition-colors",
              triggerClassName
            )}
          />
        </TooltipTrigger>
        <TooltipContent side={side} className={cn("max-w-xs", className)}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
