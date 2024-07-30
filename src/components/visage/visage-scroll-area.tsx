"use client";

import {
  useGlobalScrollAreaPositionXState,
  useGlobalScrollAreaPositionYState,
} from "@/global-states/scroll-area-state";
import React, { useEffect, useRef } from "react";
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

  const { setGlobalViewPort } = useGlobalVisageScrollAreaGlobal();
  const { setPosition: onScrollPositionYChange } =
    useGlobalScrollAreaPositionYState();
  const { setPosition: onScrollPositionXChange } =
    useGlobalScrollAreaPositionXState();

  useEffect(() => {
    setGlobalViewPort(viewport);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this useEffect hooks is used to calculate the current width of a window.
  useEffect(() => {
    function updateWindowSize() {
      const width = window.innerWidth;
      onScrollPositionXChange({ x: width });
    }

    // Initial call to set the size on load
    updateWindowSize();

    // Add event listener for window resize
    window.addEventListener("resize", updateWindowSize);
  }, [onScrollPositionXChange]);

  return (
    <div
      ref={viewport}
      onScroll={(e) => {
        onScrollPositionYChange({
          y: e.currentTarget.scrollTop,
        });
      }}
      className="h-screen w-screen overflow-x-clip overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-visage-400 scrollbar-thumb-rounded-full scrollbar-h-2"
    >
      <div className="">{children}</div>
    </div>
  );
};

export default VisageScrollArea;
