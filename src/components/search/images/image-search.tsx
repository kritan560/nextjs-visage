"use client";

import { MasonryClient } from "@/components/masonry/masonry-client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UniqueImage } from "@/components/shared/unique-image";
import { getPexelPhotoByKeyword } from "@/servers/pexel/pexelPhoto.server";
import { UniversalImagesType } from "@/types/universalImage.type";
import Link from "next/link";
import { generate } from "random-words";
import { useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import { PropagateLoader } from "react-spinners";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ImageSearchProps = {
  keyword: string;
  searchedPhotos: UniversalImagesType | null;
  totalResult: number | undefined;
};

export default function ImageSearch(props: ImageSearchProps) {
  const { keyword, searchedPhotos, totalResult } = props;

  const [randomKeywords, setRandomKeywords] = useState([""]);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState(2);
  const [photos, setSearchedPhotos] = useState(searchedPhotos);
  const { ref, inView } = useInView();

  function refactorTotalResult() {
    if (totalResult) {
      const refactor = totalResult / 1000;
      return `${refactor.toFixed(1)}K`;
    }
  }

  const randomWords = generate({
    min: 12,
    max: 20,
    wordsPerString: 1,
    seed: keyword,
  });

  useEffect(() => {
    if (typeof randomWords !== "string") {
      setRandomKeywords(randomWords);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inView) {
      startTransition(async () => {
        const photoByKeyword = await getPexelPhotoByKeyword(keyword, page);
        if (photoByKeyword && photos) {
          setSearchedPhotos([...photos, ...photoByKeyword]);
        }
      });
      setPage((prev) => prev + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="mt-4">
      <ScrollArea className="w-[1240px] max-w-7xl">
        <div className="flex items-center gap-x-2 pb-4">
          {randomKeywords.map((keyword, index) => (
            <Link
              href={`/search/images/${keyword}`}
              key={index}
              className="cursor-pointer rounded-md border bg-transparent px-6 py-4 text-base font-medium text-stone-800 transition hover:bg-visage-600 hover:text-white active:bg-visage-500 dark:bg-stone-800 dark:text-white dark:hover:bg-stone-700"
            >
              {keyword}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <h1 className="my-8 h-[70px] w-[700px] truncate text-6xl font-medium text-stone-600 dark:text-stone-400">
              Free{" "}
              <span className="mr-2 capitalize text-stone-800 dark:text-stone-600">
                {decodeURI(keyword)}{" "}
              </span>
              Images
            </h1>
          </TooltipTrigger>
          <TooltipContent align="start">
            <p className="text-lg">Free {decodeURI(keyword)} Images</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="my-8 flex w-fit items-center gap-x-2 rounded-full bg-black px-6 py-3 text-white hover:bg-black/80 dark:bg-stone-400 dark:text-stone-800 hover:dark:bg-stone-500">
        <span className="font-medium text-stone-50 dark:text-stone-800">
          Photos
        </span>
        <span className="font-medium text-stone-500 dark:text-stone-600">
          {refactorTotalResult()}
        </span>
      </div>
      <MasonryClient>
        {photos?.map((photo) => <UniqueImage key={photo.id} image={photo} />)}
      </MasonryClient>
      <div ref={ref} className="my-4 h-9 w-full overflow-x-clip text-center">
        <PropagateLoader
          size={30}
          className="scale-[2.0]"
          color="rgb(197 129 50)"
          loading={isPending}
        />
      </div>{" "}
    </div>
  );
}
