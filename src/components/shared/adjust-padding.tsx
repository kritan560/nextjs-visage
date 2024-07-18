import { cn } from "@/lib/utils";
import React from "react";

type AdjustPaddingProps = {
  children: React.ReactNode;
  className?: string;
};

const AdjustPadding = (props: AdjustPaddingProps) => {
  const { children, className } = props;

  return <div className={cn("px-14 py-4", className)}>{children}</div>;
};

export default AdjustPadding;
