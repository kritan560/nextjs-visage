"use client";

import { AugmentImagesImageField } from "@/augment/augment";
import { Button } from "@/components/ui/button";
import { DailyUploadCount } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { LinkHomepage, LinkProfile } from "@/links/links";
import { getCurrentUserId } from "@/servers/authentication/authentication-server";
import {
  createImages,
  getDailyUploadCount,
} from "@/servers/visage/visage-server";
import { Images } from "@prisma/client";
import { average } from "color.js";
import CryptoRandomHex from "crypto-random-hex";
import { Plus } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { FaRegCircleDot } from "react-icons/fa6";
import UploadIcon from "../icons/upload-icon";
import AdjustPadding from "../shared/adjust-padding";
import { ScrollArea } from "../ui/scroll-area";
import UploadedImageData from "./uploaded-image-data";
import nProgress from "nprogress";

let uploadedDataArray: ReturnType<typeof AugmentImagesImageField> = [];

export default function UploadImageContent() {
  const router = useRouter();
  const [uploadedData, setUploadedData] = useState<
    ReturnType<typeof AugmentImagesImageField>
  >([]);
  const [activeImage, setActiveImage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [dailyUploadCountLeft, setDailyUploadCountLeft] =
    useState(DailyUploadCount);

  useEffect(() => {
    startTransition(async () => {
      // this can be server rendered. i left intentionally for client rendered.
      const { failed, success } = await getDailyUploadCount();
      if (success) {
        setDailyUploadCountLeft(DailyUploadCount - success.data);
      }
      if (failed) {
        toast.error(failed.message);
      }
    });
  }, [router]);

  async function handleSuccess(data: any) {
    const { userId, userName } = await getCurrentUserId();
    if (!userId || !userName) {
      return;
    }

    const info = data.info;

    const hex = await average(info.secure_url, {
      format: "hex",
    });

    const randomHex = CryptoRandomHex(12);
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomInt = array[0];

    const upload_data: ReturnType<typeof AugmentImagesImageField>[0] = {
      id: randomHex,
      createdAt: new Date(),
      updatedAt: new Date(),
      imageId: randomHex,
      location: "",
      tags: [],
      title: "",
      userId: userId,
      views: 0,
      image: {
        height: info.height,
        width: info.width,
        userId: userId,
        photographer: userName,
        avg_color: hex.toString(),
        alt: info.original_filename,
        imageId: randomHex,
        photographer_id: userId,
        photographer_url: "",
        url: "",
        src: {
          landscape: info.secure_url,
          large: info.secure_url,
          large2x: info.secure_url,
          medium: info.secure_url,
          original: info.secure_url,
          portrait: info.secure_url,
          small: info.secure_url,
          tiny: info.secure_url,
        },
        id: randomInt,
      },
    };

    uploadedDataArray.push(upload_data);
  }

  function handleClose() {
    setUploadedData([...uploadedDataArray]);
  }

  function handleRemoveImageClick(imageId: Images["id"]) {
    const filteredData = uploadedData.filter((data) => data.id !== imageId);
    setUploadedData(filteredData);
    uploadedDataArray = filteredData;
  }

  async function handleSubmitClick() {
    const { failed, success } = await createImages(uploadedData);
    if (success) {
      toast.success(success.message);
      router.push(LinkProfile);
      nProgress.start();

      setUploadedData([]);
    }
    if (failed) {
      toast.error(failed.message);
    }
  }

  if (uploadedData.length > 0) {
    return (
      <AdjustPadding className="relative mt-16">
        <div className="mx-auto w-[75%]">
          <h1 className="text-center text-3xl font-semibold text-stone-600 dark:text-stone-400">
            Make your photos easy to find and be seen.
          </h1>
          <p className="mx-auto mt-5 w-[82%] text-center text-lg font-medium text-stone-500 dark:text-stone-400">
            The way hashtags make your content discoverable in social media,
            tags will make it easier to find on ImageHive.{" "}
            <span className="font-bold">
              Add some keywords that describe your photo and what is in it.
            </span>
          </p>

          {/* looping this div */}
          {uploadedData.map((data) => (
            // this UploadedData componet is created for sole purpose of using useInView for each image uploaded.
            <UploadedImageData
              key={data.id}
              data={data}
              handleRemoveImageClick={handleRemoveImageClick}
              setActive={setActiveImage}
            />
          ))}
        </div>

        {/* left side image thumbnails */}
        <div className="fixed left-0 top-1/2 w-28 -translate-y-1/2 translate-x-[40%]">
          <div className="h-96">
            <CldUploadWidget
              uploadPreset={"scmoywbv"}
              onSuccess={handleSuccess}
              onClose={handleClose}
              options={{
                multiple: true,
                maxFiles: 5,
                clientAllowedFormats: ["jpg", "png", "jpeg"],
              }}
            >
              {({ open }) => {
                return (
                  <div
                    onClick={() => open()}
                    className="mx-auto flex aspect-square h-20 cursor-pointer items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800"
                  >
                    <Plus
                      size={25}
                      strokeWidth={4}
                      className="text-stone-600 dark:text-stone-400"
                    />
                  </div>
                );
              }}
            </CldUploadWidget>

            {/* loop the image thumbnail here */}
            <ScrollArea type="hover" className="h-[298px]">
              {/* this div is for scrollbar padding */}
              {uploadedData.map((data) => (
                <div
                  id={data.imageId}
                  key={data.imageId}
                  onClick={() => {
                    document.getElementById(data.imageId)?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={cn(
                    "relative mx-auto my-2 aspect-square h-[72px] cursor-pointer rounded-lg border-white",
                    activeImage === data.imageId
                      ? "border-[3px] outline outline-[3px] outline-visage-600"
                      : "outline-none",
                  )}
                >
                  <Image
                    src={data.image.src.original}
                    alt=""
                    fill
                    className="rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        {/* footer content */}
        {/* this is to componsate the fixed div height so the the content won't go beyond the fixed div*/}
        <div className="h-32"></div>
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900">
          <AdjustPadding>
            <div className="flex h-full justify-between py-8">
              <div className="flex items-start gap-x-4 text-visage-600">
                <FaRegCircleDot size={30} className="m-[6px]" />
                <div>
                  <h2 className="text-lg font-semibold">Content uploaded</h2>
                  <p className="font-medium">
                    {uploadedData.length} photos or videos have been uploaded
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSubmitClick}
                type="button"
                className="h-14 px-6"
                variant={"visage"}
              >
                {" "}
                Submit Your Content
              </Button>
            </div>
          </AdjustPadding>
        </div>
      </AdjustPadding>
    );
  }

  return (
    <AdjustPadding className="mt-20">
      <div className="mx-auto w-[60%]">
        <h1 className="text-center text-4xl font-semibold text-stone-700 dark:text-stone-400">
          Share your photos and videos, and let the world love them.
        </h1>
        <p className="mx-auto mt-5 w-[70%] text-center text-lg font-medium text-stone-500 dark:text-stone-300">
          Share your first {DailyUploadCount} photos or videos to introduce
          yourself to millions of ImageHive users.
        </p>
      </div>

      <AdjustPadding className="relative mt-8">
        <div className="relative flex h-[700px] w-full flex-col items-center justify-center gap-y-11 rounded-[2rem] border-2 border-dashed border-stone-300 p-6">
          <span className="absolute right-8 top-4 text-sm font-medium text-stone-400">
            ({DailyUploadCount - dailyUploadCountLeft}/{DailyUploadCount})
          </span>
          <UploadIcon />{" "}
          <h1 className="text-4xl font-bold text-stone-700 dark:text-stone-400">
            Click to upload
          </h1>
          <CldUploadWidget
            uploadPreset={"scmoywbv"}
            onSuccess={handleSuccess}
            onClose={handleClose}
            options={{
              multiple: true,
              maxFiles: 5,
              clientAllowedFormats: ["jpg", "png", "jpeg"],
            }}
          >
            {({ open }) => {
              return (
                <Button
                  onClick={() => open()}
                  className="h-14 px-8"
                  variant={"visage"}
                  type="button"
                  disabled={dailyUploadCountLeft <= 0}
                >
                  Upload
                </Button>
              );
            }}
          </CldUploadWidget>
          <div className="text-base font-medium text-stone-400">
            <p>
              (You have{" "}
              <span className="text-visage-600">
                {isPending ? (
                  <span className="h-4 w-4 animate-pulse font-bold">🟤</span>
                ) : (
                  `${dailyUploadCountLeft}`
                )}
              </span>{" "}
              upload left for the day)
            </p>
          </div>
          <Link href={LinkHomepage}>
            <Button className="h-12 px-8 text-base" variant={"outline"}>
              Skip Upload
            </Button>
          </Link>
          {/* blur part */}
          <div className="absolute -bottom-2 left-0 right-0 h-28 w-full scale-x-105 scale-y-110 bg-white blur-md dark:bg-black"></div>
        </div>
      </AdjustPadding>
    </AdjustPadding>
  );
}
