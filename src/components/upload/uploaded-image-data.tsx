"use client";

import { AugmentImagesImageField } from "@/augment/augment";
import { Form, FormField } from "@/components/ui/form";
import {
  UploadImageFormSchema,
  UploadImageFormSchemaType,
} from "@/schemas/uploadImageFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagsInput } from "@mantine/core";
import { Images } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [value, setValue] = useState<string[]>([]);

  // 1. Define your form.
  const form = useForm<UploadImageFormSchemaType>({
    resolver: zodResolver(UploadImageFormSchema),
    defaultValues: {
      location: "",
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

  useEffect(() => {
    data.title = title;
    data.location = location;
    data.tags = value.map((val) => val.toLowerCase());
  }, [title, value, location, data]);

  return (
    <div
      ref={ref}
      key={data.id}
      id={data.imageId}
      className="relative mt-14 h-fit w-full rounded-3xl bg-stone-100 px-10 py-8 dark:bg-stone-800"
    >
      <div className="flex items-center gap-x-4">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <div className="">
                <TagsInput
                  classNames={{
                    input:
                      "min-h-12 bg-white dark:bg-background text-black dark:text-white text-base border-yellow-500 focus-within:border-slate-500",
                    label: "text-base dark:text-stone-300 text-stone-500",
                    pill: "bg-stone-500 text-white dark:bg-stone-800 dark:text-white",
                  }}
                  label="Tag (Optional)"
                  description="Add up to 3 tags. Press Enter to add Tag"
                  placeholder="Enter tag"
                  maxTags={3}
                  data={[]}
                  value={value}
                  onChange={setValue}
                  clearable
                />
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* delete icon */}
      <div
        onClick={() => handleRemoveImageClick(data.id)}
        className="absolute -right-28 top-1/2 -translate-y-1/2 rounded-full bg-stone-100 p-4 dark:bg-stone-800"
      >
        <MdDelete
          className="cursor-pointer text-stone-400 transition hover:text-stone-500 active:text-stone-400"
          size={45}
        />
      </div>
    </div>
  );
}
