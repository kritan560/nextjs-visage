"use client";

import {
  useGlobalCollectImageIdsStore,
  useGlobalLikeImageStore,
  useGlobalPublicProfileDetailStore,
} from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { UniversalImageType } from "@/types/universalImage.type";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CollectIcon from "../icons/collect-icon/collect-icon";
import DeleteIcon from "../icons/delete-icon/delete-icon";
import HeartIcon from "../icons/heart-icon/heart-icon";
import { Button } from "../ui/button";
import DownloadButtonDialog from "./download-content-dialog";
import { StructureTheImageParam } from "@/helpers/idHandler";
import { TruncateCreatorName } from "@/helpers/truncateCreatorName";
import { handleDownloadMediaClick } from "@/helpers/downloadMedia";
import { blurDataURL } from "@/constants/blurDataUrl";

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
      <div className="opacity-0 transition md:group-hover:opacity-100">
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
            {TruncateCreatorName(image.photographer)}
          </p>
        </Link>

        {/* download button */}
        <DownloadButtonDialog
          contentType="Image"
          image={image.src.large}
          link={image.src.large}
          userName={image.photographer}
          userURL={image.photographer_url}
        >
          <Button
            onClick={() =>
              handleDownloadMediaClick(
                image.src.original,
                image.alt ?? image.imageId,
                "Image",
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
