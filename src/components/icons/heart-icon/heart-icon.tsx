import { useGlobalLikeImageStore } from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { LinkLoginPage } from "@/links/links";
import { likeImage } from "@/servers/visage/visage-server";
import { UniversalImageType } from "@/types/visage-type";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import toast from "react-hot-toast";

type HeartIconProps = {
  image: UniversalImageType;
  nameIncluded?: boolean;
};

export default function HeartIcon(props: HeartIconProps) {
  const { image, nameIncluded = false } = props;

  const router = useRouter();
  const { globalLikedImagesIds, setGlobalLikedImageId } =
    useGlobalLikeImageStore();

  async function handleHeartClick() {
    // if there is imageId then remove it
    if (globalLikedImagesIds?.includes(image.imageId)) {
      setGlobalLikedImageId(
        globalLikedImagesIds?.filter((id) => id != image.imageId),
      );
    }

    // if there is not then include it
    if (globalLikedImagesIds && !globalLikedImagesIds.includes(image.imageId)) {
      setGlobalLikedImageId([...globalLikedImagesIds, image.imageId]);
    }

    const { failed, success } = await likeImage(image);
    if (failed) {
      if (failed.redirect) {
        router.push(LinkLoginPage);
        nProgress.start();
      }
      // if the collectImage action failed the revert the state too
      if (globalLikedImagesIds) {
        setGlobalLikedImageId(
          globalLikedImagesIds.filter((id) => id != image.imageId),
        );
      }

      toast.error(failed.message);
    }
    if (success) {
      toast.success(success.message);
    }
  }

  return (
    <div
      className={cn(
        nameIncluded &&
          "flex h-14 cursor-pointer items-center gap-x-2 rounded-md border px-4 transition hover:border-stone-500 active:border-stone-400",
        !nameIncluded &&
          "z-[1] cursor-pointer rounded-lg bg-gray-300 p-2 transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-800",
      )}
      onClick={handleHeartClick}
    >
      {globalLikedImagesIds?.includes(image.imageId) ? (
        <>
          <Heart size={18} fill="rgb(244, 63, 94)" strokeWidth={0} />
          {nameIncluded && <p>Like</p>}
        </>
      ) : (
        <>
          <Heart size={18} />
          {nameIncluded && <p>Like</p>}
        </>
      )}
    </div>
  );
}
