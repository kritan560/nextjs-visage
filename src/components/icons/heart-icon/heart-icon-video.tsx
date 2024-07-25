import { VisageToast } from "@/components/shared/visage-toast";
import { useGlobalLikeVideosIds } from "@/global-states/visage-video-state";
import { cn } from "@/lib/utils";
import { LinkLoginPage } from "@/links/links";
import { likeVideo } from "@/servers/visage/visage-server";
import { UniversalVideoType } from "@/types/visage-type";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

type HeartIconVideoProps = {
  video: UniversalVideoType;
  nameIncluded?: boolean;
};

export default function HeartIconVideo(props: HeartIconVideoProps) {
  const { video, nameIncluded = false } = props;

  const router = useRouter();
  const {
    setVideosIds: setGlobalLikedVideosIds,
    videosIds: globalLikedVideosIds,
  } = useGlobalLikeVideosIds();

  async function handleHeartClick() {
    // if there is imageId then remove it
    if (globalLikedVideosIds?.includes(video.videoId)) {
      setGlobalLikedVideosIds(
        globalLikedVideosIds?.filter((id) => id != video.videoId),
      );
    }

    // if there is not then include it
    if (globalLikedVideosIds && !globalLikedVideosIds.includes(video.videoId)) {
      setGlobalLikedVideosIds([...globalLikedVideosIds, video.videoId]);
    }

    const { failed, success } = await likeVideo(video);
    if (failed) {
      if (failed.redirect) {
        router.push(LinkLoginPage);
        nProgress.start();
      }
      // if the collectImage action failed the revert the state too
      if (globalLikedVideosIds) {
        setGlobalLikedVideosIds(
          globalLikedVideosIds.filter((id) => id != video.videoId),
        );
      }

      VisageToast.error(failed.message);
    }
    if (success) {
      VisageToast.success(success.message);
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
      {globalLikedVideosIds?.includes(video.videoId) ? (
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
