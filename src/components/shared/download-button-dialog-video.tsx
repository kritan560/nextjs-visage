"use client";

import { UniversalVideoType } from "@/types/visage-type";
import { handleDownloadMediaClick } from "@/utility/utils";
import { Copy, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { memo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { SiPexels } from "react-icons/si";
import { Button } from "../ui/button";
import { Dialog, DialogTitle, DialogTrigger } from "../ui/dialog";
import VisageDialogContent from "./visage-dialog-content";
import { VisageToast } from "./visage-toast";

type DownloadButtonDialogVideoProps = {
  children: React.ReactNode;
  image: string;
  link: string;
  userName: string;
  userURL: string;
};

export default memo(DownloadButtonDialogVideo);
function DownloadButtonDialogVideo(props: DownloadButtonDialogVideoProps) {
  const { children, link, image, userName, userURL } = props;
  const [copy, setCopy] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <VisageDialogContent className="z-[60] m-0 flex h-80 gap-0 p-0 sm:max-w-[625px]">
        <DialogTitle></DialogTitle>
        <div className="relative h-full w-[30%]">
          <Image
            src={image}
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
              href={userURL}
              className="mr-1 text-stone-900 dark:text-stone-400"
            >
              {userName}
            </Link>
            by giving them follow
          </p>

          {/* follow button */}
          <div className="mt-5 flex items-center gap-x-4">
            <Link target="_blank" href={userURL}>
              <Button
                variant={"visage"}
                size={"visage"}
                className="px-8 text-lg font-medium"
              >
                View Profile
              </Button>
            </Link>
            <Link target="_blank" href={userURL}>
              <SiPexels
                size={48}
                className="rounded-md text-emerald-600 hover:text-emerald-600/90 active:text-emerald-600 dark:bg-white"
              />
            </Link>
            <Button
              onClick={() =>
                handleDownloadMediaClick(link ?? "", userName, "Video")
              }
              variant={"default"}
              className="h-12"
            >
              <Download />
            </Button>
          </div>

          {/* attribution copy */}
          <CopyToClipboard
            text={`photo by ${userName}`}
            onCopy={() => {
              setCopy(true);
              VisageToast.success("copied to clipboard");
              setTimeout(() => {
                setCopy(false);
              }, 2800);
            }}
          >
            <div className="mt-6 flex h-14 w-full cursor-pointer items-center justify-between rounded-md border px-4">
              <p className="font-medium text-stone-500">
                {copy ? "copied" : `photo by ${userName}`}
              </p>
              <Copy className="text-stone-700 transition hover:text-stone-500 active:text-stone-600" />
            </div>
          </CopyToClipboard>
        </div>
      </VisageDialogContent>
    </Dialog>
  );
}
