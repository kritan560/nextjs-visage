import React from "react";
import { Skeleton } from "../ui/skeleton";
import AdjustPadding from "../shared/adjust-padding";

const EditProfileSkeleton = () => {
  return (
    <AdjustPadding>
      {/* navbar */}
      <Skeleton className="h-16 w-full" />

      {/* heading : profile settings */}
      <Skeleton className="mx-auto mt-4 h-16 w-72" />

      <div className="mx-auto w-[60%]">
        {/* image and button */}
        <div className="mt-10 flex items-center gap-x-12">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="roundedmd h-16 w-36" />
        </div>

        {/* input boxes */}
        <div className="mt-12 flex items-center gap-x-8">
          <Skeleton className="h-14 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" />
        </div>

        <div className="mt-12 flex items-center gap-x-8">
          <Skeleton className="h-14 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-md" />
        </div>

        <Skeleton className="mt-12 h-14 w-36" />
      </div>
    </AdjustPadding>
  );
};

export default EditProfileSkeleton;
