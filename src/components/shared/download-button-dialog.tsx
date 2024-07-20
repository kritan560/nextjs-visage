"use client";

import React, { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Copy, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiPexels } from "react-icons/si";
import CopyToClipboard from "react-copy-to-clipboard";
import { UniversalImageType } from "@/types/visage-type";
import { handleDownloadImageClick } from "@/utility/utils";
import toast from "react-hot-toast";

type DownloadButtonDialogProps = {
  children: React.ReactNode;
  image: UniversalImageType;
};

export default memo(DownloadButtonDialog);
function DownloadButtonDialog(props: DownloadButtonDialogProps) {
  const { children, image } = props;
  const [copy, setCopy] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="z-[60] m-0 flex h-80 gap-0 p-0 sm:max-w-[625px]">
        <DialogTitle></DialogTitle>
        <div className="relative h-full w-[30%]">
          <Image
            src={image.src.large}
            fill
            alt=""
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-l-md"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="w-[70%] px-8 py-6">
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-400">
            Say Thanks!
          </h2>
          <p className="pt-4 font-semibold text-stone-500">
            Show some love to{" "}
            <Link
              href={image.photographer_url}
              className="mr-1 text-stone-900 dark:text-stone-400"
            >
              {image.photographer}
            </Link>
            by giving them follow
          </p>

          {/* follow button */}
          <div className="mt-5 flex items-center gap-x-4">
            <Link target="_blank" href={image.photographer_url}>
              <Button
                variant={"visage"}
                size={"visage"}
                className="px-8 text-lg font-medium"
              >
                View Profile
              </Button>
            </Link>
            <Link target="_blank" href={image.photographer_url}>
              <SiPexels
                size={48}
                className="rounded-md text-emerald-600 hover:text-emerald-600/90 active:text-emerald-600 dark:bg-white"
              />
            </Link>
            <Button
              onClick={() =>
                handleDownloadImageClick(
                  image.src.original,
                  image.alt ?? image.imageId,
                )
              }
              variant={"default"}
              className="h-12"
            >
              <Download />
            </Button>
          </div>

          {/* attribution copy */}
          <CopyToClipboard
            text={`photo by ${image.photographer}`}
            onCopy={() => {
              setCopy(true);
              toast.success("copied to clipboard");
              setTimeout(() => {
                setCopy(false);
              }, 2800);
            }}
          >
            <div className="mt-6 flex h-14 w-full cursor-pointer items-center justify-between rounded-md border px-4">
              <p className="font-medium text-stone-500">
                {copy ? "copied" : `photo by ${image.photographer}`}
              </p>
              <Copy className="text-stone-700 transition hover:text-stone-500 active:text-stone-600" />
            </div>
          </CopyToClipboard>
        </div>
      </DialogContent>
    </Dialog>
  );
}
