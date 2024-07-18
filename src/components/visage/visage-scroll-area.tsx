"use client";

import { useGlobalScrollAreaPositionState } from "@/global-states/scroll-area-state";
import { cn } from "@/lib/utils";
import React from "react";
// import { ScrollArea } from "../ui/scroll-area";
import { ScrollArea } from "@mantine/core";
import classes from "./scroll-area.module.css";

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
  const { setPosition: onScrollPositionChange } =
    useGlobalScrollAreaPositionState();

  return (
    <ScrollArea
      type="always"
      classNames={classes}
      onScrollPositionChange={onScrollPositionChange}
      scrollHideDelay={150}
      scrollbars="y"
      className={cn("h-screen", className)}>
      {children}
    </ScrollArea>
  );
};

export default VisageScrollArea;
