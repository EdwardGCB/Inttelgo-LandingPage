import { cn } from "@/lib/utils";
import { Spinner, type SpinnerProps } from "./spinner";
import { Item, ItemContent, ItemMedia, ItemTitle } from "./item";

interface LoadingSpinnerProps {
  className?: string;
  size?: SpinnerProps["size"];
  fullScreen?: boolean;
  variant?: SpinnerProps["variant"];
}

export function LoadingSpinner({
  className,
  size = "lg",
  fullScreen = false,
  variant = "primary",
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4 p-6">
          <Spinner size="xl" variant={variant} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center gap-3">
        <Spinner size={size} variant={variant} />
      </div>
    </div>
  );
}

// Componente para usar con React Suspense
export function SuspenseFallback() {
  return <LoadingSpinner fullScreen size="xl" />;
}

// Componente de loading con diseño de Item (como el ejemplo)
interface LoadingItemProps {
  title?: string;
  subtitle?: string;
  amount?: string;
  variant?: "default" | "muted" | "ghost" | "outline";
  className?: string;
}

export function LoadingItem({
  title = "Cargando contenido...",
  subtitle,
  amount,
  variant = "muted",
  className,
}: LoadingItemProps) {
  return (
    <Item variant={variant} className={cn("w-full", className)}>
      <ItemMedia>
        <Spinner size="md" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{title}</ItemTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </ItemContent>
      {amount && (
        <ItemContent className="flex-none justify-end">
          <span className="text-sm font-medium tabular-nums">{amount}</span>
        </ItemContent>
      )}
    </Item>
  );
}
