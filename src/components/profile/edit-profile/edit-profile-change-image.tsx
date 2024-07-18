"use client";

import { updateUserProfilePicture } from "@/servers/visage/visage-server";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type EditProfileChangeImageProps = {
  profilePicture: string | null | undefined;
  userId: string;
};

export default function EditProfileChangeImage(
  props: EditProfileChangeImageProps
) {
  const { profilePicture, userId } = props;
  const [isPending, startTransition] = useTransition();
  const [userProfilePicture, setUserProfilePicture] = useState(profilePicture);
  const router = useRouter();

  function handleSuccess(data: any) {
    const secure_url = data.info.secure_url;

    startTransition(async () => {
      const { failed, success } = await updateUserProfilePicture(
        userId,
        secure_url
      );
      if (success) {
        toast.success(success.message);
        setUserProfilePicture(success.data.image);
        router.refresh();
      }

      if (failed) {
        toast.error(failed.message);
      }
    });
  }

  return (
    <div className="flex gap-x-12 items-center">
      <Image
        src={userProfilePicture ?? ""}
        alt=""
        width={120}
        height={120}
        className="rounded-full"
      />
      <CldUploadWidget
        uploadPreset={"scmoywbv"}
        onSuccess={handleSuccess}>
        {({ open }) => {
          return (
            <Button
              onClick={() => open()}
              className="h-14 px-6"
              variant={"visage"}
              type="button">
              Change Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
