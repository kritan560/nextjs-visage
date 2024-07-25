"use client";

import {
  useGlobalCollectVideosIds,
  useGlobalLikeVideosIds,
} from "@/global-states/visage-video-state";
import { cn } from "@/lib/utils";
import { UniversalVideoType } from "@/types/visage-type";
import {
  StructureTheImageParam,
  TruncatePhotgrapherName,
  handleDownloadMediaClick,
} from "@/utility/utils";
import { Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { IoVideocamSharp } from "react-icons/io5";
import CollectIconVideo from "../icons/collect-icon/collect-icon-video";
import HeartIconVideo from "../icons/heart-icon/heart-icon-video";
import { Button } from "../ui/button";
import DownloadVideoButtonDialog from "./download-video-button-dialog";

const blurDataURL =
  "data:image/webp;base64,UklGRowCAABXRUJQVlA4WAoAAAAgAAAAwwAAwwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggngAAADANAJ0BKsQAxAA+7Xa4VqmnJSOgSAEwHYlpbuCUBHjw8ALS4DeirhBlWYEvZMkE5w17ZOaVcLXVUoWusMkERNByxvpivvEAiJe/GT61Ti22jEhGCC0fLzI8LXVUnD7GTi1JuLgJvRCWwnsGxIwXQiKW4AD+pGXVOVryFj61/69G/5A1h4oQ6ARrjeCTcz7Ml3AOK7BnHqXIJQCAAAAA";

type UniqueVideoProps = {
  video: UniversalVideoType;
};

export function UniqueVideo(props: UniqueVideoProps) {
  const { video } = props;

  const HD_Video = video.video_files.find((video) => video.quality === "hd");
  const [bufferring, setBufferring] = useState({ buffering: false, key: -0 });
  const router = useRouter();
  const [blur, setBlur] = useState(true);
  const { videosIds: globalVideosCollectIds } = useGlobalCollectVideosIds();
  const { videosIds: globalVideoLikesIds } = useGlobalLikeVideosIds();

  /**
   * navigate to /videos/unique-video
   * @param videoId number
   */
  function handleVideoClick(videoId: number | undefined | string) {
    if (videoId) {
      router.push(`/videos/${videoId}`);
      nProgress.start();
    }
  }

  return (
    <div key={video.id} className="group relative">
      <Link
        scroll={false}
        href={`/videos/${StructureTheImageParam(video.videoId, "")}`}
      >
        <div className="group/image relative">
          <video
            muted
            onClick={() => {
              handleVideoClick(video.videoId);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.play();
            }}
            onWaiting={(e) => {
              setBufferring({ buffering: true, key: video.id });
            }}
            onPlaying={(e) =>
              setBufferring({ buffering: false, key: video.id })
            }
            onMouseLeave={(e) => {
              e.currentTarget.pause();
            }}
            onCanPlay={() => setBlur(false)}
            className={cn(
              "z-10 cursor-pointer rounded bg-cover group-hover/image:contrast-125",
              blur && "animate-pulse bg-gray-500 object-contain",
            )}
          >
            <source src={HD_Video?.link} />
          </video>
          <div
            className={cn(
              "absolute left-4 top-4 rounded-full bg-slate-900/70 p-2",
              bufferring.key === video.id &&
                bufferring.buffering &&
                "animate-pulse bg-gray-600",
            )}
          >
            <IoVideocamSharp size={18} color="white" />
          </div>
        </div>
      </Link>

      <div className="opacity-0 transition group-hover:opacity-100">
        <Link
          target="_blank"
          href={video.user.url}
          className="absolute bottom-4 left-4 flex items-center gap-x-2"
        >
          {video.user.url.includes("pexels") && (
            //  photographer image : pexels doesn't provide the user DP so adjusting the DP manually
            <div
              className="flex aspect-square w-12 items-center justify-center rounded-full text-2xl font-bold uppercase text-stone-50"
              style={{
                backgroundColor: "blueviolet",
              }}
            >
              {video.user.name[0]}
            </div>
          )}

          {/* photographer name */}
          <p className="text-xl font-medium capitalize text-stone-50">
            {TruncatePhotgrapherName(video.user.name)}
          </p>
        </Link>

        {/*  download button dialog */}

        <DownloadVideoButtonDialog video={video}>
          <Button
            onClick={() =>
              handleDownloadMediaClick(
                HD_Video?.link ?? "",
                video.videoId,
                "Video",
              )
            }
            className="absolute bottom-4 right-4 flex h-12 items-center gap-x-2 rounded-full"
            variant={"visage"}
            size={"default"}
          >
            <Download size={18} className="" />
            Download
          </Button>
        </DownloadVideoButtonDialog>

        <div className="absolute right-4 top-4 flex items-center gap-x-2">
          {/* collect */}
          <CollectIconVideo video={video} />

          {/* liked icon */}
          <HeartIconVideo video={video} />
        </div>
      </div>

      {/* this div is here to show bookmark and heart icon when it is bookmarked and loved */}
      <div className="absolute right-4 top-4 flex items-center gap-x-2">
        <div
          className={cn(
            globalVideosCollectIds?.includes(video.videoId)
              ? "opacity-100"
              : "absolute opacity-0",
          )}
        >
          <CollectIconVideo video={video} />
        </div>
        <div
          className={cn(
            globalVideoLikesIds?.includes(video.videoId)
              ? "opacity-100"
              : "absolute opacity-0",
          )}
        >
          <HeartIconVideo video={video} />
        </div>
      </div>
    </div>
  );
}
