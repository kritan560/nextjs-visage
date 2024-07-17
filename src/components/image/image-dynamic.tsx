"use client";

import AdjustPadding from "@/components/adjust-padding";
import { cn } from "@/lib/utils";
import { UniversalImageType } from "@/types/visage-type";
import { handleDownloadImageClick } from "@/utility/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DownloadButtonDialog from "../download-button-dialog";
import CollectIcon from "../icons/collect-icon";
import HeartIcon from "../icons/heart-icon";
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

type ImageDynamicProps = {
  image: UniversalImageType;
};

export default function ImageDynamic(props: ImageDynamicProps) {
  const { image } = props;

  const [customWidth, setCustomWidth] = useState(image?.width);
  const [customHeight, setCustomHeight] = useState(image?.height);

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
    const customDownloadUrl = image.src.original.concat(
      `?&h=${customHeight}&w=${customWidth}`
    );

    handleDownloadImageClick(
      customDownloadUrl,
      image.alt ?? image.photographer
    );
  }

  return (
    <div>
      <AdjustPadding className="flex items-center justify-between ">
        <div className="flex items-center gap-x-2 mt-4">
          <div
            className="w-14 h-14 aspect-square rounded-full text-xl font-bold flex justify-center items-center text-stone-50"
            style={{ backgroundColor: image?.avg_color ?? "blueviolet" }}>
            {image?.photographer[0]}
          </div>
          <div className="flex flex-col gap-y-2">
            {/* name */}
            <h2 className="font-semibold text-lg">{image?.photographer}</h2>

            {/* follow */}
            <Link
              href={image?.photographer_url ?? ""}
              className="font-semibold text-base cursor-pointer">
              Follow
            </Link>
          </div>
        </div>

        {/* download */}
        <div className="flex items-center gap-x-2">
          <div>
            <CollectIcon
              image={image}
              nameIncluded
            />
          </div>
          <div>
            <HeartIcon
              image={image}
              nameIncluded
            />
          </div>
          <div className="flex items-center gap-x-1 bg-visage-400 hover:bg-visage-500 rounded-md">
            <DownloadButtonDialog image={image}>
              <Button
                onClick={() =>
                  handleDownloadImageClick(
                    image.src.original,
                    image.alt ?? String(image.id)
                  )
                }
                variant={"visage"}
                className="h-14">
                Free Download
              </Button>
            </DownloadButtonDialog>

            <Separator
              className="p-0 m-0 h-10"
              orientation="vertical"
            />

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "p-4 h-14 bg-inherit hover:bg-inherit active:bg-inherit text-stone-50 font-medium flex items-center justify-center focus:border-none rounded-md",
                  "group"
                )}>
                <ChevronDown
                  size={20}
                  className={cn("group-hover:rotate-180 rotate-0 transition")}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={"max-w-72 w-72"}>
                <ScrollArea className="h-96">
                  <p className="text-lg p-4 font-semibold text-stone-400">
                    Choose a size:
                  </p>

                  {/* lists */}
                  {Object.entries(image?.src ?? {}).map((obj, index) => (
                    <ImageDimensionLists
                      image={image}
                      key={index}
                      obj={obj}
                    />
                  ))}

                  <div className="flex gap-x-2 py-2 px-4 items-center">
                    {/* width input */}
                    <Input
                      value={Math.ceil(customWidth)}
                      className={cn(
                        "h-12 font-semibold text-stone-400 text-lg",
                        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-stone-400"
                      )}
                      onChange={(e) => calcCustomWidth(e.target.value)}
                    />
                    {/* height input */}
                    <Input
                      value={Math.ceil(customHeight)}
                      className={cn(
                        "h-12 font-semibold text-stone-400 text-lg",
                        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-stone-400"
                      )}
                      onChange={(e) => calcCustomHeight(e.target.value)}
                    />
                  </div>

                  <DownloadButtonDialog image={image}>
                    <Button
                      className="mt-4 w-full px-4"
                      size={"visage"}
                      variant={"visage"}
                      onClick={handleCustomImageDownload}>
                      Download Custom Size
                    </Button>
                  </DownloadButtonDialog>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AdjustPadding>

      {/* image */}
      <div className="h-[30rem] mt-8 relative">
        <Image
          src={image.src.large}
          alt={image.alt ?? ""}
          fill
          style={{ objectFit: "contain", borderRadius: 20 }}
        />
      </div>

      {/* giving some height below an image */}
      <div className="h-12"></div>
    </div>
  );
}
