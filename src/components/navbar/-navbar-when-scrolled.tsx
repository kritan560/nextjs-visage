"use client";

import { useGlobalScrollAreaPositionState } from "@/global-states/scroll-area-state";
import { cn } from "@/lib/utils";

type NavbarWhenScrolledProps = {
  children: React.ReactNode;
  threshold?: number;
};

export function NavbarWhenScrolled(props: NavbarWhenScrolledProps) {
  const { children, threshold = 500 } = props;

  const { position } = useGlobalScrollAreaPositionState();

  return (
    <div
      className={cn(
        "fixed top-0 z-10 right-0 left-0 transition",
        position > threshold ? "opacity-100" : "opacity-0 -z-10"
      )}>
      {children}
    </div>
  );
}
