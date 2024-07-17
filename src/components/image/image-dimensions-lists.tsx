"use client";

import { UniversalImageType } from "@/types/visage-type";
import { handleDownloadImageClick } from "@/utility/utils";
import { useEffect, useState, useTransition } from "react";
import DownloadButtonDialog from "../download-button-dialog";

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
    url: string
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
        <div className="text-lg p-4 hover:bg-stone-100">
          <div className="flex gap-x-5 items-center">
            <p className="font-semibold">{obj[0]}</p>
            <p className="flex justify-center items-center text-stone-600 font-medium animate-pulse bg-stone-200 w-full rounded-lg">
              loading...
            </p>
          </div>
        </div>
      ) : (
        image && (
          <DownloadButtonDialog image={image}>
            <div
              className="text-lg p-4 hover:bg-stone-100 cursor-pointer active:bg-stone-200/80"
              onClick={(e) => {
                handleDownloadImageClick(
                  obj[1],
                  image.alt ?? image.photographer
                );
              }}>
              <div className="flex gap-x-5 items-center">
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
