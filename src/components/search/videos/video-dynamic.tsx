"use client";

import CollectIconVideo from "@/components/icons/collect-icon/collect-icon-video";
import HeartIconVideo from "@/components/icons/heart-icon/heart-icon-video";
import AdjustPadding from "@/components/shared/adjust-padding";
import DownloadButtonDialogVideo from "@/components/shared/download-content-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalVisageScrollAreaGlobal } from "@/components/visage/visage-scroll-area-global-state";
import { useGlobalPublicProfileDetailStore } from "@/global-states/visage-image-state";
import { handleDownloadMediaClick } from "@/helpers/downloadMedia";
import { UniversalVideoType } from "@/types/universalVideo.type";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

type VideoDynamicProps = {
  video: UniversalVideoType;
};

export default function VideoDynamic(props: VideoDynamicProps) {
  const { video } = props;

  const { globalViewPort } = useGlobalVisageScrollAreaGlobal();

  useEffect(() => {
    globalViewPort?.current?.scrollTo({ top: 0, behavior: "smooth" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { publicProfileDetail } = useGlobalPublicProfileDetailStore();

  const publicProfile = publicProfileDetail.find(
    (detail) => detail.id === video.videoId,
  );
  const video_quality_lists = video.video_files;

  const HD_video = video.video_files.find((vid) => vid.quality === "hd");

  return (
    <AdjustPadding>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {!publicProfile ? (
            <div
              className="relative flex aspect-square h-14 w-14 items-center justify-center rounded-full text-4xl font-bold text-stone-50"
              style={{ backgroundColor: "blueviolet" }}
            >
              <span className="">{video.user.name[0]}</span>
            </div>
          ) : (
            <Image
              className="h-12 w-12 rounded-full"
              src={publicProfile?.image ?? ""}
              alt=""
              width={48}
              height={48}
            />
          )}
          <div className="flex flex-col gap-y-2">
            {/* name */}
            <h2 className="text-lg font-semibold">{video.user.name}</h2>

            {/* follow */}
            <Link
              href={video.user.url ?? ""}
              className="cursor-pointer text-base font-semibold"
            >
              Follow
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <div>
            <CollectIconVideo video={video} nameIncluded />
          </div>
          <div>
            <HeartIconVideo video={video} nameIncluded />
          </div>

          {/* quality list here */}
          <div className="flex items-center">
            <Button
              className="rounded-none rounded-l-md"
              size={"visage"}
              variant={"visage"}
            >
              Download
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-none rounded-r-md bg-visage-400"
                  variant={"ghost"}
                  size={"visage"}
                >
                  <ChevronDown className="h-fit w-fit" size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={"w-72 max-w-72"}>
                <ScrollArea className="h-96">
                  <p className="p-4 text-lg font-semibold text-stone-400">
                    Choose a size:
                  </p>
                  {video_quality_lists.map((video_list) => (
                    <DownloadButtonDialogVideo
                      contentType="Video"
                      image={video.image}
                      key={video_list.id}
                      link={video_list.link}
                      userName={video.user.name}
                      userURL={video.user.url}
                    >
                      <div
                        className="cursor-pointer p-4 text-lg hover:bg-stone-100 active:bg-stone-200/80 dark:hover:bg-stone-800"
                        onClick={(e) => {
                          handleDownloadMediaClick(
                            video_list.link,
                            video_list.id.toString(),
                            "Video",
                          );
                        }}
                      >
                        <div className="flex items-center gap-x-5">
                          <p className="font-semibold">
                            {video_list.quality.toUpperCase()}
                          </p>
                          <p className="font-medium text-stone-300">
                            {video_list.height} x {video_list.width}
                          </p>
                        </div>
                      </div>
                    </DownloadButtonDialogVideo>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <AspectRatio ratio={16 / 9} className="mx-auto w-full md:w-[75%]">
        <MediaPlayer autoPlay playsInline src={HD_video?.link} className="">
          <MediaProvider />
          <PlyrLayout icons={plyrLayoutIcons} />
        </MediaPlayer>
      </AspectRatio>
    </AdjustPadding>
  );
}
