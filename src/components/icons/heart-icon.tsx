import { useGlobalLikeImageStore } from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { LinkLoginPage } from "@/links/links";
import { likeImage } from "@/servers/visage-server";
import { UniversalImageType } from "@/types/visage-type";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
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
    if (globalLikedImagesIds?.includes(parseInt(image.imageId))) {
      setGlobalLikedImageId(
        globalLikedImagesIds?.filter((id) => id != parseInt(image.imageId))
      );
    }

    // if there is not then include it
    if (
      globalLikedImagesIds &&
      !globalLikedImagesIds.includes(parseInt(image.imageId))
    ) {
      setGlobalLikedImageId([...globalLikedImagesIds, parseInt(image.imageId)]);
    }

    const { failed, success } = await likeImage(image);
    if (failed) {
      if (failed.redirect) {
        router.push(LinkLoginPage);
      }
      // if the collectImage action failed the revert the state too
      if (globalLikedImagesIds) {
        setGlobalLikedImageId(
          globalLikedImagesIds.filter((id) => id != parseInt(image.imageId))
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
          "flex gap-x-2 items-center border rounded-md h-14 px-4 cursor-pointer transition hover:border-stone-500 active:border-stone-400",
        !nameIncluded &&
          "bg-gray-300 p-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 cursor-pointer transition duration-200",
        "z-10"
      )}
      onClick={handleHeartClick}>
      {globalLikedImagesIds?.includes(image.id) ? (
        <>
          <Heart
            size={18}
            fill="rgb(244, 63, 94)"
            strokeWidth={0}
          />
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
