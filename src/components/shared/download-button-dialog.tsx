"use client";

import React, { memo, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
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
      <DialogContent className="sm:max-w-[625px] z-[60] gap-0 h-80 flex p-0 m-0">
        <DialogTitle></DialogTitle>
        <div className="h-full w-[30%] relative">
          <Image
            src={image.src.large}
            fill
            alt=""
            className="rounded-l-md"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="px-8 py-6 w-[70%]">
          <h2 className="font-semibold text-2xl text-stone-800">Say Thanks!</h2>
          <p className="pt-4 font-semibold text-stone-500">
            Show some love to{" "}
            <Link
              href={image.photographer_url}
              className="text-stone-900 mr-1">
              {image.photographer}
            </Link>
            by giving them follow
          </p>

          {/* follow button */}
          <div className="flex items-center gap-x-4 mt-5">
            <Link
              target="_blank"
              href={image.photographer_url}>
              <Button
                variant={"visage"}
                size={"visage"}
                className=" px-8 text-lg font-medium">
                View Profile
              </Button>
            </Link>
            <Link
              target="_blank"
              href={image.photographer_url}>
              <SiPexels
                size={48}
                className="rounded-md text-emerald-600 hover:text-emerald-600/90 active:text-emerald-600"
              />
            </Link>
            <Button
              onClick={() =>
                handleDownloadImageClick(
                  image.src.original,
                  image.alt ?? String(image.id)
                )
              }
              variant={"default"}
              className="h-12">
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
            }}>
            <div className="mt-6 border rounded-md w-full h-14 flex justify-between items-center px-4 cursor-pointer">
              <p className="text-stone-500 font-medium">
                {copy ? "copied" : `photo by ${image.photographer}`}
              </p>
              <Copy className="hover:text-stone-500 text-stone-700 transition active:text-stone-600" />
            </div>
          </CopyToClipboard>
        </div>
      </DialogContent>
    </Dialog>
  );
}
