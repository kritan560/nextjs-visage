"use client";

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

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return;

  return (
    <ResponsiveMasonry
      className={className}
      columnsCountBreakPoints={{ 350: 1, 750: 2, 900: breakPoint900 }}>
      <Mansonry gutter={gutter}>{children}</Mansonry>
    </ResponsiveMasonry>
  );
}
