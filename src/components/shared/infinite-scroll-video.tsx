"use client";

import { useGlobalVideos } from "@/global-states/visage-video-state";
import { cn } from "@/lib/utils";
import { getVideos } from "@/servers/pexel/pexelVideo.server";
import { useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import { PropagateLoader } from "react-spinners";
import { MasonryClient } from "../masonry/masonry-client";
import AdjustPadding from "./adjust-padding";
import { UniqueVideo } from "./unique-video";
import { MediaType } from "@/types/mediaType.type";

type InfiniteScrollVideoProps = {
  mediaType: MediaType | undefined;
};

export default function InfiniteScrollVideo(props: InfiniteScrollVideoProps) {
  const { mediaType } = props;

  const { ref, inView } = useInView();
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(2);
  const [initialLoading, setInitialLoading] = useState(true);

  const { setVideos, videos } = useGlobalVideos();

  useEffect(() => {
    if (inView) {
      startTransition(async () => {
        const { failed, success } = await getVideos(page);
        const pexelVideos = success?.data.videos;

        if (videos && pexelVideos) {
          setVideos([...videos, ...pexelVideos]);
        }
      });

      setPage((prev) => prev + 1);
    }

    setInitialLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <AdjustPadding>
      {/* image mansonry */}
      {mediaType === "Video" && (
        <MasonryClient>
          {videos?.map((video) => <UniqueVideo key={video.id} video={video} />)}
        </MasonryClient>
      )}

      <div className="relative h-14 overflow-x-clip">
        <PropagateLoader
          size={30}
          className={cn(
            "bottom-0 block scale-[2.0] text-center",
            initialLoading && "animate-pulse",
          )}
          color="rgb(197 129 50)"
          loading={isPending || initialLoading}
        />
      </div>
      <div ref={ref} className="h-1"></div>
    </AdjustPadding>
  );
}
