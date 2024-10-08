"use client";

import CollectIconVideo from "@/components/icons/collect-icon/collect-icon-video";
import HeartIconVideo from "@/components/icons/heart-icon/heart-icon-video";
import DownloadButtonDialogVideo from "@/components/shared/download-content-dialog";
import VisageDialogContent from "@/components/shared/visage-dialog-content";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

type VideoDynamicInterceptionProps = {
  video: UniversalVideoType;
};

export default function VideoDynamicInterception(
  props: VideoDynamicInterceptionProps,
) {
  const { video } = props;
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { publicProfileDetail } = useGlobalPublicProfileDetailStore();

  const publicProfile = publicProfileDetail.find(
    (detail) => detail.id === video.videoId,
  );

  const HD_video = video.video_files.find((vid) => vid.quality === "hd");
  const video_quality_lists = video.video_files;

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        router.back();
      }}
    >
      <VisageDialogContent className="fixed w-full max-w-full md:w-[80%]">
        <div className="flex items-center justify-between">
          <div className="hidden items-center gap-x-2 md:flex">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>{" "}
            {!publicProfile ? (
              <div
                className="flex aspect-square h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-stone-50"
                style={{ backgroundColor: "blueviolet" }}
              >
                {video.user.name[0]}
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
            <div className="block md:hidden">
              <CollectIconVideo video={video} />
            </div>
            <div className="hidden md:block">
              <CollectIconVideo video={video} nameIncluded />
            </div>

            <div className="block md:hidden">
              <HeartIconVideo video={video} />
            </div>
            <div className="hidden md:block">
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
                <DropdownMenuTrigger>
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

        <AspectRatio ratio={16 / 9} className="mx-auto w-full">
          <MediaPlayer
            autoPlay
            playsInline
            streamType="on-demand"
            logLevel="warn"
            viewType="video"
            crossOrigin
            src={HD_video?.link}
            className="h-full w-full"
            style={{ objectFit: "cover" }}
          >
            <MediaProvider />
            <PlyrLayout icons={plyrLayoutIcons} />
          </MediaPlayer>
        </AspectRatio>
      </VisageDialogContent>
    </Dialog>
  );
}
