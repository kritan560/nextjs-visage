"use client";

import VisageDialogContent from "@/components/shared/visage-dialog-content";
import { VisageToast } from "@/components/shared/visage-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { VisageFormItem } from "@/components/visage/visage-form-item";
import {
  EditCollectionNameFormSchema,
  EditCollectionNameFormSchemaType,
} from "@/schemas/editCollectionNameFormSchema";
import {
  changeCollectionName,
  deleteCollectionName,
} from "@/servers/CollectionName.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEdit } from "react-icons/ai";

type EditCollectionDialogProps = {
  collectionId: string;
  collectionName?: string;
};

export default function EditCollectionDialog(props: EditCollectionDialogProps) {
  const { collectionId, collectionName } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<EditCollectionNameFormSchemaType>({
    resolver: zodResolver(EditCollectionNameFormSchema),
    defaultValues: {
      collectionName,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: EditCollectionNameFormSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { failed, success } = await changeCollectionName(
      collectionId,
      values.collectionName,
    );

    if (success) {
      VisageToast.success(success.message);
      router.refresh();
      setDialogOpen(false);
    }
    if (failed) {
      VisageToast.error(failed.message);
    }
  }

  async function handleCollectionNameDelete(collectionNameId: string) {
    const { failed, success } = await deleteCollectionName(collectionNameId);

    if (success) {
      VisageToast.success(success.message);
      nProgress.start();
      setDialogOpen(false);
      router.refresh();
    }
    if (failed) {
      VisageToast.error(failed.message);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <AiOutlineEdit
          className="h-fit w-fit rounded-full border-2 border-stone-300 p-2"
          size={25}
        />
      </DialogTrigger>
      <VisageDialogContent className="min-w-[600px] p-12">
        <DialogHeader>
          <DialogTitle className="mb-6 mt-4 text-center text-4xl font-medium">
            Edit Collection
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="collectionName"
              render={({ field }) => (
                <VisageFormItem
                  field={field}
                  inputPlaceholder=""
                  inputType="text"
                  labelName="Collection Name"
                  showLabel
                  requiredCollectionLabel
                />
              )}
            />
            <div className="flex items-center gap-x-5">
              <Button
                variant={"visage"}
                className="h-14 px-6 text-base font-medium"
                type="submit"
              >
                Change Collection Name
              </Button>
              <Dialog open={dialog2Open} onOpenChange={setDialog2Open}>
                <DialogTrigger>
                  <Button
                    variant={"destructive"}
                    className="h-14 px-6 text-base font-medium"
                    type="button"
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <VisageDialogContent className="p-6">
                  <DialogHeader>
                    <DialogHeader className="mx-auto mb-6 mt-4 text-4xl font-semibold">
                      Are You Sure?
                    </DialogHeader>
                  </DialogHeader>
                  <div className="mx-auto flex items-center gap-x-5">
                    <Button
                      onClick={() => handleCollectionNameDelete(collectionId)}
                      className="h-14 px-6 text-base font-semibold"
                      variant={"destructive"}
                    >
                      Delete Collection
                    </Button>
                    <Button
                      onClick={() => setDialog2Open(false)}
                      className="h-14 px-6 text-base font-semibold"
                      variant={"outline"}
                    >
                      Back
                    </Button>
                  </div>
                </VisageDialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </VisageDialogContent>
    </Dialog>
  );
}
