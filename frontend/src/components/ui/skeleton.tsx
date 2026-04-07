import { cn } from "../../utils/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-3 bg-surface-active", className)}
      {...props}
    />
  );
}

export { Skeleton };
