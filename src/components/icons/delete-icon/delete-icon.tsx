"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGlobalAuthUserImagesIdstore } from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import { deleteUserUploadedImage } from "@/servers/visage/visage-server";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
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

  async function handleDeleteClick() {
    const { failed, success } = await deleteUserUploadedImage(imageId);

    if (success) {
      toast.success(success.message);
      setOpen(false);
    }

    if (failed) {
      toast.error(failed.message);
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
              fill="rgb(225 29 72)"
              size={24}
              className="m-0 h-fit w-fit p-0"
            />
            <p>{nameIncluded && "Delete"}</p>
          </div>
        </DialogTrigger>
        <DialogContent>
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
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default DeleteIcon;
