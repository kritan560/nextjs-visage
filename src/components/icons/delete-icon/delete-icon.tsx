"use client";

import VisageDialogContent from "@/components/shared/visage-dialog-content";
import { VisageToast } from "@/components/shared/visage-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  useGlobalAuthUserImagesIdstore,
  useGlobalImagesStore,
} from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { deleteUserUploadedImage } from "@/servers/Upload.server";
import { UniversalImageType } from "@/types/universalImage.type";
import Image from "next/image";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";

type DeleteIconType = {
  imageId: string;
  imageSrc: string;
  nameIncluded?: boolean;
};

const DeleteIcon = (props: DeleteIconType) => {
  const { imageId, imageSrc, nameIncluded = false } = props;
  const [open, setOpen] = useState(false);

  const { authUserImagesIds } = useGlobalAuthUserImagesIdstore();
  const { setGlobalImages, globalImages } = useGlobalImagesStore();

  async function handleDeleteClick() {
    const { failed, success } = await deleteUserUploadedImage(imageId);

    if (success) {
      VisageToast.success(success.message);

      const deletedData = success.data.image as UniversalImageType;

      const filteredImages = globalImages?.filter(
        (image) => image.imageId !== deletedData.imageId,
      );

      if (filteredImages) {
        setGlobalImages(filteredImages);
      }

      setOpen(false);
    }

    if (failed) {
      VisageToast.error(failed.message);
    }
  }

  if (authUserImagesIds?.includes(imageId)) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className={cn(
              !nameIncluded &&
                "cursor-pointer rounded-lg bg-gray-300 p-1 transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-800",
              nameIncluded &&
                "flex h-14 cursor-pointer items-center gap-x-2 rounded-md border px-4 transition hover:border-stone-500 active:border-stone-400",
            )}
          >
            <MdDeleteForever
              fill="rgb(219 39 119)"
              size={24}
              className="m-0 h-fit w-fit p-0"
            />
            <p>{nameIncluded && "Delete"}</p>
          </div>
        </DialogTrigger>
        <VisageDialogContent>
          <div className="flex flex-col items-center justify-center gap-y-6 p-8">
            <h1 className="text-2xl font-semibold dark:text-stone-400">
              Are You Sure You Want To Delete?
            </h1>
            <div className="relative h-52 w-52">
              <Image
                src={imageSrc}
                fill
                style={{ objectFit: "cover" }}
                alt="delete Image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-md"
              />
            </div>
            <p className="text-justify font-mono text-sm font-medium dark:text-stone-400">
              NOTE : This image won&apos;t be removed from collection or hearts
              if you previously saved it in collection or heart.
            </p>
          </div>
          <div className="flex items-center justify-between text-lg">
            <Button
              onClick={() => handleDeleteClick()}
              variant={"destructive"}
              className="h-12 px-6"
            >
              Delete
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant={"outline"}
              className="h-12 px-6"
            >
              Cancel
            </Button>
          </div>
        </VisageDialogContent>
      </Dialog>
    );
  }

  return <></>;
};

export default DeleteIcon;
