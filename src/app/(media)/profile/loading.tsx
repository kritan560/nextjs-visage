import AdjustPadding from "@/components/shared/adjust-padding";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePageSkeleton = () => {
  return (
    <AdjustPadding>
      {/* navbar */}
      <Skeleton className="h-16 w-full" />

      <div className="mx-auto w-full md:w-[60%]">
        <div className="mt-10 flex flex-col items-center space-y-8">
          {/* image  */}
          <Skeleton className="h-32 w-32 rounded-full" />

          {/* name */}
          <Skeleton className="h-16 w-36 rounded-md" />

          {/* button */}
          <Skeleton className="h-16 w-36 rounded-md" />

          {/* views */}
          <Skeleton className="h-16 w-36 rounded-md" />
        </div>

        {/* links ----> horizontal */}
        <div className="mt-12 flex items-center gap-x-4">
          <Skeleton className="h-10 w-28 rounded-full md:block" />
          <Skeleton className="h-10 w-28 rounded-full md:block" />
          <Skeleton className="h-10 w-28 rounded-full md:block" />
        </div>
      </div>
    </AdjustPadding>
  );
};

export default ProfilePageSkeleton;
