"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface LoadingStateProps {
  className?: string;
  text?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingState({
  className,
  text = "Loading...",
  size = "md",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeConfig[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingState size="lg" text="Loading content..." />
    </div>
  );
}

export function InlineLoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}
