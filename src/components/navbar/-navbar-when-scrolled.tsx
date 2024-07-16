"use client";

import { useGlobalScrollAreaState } from "@/global-states/scroll-area-state";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

type NavbarWhenScrolledProps = {
  children: React.ReactNode;
  threshold?: number;
};

export function NavbarWhenScrolled(props: NavbarWhenScrolledProps) {
  const { children, threshold = 500 } = props;

  const scrolled = useScroll(threshold);
  const { isScrolled } = useGlobalScrollAreaState();

  return (
    <div
      className={cn(
        "fixed top-0 z-10 right-0 left-0 transition",
        isScrolled ? "opacity-100" : "opacity-0 -z-10"
      )}>
      {children}
    </div>
  );
}
