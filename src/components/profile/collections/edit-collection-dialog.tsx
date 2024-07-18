"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { VisageFormItem } from "@/components/visage/visage-form-item";
import {
  EditCollectionNameFormSchema,
  EditCollectionNameFormSchemaType,
} from "@/schemas/schemas";
import {
  changeCollectionName,
  deleteCollectionName,
} from "@/servers/visage/visage-server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
    console.log(values);
    const { failed, success } = await changeCollectionName(
      collectionId,
      values.collectionName
    );

    if (success) {
      toast.success(success.message);
      router.refresh();
      setDialogOpen(false);
    }
    if (failed) {
      toast.error(failed.message);
    }
  }

  async function handleCollectionNameDelete(collectionNameId: string) {
    const { failed, success } = await deleteCollectionName(collectionNameId);

    if (success) {
      toast.success(success.message);
      setDialogOpen(false);
      router.refresh();
    }
    if (failed) {
      toast.error(failed.message);
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <AiOutlineEdit
          className="h-fit w-fit p-2 border-stone-300 border-2 rounded-full"
          size={25}
        />
      </DialogTrigger>
      <DialogContent className="p-12 min-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-4xl font-medium text-center mt-4 mb-6">
            Edit Collection
          </DialogTitle>
        </DialogHeader>

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
                className="h-14 px-6  font-medium text-base"
                type="submit">
                Change Collection Name
              </Button>
              <Dialog
                open={dialog2Open}
                onOpenChange={setDialog2Open}>
                <DialogTrigger>
                  <Button
                    variant={"destructive"}
                    className="h-14 px-6  font-medium text-base"
                    type="button">
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6">
                  <DialogHeader>
                    <DialogHeader className="text-4xl font-semibold mx-auto mb-6 mt-4">
                      Are You Sure?
                    </DialogHeader>
                  </DialogHeader>
                  <div className="flex gap-x-5 items-center mx-auto">
                    <Button
                      onClick={() => handleCollectionNameDelete(collectionId)}
                      className="h-14 px-6 font-semibold text-base"
                      variant={"destructive"}>
                      Delete Collection
                    </Button>
                    <Button
                      onClick={() => setDialog2Open(false)}
                      className="h-14 px-6 font-semibold text-base"
                      variant={"outline"}>
                      Back
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
