"use client";

import { CollectionImageResizable } from "@/components/profile/collections/collection-resizable";
import { CollectionVideoResizable } from "@/components/profile/collections/collection-resizable-video";
import { useGlobalCollectionNameStore } from "@/global-states/visage-image-state";
import { UniversalImagesType, UniversalVideosType } from "@/types/visage-type";
import Link from "next/link";
import { FaRegImages } from "react-icons/fa6";

export default function CollectionsPage() {
  const { globalCollectionNames: collectionNamesSuccess } =
    useGlobalCollectionNameStore();

  return (
    <>
      <div className="grid grid-cols-3 gap-x-8 gap-y-14">
        {collectionNamesSuccess &&
          collectionNamesSuccess.map((collection) => (
            <Link
              href={`/collections/${collection.id}`}
              className="relative h-80 w-full cursor-pointer rounded-md bg-stone-200 transition hover:contrast-75 active:contrast-100"
              key={collection.id}
            >
              {/* {collection.collectionName} */}
              <CollectionImageResizable
                images={collection.collectionImages as UniversalImagesType}
              />
              <CollectionVideoResizable
                videos={
                  collection.collectionVideos as UniversalVideosType["videos"]
                }
              />
              <div className="mt-1 flex items-center justify-between text-stone-500">
                <p className="text-xl font-medium">
                  {collection.collectionName}
                </p>
                <span className="flex items-center gap-x-2">
                  {/* !!! show video icon too */}
                  <FaRegImages size={26} />
                  <span className="text-xl font-medium">
                    {collection.collectionImages.length +
                      collection.collectionVideos.length}
                  </span>
                </span>
              </div>
            </Link>
          ))}
      </div>
      <div className="h-8"></div>
    </>
  );
}
