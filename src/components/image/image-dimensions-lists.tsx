"use client";

import { UniversalImageType } from "@/types/universalImage.type";
import { useEffect, useState, useTransition } from "react";
import DownloadButtonDialog from "../shared/download-content-dialog";
import { handleDownloadMediaClick } from "@/helpers/downloadMedia";

type ImageDimensionListProps = {
  obj: [string, string];
  image: UniversalImageType;
};

export default function ImageDimensionLists(props: ImageDimensionListProps) {
  const { obj, image } = props;
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [isPending, startTransition] = useTransition();

  const getImageDimensions = (
    url: string,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        reject("Error loading image");
      };
      img.src = url;
    });
  };

  useEffect(() => {
    startTransition(async () => {
      const { height, width } = await getImageDimensions(obj[1]);
      setHeight(height);
      setWidth(width);
    });
  }, [obj]);

  return (
    <>
      {isPending ? (
        <div className="p-4 text-lg hover:bg-stone-100 dark:hover:bg-stone-800">
          <div className="flex items-center gap-x-5">
            <p className="font-semibold">{obj[0]}</p>
            <p className="flex w-full animate-pulse items-center justify-center rounded-lg bg-stone-200 font-medium text-stone-600">
              loading...
            </p>
          </div>
        </div>
      ) : (
        image && (
          <DownloadButtonDialog
            contentType="Image"
            image={image.src.large}
            link={image.src.large}
            userName={image.photographer}
            userURL={image.photographer_url}
          >
            <div
              className="cursor-pointer p-4 text-lg hover:bg-stone-100 active:bg-stone-200/80 dark:hover:bg-stone-800"
              onClick={(e) => {
                handleDownloadMediaClick(
                  obj[1],
                  image.alt ?? image.photographer,
                  "Image",
                );
              }}
            >
              <div className="flex items-center gap-x-5">
                <p className="font-semibold">{obj[0]}</p>
                <p className="font-medium text-stone-300">
                  {height} x {width}
                </p>
              </div>
            </div>
          </DownloadButtonDialog>
        )
      )}
    </>
  );
}
