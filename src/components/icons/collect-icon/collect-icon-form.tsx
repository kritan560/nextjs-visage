"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  useGlobalCollectImageIdsStore,
  useGlobalCollectionNameStore,
} from "@/global-states/visage-image-state";
import { LinkLoginPage } from "@/links/links";
import {
  NewCollectionNameFormSchema,
  NewCollectionNameFormSchemaType,
} from "@/schemas/schemas";
import { collectImage } from "@/servers/visage/visage-server";
import { collectImageEnum } from "@/servers/visage/visage-server-enum";
import { UniversalImageType, UniversalImagesType } from "@/types/visage-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { VisageFormItem } from "../../visage/visage-form-item";

type CollectIconForm = {
  image: UniversalImageType;
  onOpenChange: (value: boolean) => void;
};

export function CollectIconForm(props: CollectIconForm) {
  const { image, onOpenChange } = props;

  const { globalCollectionNames, setGlobalCollectionNames } =
    useGlobalCollectionNameStore();
  const { globalCollectImagesIds, setGlobalCollectImageId } =
    useGlobalCollectImageIdsStore();
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
    const { failed, success } = await collectImage(
      values.collectionName,
      image
    );

    if (success) {
      toast.success(success.message);

      if (success.message === collectImageEnum.NEW_COLLECTION_CREATED) {
        if (globalCollectionNames && globalCollectImagesIds) {
          const collectionNames = [success.data, ...globalCollectionNames].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );

          setGlobalCollectionNames(collectionNames);

          const newImageId = (
            success.data.collectionImages as UniversalImagesType
          ).map((data) => data.imageId);
          setGlobalCollectImageId([...globalCollectImagesIds, ...newImageId]);
        }

        onOpenChange(false);
      }
    }
    if (failed) {
      toast.error(failed.message);
      if (failed.message === collectImageEnum.USER_NOT_LOGGED_IN) {
        router.push(LinkLoginPage);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
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
        <div className="flex gap-x-4 items-center w-[80%] mx-auto">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full h-14"
            type="button"
            variant={"outline"}>
            Back
          </Button>
          <Button
            className="w-[150%] h-14"
            type="submit"
            variant={"visage"}>
            Create New Collection
          </Button>
        </div>
      </form>
    </Form>
  );
}
