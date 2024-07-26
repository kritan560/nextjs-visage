"use client";

import { CollectionImageResizable } from "@/components/profile/collections/collection-resizable";
import { useGlobalCollectionNameStore } from "@/global-states/visage-image-state";
import { UniversalImagesType, UniversalVideosType } from "@/types/visage-type";
import { Images } from "lucide-react";
import Link from "next/link";
import { PiVideoLight } from "react-icons/pi";

export default function CollectionsPage() {
  const { globalCollectionNames: collectionNamesSuccess } =
    useGlobalCollectionNameStore();

  return (
    <>
      <div className="grid grid-cols-3 gap-x-8 gap-y-14">
        {collectionNamesSuccess &&
          collectionNamesSuccess.map((collection) => {
            const collectionImages = (
              collection.collectionImages as UniversalImagesType
            ).map((data) => data.src.medium);

            const collectionVideos = (
              collection.collectionVideos as UniversalVideosType["videos"]
            ).map((data) => data.image);

            let totalContents = [
              ...collectionImages,
              ...collectionVideos.reverse(),
            ];

            const middle = Math.ceil(totalContents.length / 2) - 1;

            let collectionContents = [
              totalContents[middle - 1],
              totalContents[middle],
              totalContents[middle + 1],
            ];

            return (
              <Link
                href={`/collections/${collection.id}`}
                className="relative h-80 w-full cursor-pointer rounded-md bg-stone-200 transition hover:contrast-75 active:contrast-100"
                key={collection.id}
              >
                <CollectionImageResizable images={collectionContents} />
                <div className="mt-1 flex items-center justify-between text-stone-500">
                  <p className="text-xl font-medium">
                    {collection.collectionName}
                  </p>
                  <span className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                      <Images size={25} />
                      {collectionImages.length}
                    </div>
                    <div className="flex items-center gap-x-2">
                      <PiVideoLight strokeWidth={4} size={25} />
                      {collectionVideos.length}
                    </div>
                  </span>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="h-8"></div>
    </>
  );
}
