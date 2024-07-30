"use client";

import AdjustPadding from "@/components/shared/adjust-padding";
import { generate } from "random-words";

const TestRandomWords = () => {
  // const randomWords = generate({
  //   min: 12,
  //   max: 20,
  // }) as string[];
  const w = [
    "solution",
    "cake",
    "mean",
    "breeze",
    "shake",
    "paint",
    "acres",
    "pictured",
    "me",
    "door",
    "small",
    "dinner",
    "first",
    "provide",
  ];

  return (
    <div className="mx-auto h-20 w-[90%] overflow-x-scroll bg-blue-200">
      <div className="text-nowrap">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis
        possimus iusto nam voluptatem cum voluptate animi consectetur corporis
        earum vero illum, a eveniet, totam pariatur dicta nisi blanditiis fugiat
        itaque facere! Tempora, ex optio. Incidunt, itaque reprehenderit animi,
        iure dignissimos maiores doloremque repellendus esse ex deserunt culpa
        nulla voluptas eos.
      </div>
    </div>
  );
};

export default TestRandomWords;
