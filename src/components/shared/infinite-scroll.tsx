"use client";

import { useGlobalImagesStore } from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { getPexelCuratedPhotosByPage_PerPage } from "@/servers/pexel/pexel-server";
import { MediaType, UniversalImagesType } from "@/types/visage-type";
import { useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import { PropagateLoader } from "react-spinners";
import { MasonryClient } from "../masonry/masonry-client";
import AdjustPadding from "./adjust-padding";
import { UniqueImage } from "./unique-image";

type InfiniteScrollProps = {
  mediaType: MediaType | undefined;
  curatedAndImages: UniversalImagesType;
};

export default function InfiniteScroll(props: InfiniteScrollProps) {
  const { mediaType, curatedAndImages } = props;

  const { ref, inView } = useInView();
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(2);
  const [initialLoading, setInitialLoading] = useState(true);

  const { globalImages, setGlobalImages: setPexelCuratedPhotos } =
    useGlobalImagesStore();

  useEffect(() => {
    if (inView) {
      startTransition(async () => {
        const curatedPhotos = await getPexelCuratedPhotosByPage_PerPage(page);

        if (globalImages && curatedPhotos) {
          setPexelCuratedPhotos([...globalImages, ...curatedPhotos]);
        }
      });
      setPage((prev) => prev + 1);
    }
    setInitialLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    setPexelCuratedPhotos([...curatedAndImages]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // startTransition(async () => {
  //   const { failed, success } = await getImages();
  //   const curatedPhotos = await getPexelCuratedPhotosByPage_PerPage();

  //   const images = success?.data;
  //   if (images && curatedPhotos) {
  //     setPexelCuratedPhotos([...images, ...curatedPhotos]);
  //   }
  // });

  return (
    <AdjustPadding>
      {/* image mansonry */}
      {mediaType === "Image" && (
        <MasonryClient>
          {globalImages?.map((image) => (
            <UniqueImage key={image.id} image={image} />
          ))}
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
