"use client";

import { AugmentImagesImageField } from "@/augment/augment";
import { Form, FormField } from "@/components/ui/form";
import {
    UploadImageFormSchema,
    UploadImageFormSchemaType,
} from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images } from "@prisma/client";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import { VisageFormItem } from "../visage/visage-form-item";

type UploadedDataProps = {
  data: ReturnType<typeof AugmentImagesImageField>[0];
  handleRemoveImageClick: (id: Images["id"]) => void;
  setActive: (value: string) => void;
};

export default function UploadedImageData(props: UploadedDataProps) {
  const { data, handleRemoveImageClick, setActive } = props;
  const { inView, ref, entry } = useInView({ threshold: 0.95 });

  // 1. Define your form.
  const form = useForm<UploadImageFormSchemaType>({
    resolver: zodResolver(UploadImageFormSchema),
    defaultValues: {
      location: "",
      tags: "",
      title: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: UploadImageFormSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  useEffect(() => {
    if (inView) {
      if (entry?.target.id === data.imageId) {
        setActive(data.imageId);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const title = form.watch("title") ?? "";
  const location = form.watch("location") ?? "";
  const tags = form.watch("tags") ?? "";

  useEffect(() => {
    data.title = title;
    data.location = location;
    data.tags = tags;
  }, [title, tags, location, data]);

  return (
    <div
      ref={ref}
      key={data.id}
      id={data.imageId}
      className="mt-14 bg-stone-100 w-full h-fit rounded-3xl px-10 py-8 relative">
      <div className="flex gap-x-4 items-center">
        <div className="relative w-1/2">
          {/* you can use image.height and width here when you iterate through uploadedData state. */}
          <Image
            src={data.image.src.medium}
            alt=""
            // fill
            height={data.image.height}
            width={data.image.width}
            className="rounded-2xl"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="w-1/2">
          {/* <UploadImageForm /> */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <VisageFormItem
                    field={field}
                    inputPlaceholder="Enter title"
                    inputType="text"
                    labelName="Title (Optional)"
                    showLabel
                  />
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <VisageFormItem
                    field={field}
                    inputPlaceholder="Enter location"
                    inputType="text"
                    labelName="Location (Optional)"
                    showLabel
                  />
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <VisageFormItem
                    field={field}
                    inputPlaceholder="Enter tags"
                    inputType="text"
                    labelName="Tags (Optional)"
                    showLabel
                  />
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      {/* delete icon */}
      <div
        onClick={() => handleRemoveImageClick(data.id)}
        className="absolute -translate-y-1/2 -right-28 top-1/2 bg-stone-100 rounded-full p-4">
        <MdDelete
          className="text-stone-400 hover:text-stone-500 active:text-stone-400 transition cursor-pointer"
          size={45}
        />
      </div>
    </div>
  );
}
