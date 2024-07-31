import React from "react";
import { Skeleton } from "../ui/skeleton";
import AdjustPadding from "../shared/adjust-padding";

const EditProfileSkeleton = () => {
  return (
    <AdjustPadding>
      {/* navbar */}
      <Skeleton className="h-12 w-full md:h-16" />

      {/* heading : profile settings */}
      <Skeleton className="mx-auto mt-4 h-12 w-72 md:h-16" />

      <div className="mx-auto w-full md:w-[60%]">
        {/* image and button */}
        <div className="mt-10 flex items-center gap-x-12">
          <Skeleton className="h-24 w-24 rounded-full md:h-32 md:w-32" />
          <Skeleton className="roundedmd h-12 w-36 md:h-16" />
        </div>

        {/* input boxes */}
        <div className="mt-12 flex-col items-center gap-x-8 space-y-2 md:flex md:space-y-0">
          <Skeleton className="h-14 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" />
        </div>

        <div className="mt-12 flex-col items-center gap-x-8 space-y-2 md:flex md:space-y-0">
          <Skeleton className="h-14 w-full rounded-md" />
          <Skeleton className="hidden h-14 w-full rounded-md md:block" />
        </div>

        <Skeleton className="mt-12 hidden h-14 w-36 md:block" />
      </div>
    </AdjustPadding>
  );
};

export default EditProfileSkeleton;
