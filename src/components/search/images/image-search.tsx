"use client";

import { MasonryClient } from "@/components/masonry/masonry-client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UniqueImage } from "@/components/shared/unique-image";
import { getPexelPhotoByKeyword } from "@/servers/pexel/pexel-server";
import { UniversalImagesType } from "@/types/visage-type";
import Link from "next/link";
import { generate } from "random-words";
import { useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import { PropagateLoader } from "react-spinners";

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
        <div className="flex gap-x-2 items-center py-2">
          {randomKeywords.map((keyword, index) => (
            <Link
              href={`/search/images/${keyword}`}
              key={index}
              className="px-6 py-4 cursor-pointer border rounded-md hover:bg-visage-600 active:bg-visage-500 bg-transparent transition hover:text-white text-stone-800 font-medium text-base">
              {keyword}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <h1 className="font-medium text-6xl text-stone-600 my-8">
        Free <span className="capitalize mr-2 text-stone-800">{keyword}</span>
        Images
      </h1>
      <div className="my-8 bg-black rounded-full px-6 py-3 hover:bg-black/80 text-white w-fit flex gap-x-2 items-center">
        <span className="text-stone-50 font-medium">Photos</span>
        <span className="text-stone-500 font-medium">
          {refactorTotalResult()}
        </span>
      </div>
      <MasonryClient>
        {photos?.map((photo) => (
          <UniqueImage
            key={photo.id}
            image={photo}
          />
        ))}
      </MasonryClient>
      <div
        ref={ref}
        className="h-9 text-center w-full overflow-x-clip my-4 ">
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
