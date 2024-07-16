"use client";

import { useGlobalScrollAreaState } from "@/global-states/scroll-area-state";
import { cn } from "@/lib/utils";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";

type VisageScrollAreaProps = {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
};

/**
 * default threshold is 500 pixels.
 * @param props
 * @returns
 */
const VisageScrollArea = (props: VisageScrollAreaProps) => {
  const { children, threshold = 500, className } = props;

  const { setScrolled } = useGlobalScrollAreaState();

  function handleOnScrollCapture(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    const target = e.target as HTMLDivElement;
    const scrollY = target.scrollTop;

    if (scrollY > threshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }

  return (
    <ScrollArea
      type="hover"
      onScrollCapture={(event) => {
        handleOnScrollCapture(event);
      }}
      scrollHideDelay={150}
      className={cn("h-screen", className)}>
      <>{children}</>
    </ScrollArea>
  );
};

export default VisageScrollArea;
