"use client";

import AdjustPadding from "@/components/shared/adjust-padding";
import { cn } from "@/lib/utils";
import { UniversalImageType } from "@/types/universalImage.type";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CollectIcon from "../icons/collect-icon/collect-icon";
import DeleteIcon from "../icons/delete-icon/delete-icon";
import HeartIcon from "../icons/heart-icon/heart-icon";
import DownloadButtonDialog from "../shared/download-content-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import ImageDimensionLists from "./image-dimensions-lists";
import { useGlobalPublicProfileDetailStore } from "@/global-states/visage-image-state";
import { handleDownloadMediaClick } from "@/helpers/downloadMedia";
import { ManipulateCloudinaryURL } from "@/helpers/manipulateCloudinaryURL";

type ImageDynamicProps = {
  image: UniversalImageType;
};

export default function ImageDynamic(props: ImageDynamicProps) {
  const { image } = props;

  const [customWidth, setCustomWidth] = useState(image?.width);
  const [customHeight, setCustomHeight] = useState(image?.height);
  const { publicProfileDetail } = useGlobalPublicProfileDetailStore();

  const publicProfile = publicProfileDetail.find(
    (detail) => detail.id === image.userId,
  );

  const imageRatio = image.width / image.height;

  function calcCustomWidth(width: string) {
    const widthInNumber = parseInt(width);

    if (!isNaN(widthInNumber)) {
      setCustomHeight(widthInNumber * imageRatio);
      setCustomWidth(widthInNumber);
    } else {
      setCustomWidth(0);
      setCustomHeight(0);
    }
  }
  function calcCustomHeight(height: string) {
    const heightInNumber = parseInt(height);

    if (!isNaN(heightInNumber)) {
      setCustomWidth(heightInNumber / imageRatio);
      setCustomHeight(heightInNumber);
    } else {
      setCustomHeight(0);
      setCustomWidth(0);
    }
  }

  function handleCustomImageDownload() {
    const origionalImage = image.src.original;
    const isCloudinaryImage = origionalImage.startsWith(
      "https://res.cloudinary.com",
    );

    let customDownloadUrl = "";
    if (isCloudinaryImage) {
      customDownloadUrl = ManipulateCloudinaryURL(
        origionalImage,
        customWidth,
        customHeight,
        null,
        true,
      );
    }

    if (!isCloudinaryImage) {
      customDownloadUrl = image.src.original.concat(
        `?&h=${customHeight}&w=${customWidth}`,
      );
    }

    handleDownloadMediaClick(
      customDownloadUrl,
      image.alt ?? image.photographer,
      "Image",
    );
  }

  return (
    <div>
      <AdjustPadding className="flex items-center justify-between">
        <div className="mt-4 hidden items-center gap-x-2 md:flex">
          {!publicProfile ? (
            <div
              className="flex aspect-square h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-stone-50"
              style={{ backgroundColor: image?.avg_color ?? "blueviolet" }}
            >
              {image?.photographer[0]}
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
            <h2 className="text-lg font-semibold">{image?.photographer}</h2>

            {/* follow */}
            <Link
              href={image?.photographer_url ?? ""}
              className="cursor-pointer text-base font-semibold"
            >
              Follow
            </Link>
          </div>
        </div>

        {/* download */}
        <div className="flex items-center gap-x-2">
          <div className="block md:hidden">
            <DeleteIcon imageId={image.imageId} imageSrc={image.src.medium} />
          </div>
          <div className="hidden md:block">
            <DeleteIcon
              nameIncluded
              imageId={image.imageId}
              imageSrc={image.src.medium}
            />
          </div>

          <div className="block md:hidden">
            <CollectIcon image={image} />
          </div>
          <div className="hidden md:block">
            <CollectIcon image={image} nameIncluded />
          </div>

          <div className="block md:hidden">
            <HeartIcon image={image} />
          </div>
          <div className="hidden md:block">
            <HeartIcon image={image} nameIncluded />
          </div>
          <div className="flex items-center gap-x-1 rounded-md bg-visage-400 hover:bg-visage-500">
            <DownloadButtonDialog
              contentType="Image"
              image={image.src.large}
              link={image.src.large}
              userName={image.photographer}
              userURL={image.photographer_url}
            >
              <Button
                onClick={() =>
                  handleDownloadMediaClick(
                    image.src.original,
                    image.alt ?? image.imageId,
                    "Image",
                  )
                }
                variant={"visage"}
                className="h-10 md:h-14"
              >
                Free Download
              </Button>
            </DownloadButtonDialog>

            <Separator className="m-0 h-10 p-0" orientation="vertical" />

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex h-10 items-center justify-center rounded-md bg-inherit p-4 font-medium text-stone-50 hover:bg-inherit focus:border-none active:bg-inherit md:h-14",
                  "group",
                )}
              >
                <ChevronDown
                  size={20}
                  className={cn("rotate-0 transition group-hover:rotate-180")}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={"w-72 max-w-72"}>
                <ScrollArea className="h-96">
                  <p className="p-4 text-lg font-semibold text-stone-400">
                    Choose a size:
                  </p>

                  {/* lists */}
                  {Object.entries(image?.src ?? {}).map((obj, index) => (
                    <ImageDimensionLists image={image} key={index} obj={obj} />
                  ))}

                  <div className="flex items-center gap-x-2 px-4 py-2">
                    {/* width input */}
                    <Input
                      value={Math.ceil(customWidth)}
                      className={cn(
                        "h-12 text-lg font-semibold text-stone-400",
                        "focus-visible:border-stone-400 focus-visible:ring-0 focus-visible:ring-offset-0",
                      )}
                      onChange={(e) => calcCustomWidth(e.target.value)}
                    />
                    {/* height input */}
                    <Input
                      value={Math.ceil(customHeight)}
                      className={cn(
                        "h-12 text-lg font-semibold text-stone-400",
                        "focus-visible:border-stone-400 focus-visible:ring-0 focus-visible:ring-offset-0",
                      )}
                      onChange={(e) => calcCustomHeight(e.target.value)}
                    />
                  </div>

                  <DownloadButtonDialog
                    contentType="Image"
                    image={image.src.large}
                    link={image.src.large}
                    userName={image.photographer}
                    userURL={image.photographer_url}
                  >
                    <Button
                      className="mt-4 w-full px-4"
                      size={"visage"}
                      variant={"visage"}
                      onClick={handleCustomImageDownload}
                    >
                      Download Custom Size
                    </Button>
                  </DownloadButtonDialog>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AdjustPadding>

      <div className="px-4">
        {/* image */}
        <div className="relative h-[30rem] md:mt-8">
          <Image
            src={image.src.large}
            alt={image.alt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover", borderRadius: 10 }}
          />
        </div>
      </div>

      {/* giving some height below an image */}
      <div className="h-12"></div>
    </div>
  );
}
