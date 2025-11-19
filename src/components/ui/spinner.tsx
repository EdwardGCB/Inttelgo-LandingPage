import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border-2",
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-[3px]",
        xl: "h-12 w-12 border-4",
      },
      variant: {
        default: "text-orange-500",
        primary: "text-orange-500",
        secondary: "text-gray-500",
        white: "text-white",
        black: "text-black",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({
  className,
  size,
  variant,
  label,
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label || "Cargando"}
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    >
      <span className="sr-only">{label || "Cargando..."}</span>
    </div>
  );
}
