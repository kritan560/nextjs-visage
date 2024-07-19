"use client";

import { CollectionImageResizable } from "@/components/profile/collections/collection-resizable";
import { useGlobalCollectionNameStore } from "@/global-states/visage-image-state";
import { UniversalImagesType } from "@/types/visage-type";
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
            className="w-full h-80 hover:contrast-75 transition cursor-pointer active:contrast-100 bg-stone-200 rounded-md relative"
            key={collection.id}>
            {/* {collection.collectionName} */}
            <CollectionImageResizable
              images={collection.collectionImages as UniversalImagesType}
            />
            <div className="flex justify-between items-center text-stone-500 mt-1">
              <p className="font-medium text-xl ">
                {collection.collectionName}
              </p>
              <span className="flex gap-x-2 items-center">
                <FaRegImages size={26} />
                <span className="font-medium text-xl">
                  {collection.collectionImages.length}
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
