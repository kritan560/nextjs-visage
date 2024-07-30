"use client";

import { useGlobalScrollAreaPositionYState } from "@/global-states/scroll-area-state";
import { cn } from "@/lib/utils";

type NavbarWhenScrolledProps = {
  children: React.ReactNode;
  threshold?: number;
};

let scrolled = false;
export function NavbarWhenScrolled(props: NavbarWhenScrolledProps) {
  const { children, threshold = 500 } = props;

  const { position } = useGlobalScrollAreaPositionYState();

  if (position.y > threshold) {
    scrolled = true;
  }
  if (position.y < threshold) {
    scrolled = false;
  }

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-10 transition",
        scrolled ? "opacity-100" : "-z-10 opacity-0",
      )}
    >
      {children}
    </div>
  );
}
