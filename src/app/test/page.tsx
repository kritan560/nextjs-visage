"use client";

import { VisageToast } from "@/components/shared/visage-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Demo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <Button onClick={() => VisageToast.success("success")}>Toast</Button>
      {/* <Button onClick={() => handler.success("hello world")}>Toast</Button> */}
    </>
  );
}
