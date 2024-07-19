"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGlobalCollectImageIdsStore,
  useGlobalCollectionNameStore,
} from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { LinkCollections, LinkLoginPage } from "@/links/links";
import { collectImage } from "@/servers/visage/visage-server";
import { collectImageEnum } from "@/servers/visage/visage-server-enum";
import { UniversalImageType, UniversalImagesType } from "@/types/visage-type";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoBookmarksOutline, IoBookmarksSharp } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import { CollectIconForm } from "./collect-icon-form";

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

  console.log(globalCollectImagesIds, '<<<')
  async function handleAddToCollection(
    collectionName: string,
    collectionNameId?: string
  ) {
    const { failed, success } = await collectImage(
      collectionName,
      image,
      collectionNameId
    );

    if (success) {
      toast.success(success.message);

      // console.log(success.data, "<<<<");
      const successDataCollectionNameId = success.data.id;

      const updatedDataCollectionName = globalCollectionNames?.filter(
        (data) => data.id !== successDataCollectionNameId
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
            updatedCollectionImageIds.push(data.imageId)
          )
        );

        setGlobalCollectImageId(updatedCollectionImageIds);
      }
    }

    if (failed) {
      toast.error(failed.message);
      if (failed.message === collectImageEnum.USER_NOT_LOGGED_IN) {
        router.push(LinkLoginPage);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            nameIncluded &&
              "flex gap-x-2 items-center border rounded-md h-14 px-4 cursor-pointer transition hover:border-stone-500 active:border-stone-400",
            !nameIncluded &&
              "bg-gray-300 p-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 cursor-pointer transition duration-200",
            ""
          )}>
          {globalCollectImagesIds?.includes(image.imageId) ? (
            <>
              <IoBookmarksSharp fill="rgb(197 129 50)" />
              <p>{nameIncluded && "Collect"}</p>
            </>
          ) : (
            <>
              <IoBookmarksOutline />
              <p>{nameIncluded && "Collect"}</p>
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[650px] h-[500px] p-8">
        <ScrollArea
          type="auto"
          className="h-[434px] w-full">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold text-3xl flex flex-col gap-y-4">
              <span>Save to Collection</span>
              <Link
                href={LinkCollections}
                className="border-b border-dashed text-base font-medium text-stone-500 w-fit mx-auto border-stone-400 cursor-pointer hover:scale-105 transition active:scale-100 mb-4">
                All Collection
              </Link>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          {/* 2nd dialog */}
          <Dialog
            open={open2ndDialog}
            onOpenChange={setOpen2ndDialog}>
            <div className="grid grid-cols-3 gap-3 justify-items-center">
              <DialogTrigger asChild>
                {/* create new collection */}
                <div className="flex flex-col w-fit">
                  <div className="w-40 rounded-md bg-stone-200 aspect-square flex justify-center items-center cursor-pointer hover:scale-105 transition group">
                    <CirclePlus
                      size={45}
                      className="group-hover:scale-110 transition text-stone-600"
                    />
                  </div>
                  <p className="w-40 mt-1 truncate text-center">
                    Create new Collection
                  </p>
                </div>
              </DialogTrigger>

              {globalCollectionNames?.map((collectionName) => (
                <div
                  key={collectionName.id}
                  className="flex flex-col w-fit">
                  <div
                    onClick={() =>
                      handleAddToCollection(
                        collectionName.collectionName,
                        collectionName.id
                      )
                    }
                    className="w-40 rounded-md bg-stone-200 aspect-square cursor-pointer relative flex justify-center items-center hover:scale-105 active:scale-100 transition">
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
                        <div className="absolute bg-emerald-600/80 rounded-md w-40 h-40 flex justify-center items-center hover:bg-rose-600/80 group">
                          <FaCheckCircle
                            size={45}
                            className="group-hover:hidden text-stone-50"
                          />
                          <IoMdCloseCircleOutline
                            size={45}
                            className="group-hover:block hidden text-stone-50"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="h-40 w-40 justify-center flex items-center hover:bg-black/75 rounded-md relative group transition">
                        <LuImagePlus
                          size={45}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-40 text-stone-600"
                        />{" "}
                        <CirclePlus
                          strokeWidth={"2px"}
                          size={45}
                          className="group-hover:block hidden text-white z-[1]"
                        />
                      </div>
                    )}
                  </div>
                  <p className="w-40 mt-1 capitalize truncate text-center">
                    {collectionName.collectionName}
                  </p>
                </div>
              ))}
            </div>

            <DialogContent className="p-12 min-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-center text-3xl font-semibold">
                  Save To New Collection
                </DialogTitle>
              </DialogHeader>

              <DialogDescription></DialogDescription>

              <CollectIconForm
                onOpenChange={setOpen2ndDialog}
                image={image}
              />
            </DialogContent>
          </Dialog>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
