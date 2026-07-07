import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  /**
   * "wide" = max-w-[1400px] (dashboard, reports, tables)
   * "narrow" = max-w-3xl mx-auto (forms, single-column detail pages)
   */
  variant?: "wide" | "narrow";
  className?: string;
}

export function PageContainer({
  children,
  variant = "wide",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "page-enter flex flex-col w-full",
        // Spacing: gap-6 (24px) on mobile, md:gap-8 (32px) on tablet/desktop
        "gap-6 md:gap-8",
        // Max widths and centering
        variant === "wide" ? "max-w-[1400px]" : "max-w-3xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
