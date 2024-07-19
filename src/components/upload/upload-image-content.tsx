"use client";

import { AugmentImagesImageField } from "@/augment/augment";
import { Button } from "@/components/ui/button";
import { DailyUploadCount } from "@/constants/constants";
import uploadIcon from "@/images/upload-icon.png";
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
import AdjustPadding from "../shared/adjust-padding";
import { ScrollArea } from "../ui/scroll-area";
import UploadedImageData from "./uploaded-image-data";

let uploadedDataArray: ReturnType<typeof AugmentImagesImageField> = [];

export default function UploadImageContent() {
  const router = useRouter();
  //   const [uploadedData, setUploadedData] = useState<Images[]>([]);
  const [uploadedData, setUploadedData] = useState<
    ReturnType<typeof AugmentImagesImageField>
  >([]);
  const [activeImage, setActiveImage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [dailyUploadCountLeft, setDailyUploadCountLeft] =
    useState(DailyUploadCount);
  const [isDataUploaded, setIsDataUploaded] = useState(uploadedData.length > 0);

  useEffect(() => {
    if (uploadedData.length > 0) {
      setIsDataUploaded(true);
    }
  }, [uploadedData.length]);

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
      tags: "",
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
      setUploadedData([]);
    }
    if (failed) {
      toast.error(failed.message);
    }
  }

  if (isDataUploaded) {
    return (
      <AdjustPadding className="mt-16 relative">
        <div className="w-[75%] mx-auto">
          <h1 className="text-center font-semibold text-3xl text-stone-600">
            Make your photos easy to find and be seen.
          </h1>
          <p className="mt-5 text-lg font-medium text-center w-[82%] mx-auto text-stone-500">
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
        <div className="fixed left-0 translate-x-[70%] top-1/2 -translate-y-1/2">
          <div className="h-96">
            <CldUploadWidget
              uploadPreset={"scmoywbv"}
              onSuccess={handleSuccess}
              onClose={handleClose}
              options={{
                multiple: true,
                maxFiles: dailyUploadCountLeft > 5 ? 5 : dailyUploadCountLeft,
                clientAllowedFormats: ["jpg", "png", "jpeg"],
              }}>
              {({ open }) => {
                return (
                  <div
                    onClick={() => open()}
                    className="flex justify-center items-center rounded-lg bg-stone-100 h-20 aspect-square cursor-pointer">
                    <Plus
                      size={25}
                      strokeWidth={4}
                      className="text-stone-600"
                    />
                  </div>
                );
              }}
            </CldUploadWidget>

            {/* loop the image thumbnail here */}
            <ScrollArea
              type="hover"
              className="h-[298px]">
              <div className="pr-2">
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
                      "aspect-square h-20 rounded-lg relative border-white my-2",
                      activeImage === data.imageId
                        ? "outline-[3px] outline-visage-600 outline border-[3px]"
                        : "outline-none"
                    )}>
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
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* footer content */}
        {/* this is to componsate the fixed div height so the the content won't go beyond the fixed div*/}
        <div className="h-32"></div>
        <div className="fixed bottom-0 bg-white left-0 right-0">
          <AdjustPadding>
            <div className="flex justify-between py-8 h-full">
              <div className="flex gap-x-4 items-start text-visage-600">
                <FaRegCircleDot
                  size={30}
                  className="m-[6px]"
                />
                <div>
                  <h2 className="font-semibold text-lg">Content uploaded</h2>
                  <p className="font-medium">
                    {uploadedData.length} photos or videos have been uploaded
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSubmitClick}
                type="button"
                className="h-14 px-6"
                variant={"visage"}>
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
      <div className="w-[60%] mx-auto">
        <h1 className="text-4xl font-semibold text-center text-stone-700">
          Share your photos and videos, and let the world love them.
        </h1>
        <p className="mt-5 text-lg w-[70%] text-center mx-auto font-medium text-stone-500">
          Share your first {DailyUploadCount} photos or videos to introduce
          yourself to millions of ImageHive users.
        </p>
      </div>

      <AdjustPadding className="relative">
        <div className="h-[700px] mt-8 w-full border-2 border-dashed border-stone-300 rounded-[2rem] flex flex-col justify-center items-center space-y-12 p-6 relative">
          <span className="absolute top-4 right-8 text-stone-400 text-sm font-medium">
            ({DailyUploadCount - dailyUploadCountLeft}/{DailyUploadCount})
          </span>
          <Image
            src={uploadIcon}
            alt="upload icon"
          />
          <h1 className="text-4xl font-bold text-stone-700">Click to upload</h1>

          <CldUploadWidget
            uploadPreset={"scmoywbv"}
            onSuccess={handleSuccess}
            onClose={handleClose}
            options={{
              multiple: true,
              maxFiles: dailyUploadCountLeft > 5 ? 5 : dailyUploadCountLeft,
              // maxFiles: 2,
              clientAllowedFormats: ["jpg", "png", "jpeg"],
            }}>
            {({ open }) => {
              return (
                <Button
                  onClick={() => open()}
                  className="h-14 px-8"
                  variant={"visage"}
                  type="button"
                  disabled={dailyUploadCountLeft <= 0}>
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
                  <span className="font-bold animate-pulse h-4 w-4">🟤</span>
                ) : (
                  `${dailyUploadCountLeft}`
                )}
              </span>{" "}
              upload left for the day)
            </p>
          </div>

          <Link href={LinkHomepage}>
            <Button
              className="h-12 px-8 text-base"
              variant={"outline"}>
              Skip Upload
            </Button>
          </Link>

          {/* blur part */}
          <div className="h-28 w-full absolute blur-xl bottom-0 left-0 right-0 bg-white"></div>
        </div>
      </AdjustPadding>
    </AdjustPadding>
  );
}
