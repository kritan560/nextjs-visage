"use client";

import { useGlobalScrollAreaPositionState } from "@/global-states/scroll-area-state";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
// import { ScrollArea } from "../ui/scroll-area";
import { ScrollArea } from "@mantine/core";
import classes from "./scroll-area.module.css";
import { useGlobalVisageScrollAreaGlobal } from "./visage-scroll-area-global-state";

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
  const viewport = useRef<HTMLDivElement>(null);

  const { setPosition: onScrollPositionChange } =
    useGlobalScrollAreaPositionState();
  const { setGlobalViewPort } = useGlobalVisageScrollAreaGlobal();

  useEffect(() => {
    setGlobalViewPort(viewport);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollArea
      viewportRef={viewport}
      type="always"
      classNames={classes}
      onScrollPositionChange={onScrollPositionChange}
      scrollHideDelay={150}
      scrollbars="y"
      className={cn("h-screen", className)}
    >
      {children}
    </ScrollArea>
  );
};

export default VisageScrollArea;
