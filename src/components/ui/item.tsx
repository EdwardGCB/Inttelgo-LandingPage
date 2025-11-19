import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const itemVariants = cva(
  "flex items-center gap-3 rounded-[--radius] p-3 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background hover:bg-accent",
        muted: "bg-muted hover:bg-muted/80",
        ghost: "hover:bg-accent",
        outline: "border border-input hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(itemVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Item.displayName = "Item";

const ItemMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-none", className)} {...props} />
));
ItemMedia.displayName = "ItemMedia";

const ItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
    {...props}
  />
));
ItemContent.displayName = "ItemContent";

const ItemTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-medium leading-none", className)}
    {...props}
  />
));
ItemTitle.displayName = "ItemTitle";

const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ItemDescription.displayName = "ItemDescription";

export { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription };
