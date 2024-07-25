"use client";

import { VisageToast } from "@/components/shared/visage-toast";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  useGlobalCollectImageIdsStore,
  useGlobalCollectionNameStore,
} from "@/global-states/visage-image-state";
import { useGlobalCollectVideosIds } from "@/global-states/visage-video-state";
import { LinkLoginPage } from "@/links/links";
import {
  NewCollectionNameFormSchema,
  NewCollectionNameFormSchemaType,
} from "@/schemas/schemas";
import { AuthFailedEnum } from "@/servers/authentication/authentication-server-enums";
import { collectVideo } from "@/servers/visage/visage-server";
import { CollectVideoEnum } from "@/servers/visage/visage-server-enum";
import { UniversalVideoType, UniversalVideosType } from "@/types/visage-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useForm } from "react-hook-form";
import { VisageFormItem } from "../../visage/visage-form-item";

type CollectIconFormVideo = {
  video: UniversalVideoType;
  onOpenChange: (value: boolean) => void;
};

export function CollectIconFormVideo(props: CollectIconFormVideo) {
  const { video, onOpenChange } = props;

  const { globalCollectionNames, setGlobalCollectionNames } =
    useGlobalCollectionNameStore();
  const { globalCollectImagesIds, setGlobalCollectImageId } =
    useGlobalCollectImageIdsStore();
  const {
    setVideosIds: setGlobalCollectVideosIds,
    videosIds: globalCollectVideosIds,
  } = useGlobalCollectVideosIds();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<NewCollectionNameFormSchemaType>({
    resolver: zodResolver(NewCollectionNameFormSchema),
    defaultValues: {
      collectionName: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: NewCollectionNameFormSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { failed, success } = await collectVideo(
      values.collectionName,
      video,
    );

    if (success) {
      VisageToast.success(success.message);

      if (success.message === CollectVideoEnum.NEW_COLLECTION_CREATED) {
        if (globalCollectionNames && globalCollectVideosIds) {
          const collectionNames = [success.data, ...globalCollectionNames].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );

          setGlobalCollectionNames(collectionNames);

          const newImageId = (
            success.data.collectionVideos as UniversalVideosType["videos"]
          ).map((data) => data.videoId);
          setGlobalCollectVideosIds([...globalCollectVideosIds, ...newImageId]);
        }

        onOpenChange(false);
      }
    }
    if (failed) {
      VisageToast.error(failed.message);
      if (failed.message === AuthFailedEnum.USER_NOT_LOGGED_IN) {
        router.push(LinkLoginPage);
        nProgress.start();
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="collectionName"
          render={({ field }) => (
            <VisageFormItem
              field={field}
              inputPlaceholder="Enter Collection Name"
              inputType="text"
              labelName="Collection Name"
              showLabel
              requiredCollectionLabel
            />
          )}
        />
        <div className="mx-auto flex w-[80%] items-center gap-x-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="h-14 w-full"
            type="button"
            variant={"outline"}
          >
            Back
          </Button>
          <Button className="h-14 w-[150%]" type="submit" variant={"visage"}>
            Create New Collection
          </Button>
        </div>
      </form>
    </Form>
  );
}
