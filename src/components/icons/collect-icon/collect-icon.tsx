"use client";

import VisageDialogContent from "@/components/shared/visage-dialog-content";
import { VisageToast } from "@/components/shared/visage-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGlobalCollectImageIdsStore,
  useGlobalCollectionNameStore,
} from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { LinkCollections, LinkLoginPage } from "@/links/visage-links";
import { AuthFailedEnum } from "@/enums/authentication-server-enums";
import {
  UniversalImageType,
  UniversalImagesType,
} from "@/types/universalImage.type";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoBookmarksOutline, IoBookmarksSharp } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import { CollectIconForm } from "./collect-icon-form";
import { collectImage } from "@/servers/CollectImage.server";

type CollectIconProps = {
  image: UniversalImageType;
  nameIncluded?: boolean;
};

export default function CollectIcon(props: CollectIconProps) {
  const { image, nameIncluded = false } = props;

  const [open2ndDialog, setOpen2ndDialog] = useState(false);
  const { globalCollectImagesIds, setGlobalCollectImageId } =
    useGlobalCollectImageIdsStore();
  const { globalCollectionNames, setGlobalCollectionNames } =
    useGlobalCollectionNameStore();
  const router = useRouter();

  async function handleAddToCollection(
    collectionName: string,
    collectionNameId?: string,
  ) {
    const { failed, success } = await collectImage(
      collectionName,
      image,
      collectionNameId,
    );

    if (success) {
      VisageToast.success(success.message);

      const successDataCollectionNameId = success.data.id;

      const updatedDataCollectionName = globalCollectionNames?.filter(
        (data) => data.id !== successDataCollectionNameId,
      );

      if (updatedDataCollectionName) {
        const collectionNames = [
          success.data,
          ...updatedDataCollectionName,
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setGlobalCollectionNames(collectionNames);

        const updatedCollectionImageIds: string[] = [];
        collectionNames.map((data) =>
          (data.collectionImages as UniversalImagesType).map((data) =>
            updatedCollectionImageIds.push(data.imageId),
          ),
        );

        setGlobalCollectImageId(updatedCollectionImageIds);
      }
    }

    if (failed) {
      VisageToast.error(failed.message);
      if (failed.message === AuthFailedEnum.USER_NOT_LOGGED_IN) {
        router.push(LinkLoginPage);
        nProgress.start();
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            nameIncluded &&
              "flex h-14 cursor-pointer items-center gap-x-2 rounded-md border px-4 transition hover:border-stone-500 active:border-stone-400",
            !nameIncluded &&
              "cursor-pointer rounded-lg bg-gray-300 p-2 transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-800",
            "",
          )}
        >
          {globalCollectImagesIds?.includes(image.imageId) ? (
            <>
              <IoBookmarksSharp fill="rgb(197 129 50)" />
              <p>{nameIncluded && "Collect"}</p>
            </>
          ) : (
            <>
              <IoBookmarksOutline className="" />
              <p>{nameIncluded && "Collect"}</p>
            </>
          )}
        </div>
      </DialogTrigger>
      <VisageDialogContent className="h-[500px] min-w-[650px] p-8">
        <ScrollArea type="auto" className="h-[434px] w-full">
          <DialogHeader>
            <DialogTitle className="flex flex-col gap-y-4 text-center text-3xl font-semibold">
              <span>Save to Collection</span>
              <Link
                href={LinkCollections}
                className="mx-auto mb-4 w-fit cursor-pointer border-b border-dashed border-stone-400 text-base font-medium text-stone-500 transition hover:scale-105 active:scale-100 dark:text-stone-400"
              >
                All Collection
              </Link>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          {/* 2nd dialog */}
          <Dialog open={open2ndDialog} onOpenChange={setOpen2ndDialog}>
            <div className="grid grid-cols-3 justify-items-center gap-3">
              <DialogTrigger asChild>
                {/* create new collection */}
                <div className="flex w-fit flex-col">
                  <div className="group flex aspect-square w-40 cursor-pointer items-center justify-center rounded-md bg-stone-200 transition hover:scale-105 dark:bg-stone-400">
                    <CirclePlus
                      size={45}
                      className="text-stone-600 transition group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-1 w-40 truncate text-center">
                    Create new Collection
                  </p>
                </div>
              </DialogTrigger>

              {globalCollectionNames?.map((collectionName) => (
                <div key={collectionName.id} className="flex w-fit flex-col">
                  <div
                    onClick={() =>
                      handleAddToCollection(
                        collectionName.collectionName,
                        collectionName.id,
                      )
                    }
                    className="relative flex aspect-square w-40 cursor-pointer items-center justify-center rounded-md bg-stone-200 transition hover:scale-105 active:scale-100 dark:bg-stone-400"
                  >
                    {(
                      collectionName.collectionImages as UniversalImagesType
                    )?.find((img) => img.imageId == image.imageId) ? (
                      <>
                        <Image
                          src={image.src.medium}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="rounded-md"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="group absolute flex h-40 w-40 items-center justify-center rounded-md bg-emerald-600/80 hover:bg-rose-600/80">
                          <FaCheckCircle
                            size={45}
                            className="text-stone-50 group-hover:hidden"
                          />
                          <IoMdCloseCircleOutline
                            size={45}
                            className="hidden text-stone-50 group-hover:block"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="group relative flex h-40 w-40 items-center justify-center rounded-md transition hover:bg-black/75">
                        <LuImagePlus
                          size={45}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-600 group-hover:opacity-40"
                        />{" "}
                        <CirclePlus
                          strokeWidth={"2px"}
                          size={45}
                          className="z-[1] hidden text-white group-hover:block"
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 w-40 truncate text-center capitalize">
                    {collectionName.collectionName}
                  </p>
                </div>
              ))}
            </div>

            <VisageDialogContent className="min-w-[600px] p-12">
              <DialogHeader>
                <DialogTitle className="text-center text-3xl font-semibold">
                  Save To New Collection
                </DialogTitle>
              </DialogHeader>

              <DialogDescription></DialogDescription>

              <CollectIconForm onOpenChange={setOpen2ndDialog} image={image} />
            </VisageDialogContent>
          </Dialog>
        </ScrollArea>
      </VisageDialogContent>
    </Dialog>
  );
}
