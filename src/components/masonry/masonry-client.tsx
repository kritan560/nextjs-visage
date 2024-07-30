"use client";

import { useGlobalScrollAreaPositionXState } from "@/global-states/scroll-area-state";
import React, { useEffect, useState } from "react";
import Mansonry, { ResponsiveMasonry } from "react-responsive-masonry";

type MasonryProps = {
  children: React.ReactNode;
  breakPoint900?: number;
  className?: string;
  gutter?: string;
};

export function MasonryClient(props: MasonryProps) {
  const { children, breakPoint900 = 3, className, gutter = "15px" } = props;

  const [mount, setMount] = useState(false);
  const { position: Xposition } = useGlobalScrollAreaPositionXState();

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return;

  return (
    <ResponsiveMasonry
      className={className}
      columnsCountBreakPoints={{ 350: 2, 750: 2, 900: breakPoint900 }}
    >
      <Mansonry gutter={Xposition.x > 768 ? gutter : "5px"}>
        {children}
      </Mansonry>
    </ResponsiveMasonry>
  );
}
