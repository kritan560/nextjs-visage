"use client";

import { VisageToast } from "@/components/shared/visage-toast";
import { Button } from "@/components/ui/button";
import { updateUserProfilePicture } from "@/servers/User.server";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type EditProfileChangeImageProps = {
  profilePicture: string | null | undefined;
  userId: string;
};

export default function EditProfileChangeImage(
  props: EditProfileChangeImageProps,
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
        secure_url,
      );
      if (success) {
        VisageToast.success(success.message);
        setUserProfilePicture(success.data.image);
        router.refresh();
      }

      if (failed) {
        VisageToast.error(failed.message);
      }
    });
  }

  return (
    <div className="flex items-center gap-x-12">
      <Image
        src={userProfilePicture ?? ""}
        alt=""
        width={120}
        height={120}
        className="rounded-full"
      />
      <CldUploadWidget uploadPreset={"scmoywbv"} onSuccess={handleSuccess}>
        {({ open }) => {
          return (
            <Button
              onClick={() => open()}
              className="h-14 px-6"
              variant={"visage"}
              type="button"
            >
              Change Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
