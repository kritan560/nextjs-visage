"use client";

import {
  useGlobalCollectImageIdsStore,
  useGlobalLikeImageStore,
  useGlobalPublicProfileDetailStore,
} from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { UniversalImageType } from "@/types/visage-type";
import {
  StructureTheImageParam,
  TruncatePhotgrapherName,
  handleDownloadImageClick,
} from "@/utility/utils";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CollectIcon from "../icons/collect-icon/collect-icon";
import DeleteIcon from "../icons/delete-icon/delete-icon";
import HeartIcon from "../icons/heart-icon/heart-icon";
import { Button } from "../ui/button";
import DownloadButtonDialog from "./download-button-dialog";

const blurDataURL =
  "data:image/webp;base64,UklGRowCAABXRUJQVlA4WAoAAAAgAAAAwwAAwwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggngAAADANAJ0BKsQAxAA+7Xa4VqmnJSOgSAEwHYlpbuCUBHjw8ALS4DeirhBlWYEvZMkE5w17ZOaVcLXVUoWusMkERNByxvpivvEAiJe/GT61Ti22jEhGCC0fLzI8LXVUnD7GTi1JuLgJvRCWwnsGxIwXQiKW4AD+pGXVOVryFj61/69G/5A1h4oQ6ARrjeCTcz7Ml3AOK7BnHqXIJQCAAAAA";

type UniqueImageProps = {
  image: UniversalImageType;
};

export function UniqueImage(props: UniqueImageProps) {
  const { image } = props;

  const [loading, setLoading] = useState(true);

  const { globalCollectImagesIds } = useGlobalCollectImageIdsStore();
  const { globalLikedImagesIds } = useGlobalLikeImageStore();
  const { publicProfileDetail } = useGlobalPublicProfileDetailStore();

  const publicProfile = publicProfileDetail.find(
    (detail) => detail.id === image.userId,
  );

  return (
    <div key={image.id} className="group relative">
      <Link
        scroll={false}
        href={`/image/${StructureTheImageParam(image.imageId, image.alt)}`}
      >
        <Image
          className={cn("rounded-md", loading && "animate-pulse")}
          src={image.src.large}
          alt={image.alt ?? ""}
          height={image.height}
          width={image.width}
          placeholder="blur"
          blurDataURL={blurDataURL}
          onLoad={() => setLoading(false)}
        />
      </Link>

      {/* download button, bookmark, favorite */}
      <div className="opacity-0 transition group-hover:opacity-100">
        {/* photographer name and image */}
        <Link
          target="_blank"
          href={image.photographer_url}
          className="absolute bottom-4 left-4 flex items-center gap-x-2"
        >
          {image.photographer_url.includes("pexels") ? (
            //  photographer image : pexels doesn't provide the user DP so adjusting the DP manually
            <div
              className="flex aspect-square w-12 items-center justify-center rounded-full text-2xl font-bold uppercase text-stone-50"
              style={{
                backgroundColor: image.avg_color ?? "blueviolet",
              }}
            >
              {image.photographer[0]}
            </div>
          ) : (
            <Image
              className="h-12 w-12 rounded-full"
              src={publicProfile?.image ?? ""}
              alt=""
              width={48}
              height={48}
            />
          )}

          {/* photographer name */}
          <p className="text-xl font-medium capitalize text-stone-50">
            {TruncatePhotgrapherName(image.photographer)}
          </p>
        </Link>

        {/* download button */}
        <DownloadButtonDialog image={image}>
          <Button
            onClick={() =>
              handleDownloadImageClick(
                image.src.original,
                image.alt ?? image.imageId,
              )
            }
            className="absolute bottom-4 right-4 flex h-12 items-center gap-x-2 rounded-full"
            variant={"visage"}
            size={"default"}
          >
            <Download size={18} className="" />
            Download
          </Button>
        </DownloadButtonDialog>

        <div className="absolute right-4 top-4 flex items-center gap-x-2">
          {/* collect */}
          <CollectIcon image={image} />

          {/* liked icon */}
          <HeartIcon image={image} />
        </div>
        <div className="absolute left-4 top-4">
          <DeleteIcon imageSrc={image.src.medium} imageId={image.imageId} />
        </div>
      </div>

      {/* this div is here to show bookmark and heart icon when it is bookmarked and loved */}
      <div className="absolute right-4 top-4 flex items-center gap-x-2">
        <div
          className={cn(
            globalCollectImagesIds?.includes(image.imageId)
              ? "opacity-100"
              : "absolute opacity-0",
          )}
        >
          <CollectIcon image={image} />
        </div>
        <div
          className={cn(
            globalLikedImagesIds?.includes(image.imageId)
              ? "opacity-100"
              : "absolute opacity-0",
          )}
        >
          <HeartIcon image={image} />
        </div>
      </div>
    </div>
  );
}
