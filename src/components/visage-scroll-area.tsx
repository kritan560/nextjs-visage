"use client";

import { useGlobalScrollAreaPositionState } from "@/global-states/scroll-area-state";
import { cn } from "@/lib/utils";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";

type VisageScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * default threshold is 500 pexels.
 * @param props
 * @returns
 */
const VisageScrollArea = (props: VisageScrollAreaProps) => {
  const { children, className } = props;

  const { setPosition } = useGlobalScrollAreaPositionState();

  function handleOnScrollCapture(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    const target = e.target as HTMLDivElement;
    const scrollY = target.scrollTop;

    setPosition(scrollY);
  }

  return (
    <ScrollArea
      type="auto"
      onScrollCapture={(event) => {
        handleOnScrollCapture(event);
      }}
      scrollHideDelay={150}
      className={cn("h-screen", className)}>
      {children}
    </ScrollArea>
  );
};

export default VisageScrollArea;
