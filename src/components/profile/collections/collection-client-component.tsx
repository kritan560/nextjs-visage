"use client";

import { CollectionImageResizable } from "@/components/profile/collections/collection-resizable";
import { useGlobalCollectionNameStore } from "@/global-states/visage-image-state";
import { UniversalImagesType } from "@/types/universalImage.type";
import { UniversalVideosType } from "@/types/universalVideo.type";
import { Images } from "lucide-react";
import Link from "next/link";
import { PiVideoLight } from "react-icons/pi";
import NoMediaContent from "../no-media-content";

export default function CollectionsClientComponent() {
  const { globalCollectionNames: collectionNamesSuccess } =
    useGlobalCollectionNameStore();

  if (collectionNamesSuccess && collectionNamesSuccess?.length <= 0) {
    return (
      <NoMediaContent
        heading="You haven't collected any content yet 🙁"
        message="It's ok, we know it's probably hard to collect what you see
    from all your amazing photos. You can come back and collect at any time.
    In the meantime, how about some amazing content from the talented
    photographers on Visage?"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3">
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

            let collectionContents: string[] = [];

            if (totalContents.length >= 3) {
              collectionContents = [
                totalContents[middle - 1],
                totalContents[middle],
                totalContents[middle + 1],
              ];
            }
            if (totalContents.length === 2) {
              collectionContents = [
                totalContents[middle],
                totalContents[middle + 1],
              ];
            }
            if (totalContents.length === 1) {
              collectionContents = [totalContents[middle]];
            }

            return (
              <Link
                href={`/collections/${collection.id}`}
                className="relative block h-44 w-full cursor-pointer rounded-md bg-stone-200 transition hover:contrast-75 active:contrast-100 dark:bg-stone-800 md:h-80"
                key={collection.id}
              >
                <CollectionImageResizable images={collectionContents} />
                <div className="mt-1 flex items-center justify-between text-stone-500">
                  <p className="text-xl font-medium">
                    {collection.collectionName}
                  </p>
                  <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                      <Images size={25} />
                      {collectionImages.length}
                    </div>
                    <div className="flex items-center gap-x-2">
                      <PiVideoLight strokeWidth={4} size={25} />
                      {collectionVideos.length}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="h-8"></div>
    </>
  );
}
