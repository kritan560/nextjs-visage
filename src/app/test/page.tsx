"use client";

import { TagsInput } from "@mantine/core";
import { useState } from "react";

export default function Demo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="w-96">
      <TagsInput
        className=""
        label="Press Enter to submit a tag"
        description="Add up to 3 tags"
        placeholder="Enter tag"
        maxTags={9}
        data={[]}
        value={value}
        onChange={setValue}
        clearable
      />
    </div>
  );
}
