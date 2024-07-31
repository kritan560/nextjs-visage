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
import { Textarea } from "@/components/ui/textarea";
import { VisageFormItem } from "@/components/visage/visage-form-item";
import { SendEmail } from "@/email/email";
import { cn } from "@/lib/utils";
import {
  EditProfileFormSchema,
  EditProfileFormSchemaType,
} from "@/schemas/editProfileFormSchema";
import { createTokenForUserAccountDeletion } from "@/servers/Account.server";
import { updateUserDetail } from "@/servers/User.server";
import { getBaseURL } from "@/utility/base-url";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type EditProfileFormProps = {
  profileId: string;
  profileData: EditProfileFormSchemaType;
};

export function EditProfileForm(props: EditProfileFormProps) {
  const { profileId, profileData } = props;
  const [shortBioWordCount, setShortBioWordCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);

  async function handleMailSend() {
    if (!profileId) {
      return;
    }

    const createTokenBeforeEmail =
      await createTokenForUserAccountDeletion(profileId);

    if (createTokenBeforeEmail.success) {
      const email = createTokenBeforeEmail.success.data.email;
      const token =
        createTokenBeforeEmail.success.data.userAccountDeletionToken?.token;

      // check to make sure email and token is not null
      if (!email || !token) {
        return;
      }

      await SendEmail(
        email,
        `<p>to delete you account click the following link : ${getBaseURL()}/delete-account/${token}</p>`,
        "About Deleting your account",
      );
    }
  }

  // 1. Define your form.
  const form = useForm<EditProfileFormSchemaType>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      ...profileData,
    },
  });

  const shortBioLength = form.watch("shortBio")?.length;
  useEffect(() => {
    setShortBioWordCount(shortBioLength ?? 0);
  }, [shortBioLength]);

  // 2. Define a submit handler.
  async function onSubmit(values: EditProfileFormSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (profileId) {
      const { failed, success } = await updateUserDetail({
        userId: profileId,
        updatedData: { ...values },
      });

      if (success) {
        VisageToast.success(success.message);
      }
      if (failed) {
        VisageToast.error(failed.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="block items-center gap-x-6 space-y-4 md:flex md:space-y-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="text"
                labelName="First Name"
                requiredCollectionLabel
                showLabel
              />
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="text"
                labelName="Last Name"
                requiredCollectionLabel
                showLabel
              />
            )}
          />
        </div>
        <div className="block items-center gap-x-6 space-y-4 md:flex md:space-y-0">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <VisageFormItem
                disabled
                field={field}
                inputType="email"
                labelName="Email"
                requiredCollectionLabel
                showLabel
              />
            )}
          />
          <FormField
            control={form.control}
            name="publicEmail"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="email"
                labelName="Public Email"
                showLabel
              />
            )}
          />
        </div>

        <Button type="button" variant={"secondary"} className="h-12 px-6">
          Change Password
        </Button>

        <h1 className="pt-8 text-start text-4xl font-semibold">About You</h1>

        <FormField
          control={form.control}
          name="shortBio"
          render={({ field }) => (
            <div className="flex flex-col gap-y-1">
              <Textarea
                placeholder="Tell us a little bit about yourself"
                className="h-40 resize-none text-lg placeholder:text-lg"
                {...field}
              />
              <div className="flex items-center justify-between font-medium text-stone-400">
                <p>Brief Description of your profile</p>
                <p>
                  <span
                    className={cn(
                      shortBioWordCount < 150
                        ? "text-rose-500"
                        : "text-emerald-600",
                      "mr-1",
                    )}
                  >
                    {shortBioWordCount}
                  </span>
                  of 150
                </p>
              </div>
            </div>
          )}
        />

        <div className="block items-center gap-x-6 space-y-4 md:flex md:space-y-0">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="text"
                labelName="Location"
                showLabel
              />
            )}
          />
          <FormField
            control={form.control}
            name="webSite"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="url"
                labelName="Website"
                showLabel
              />
            )}
          />
        </div>

        <div className="block items-center gap-x-6 space-y-4 md:flex md:space-y-0">
          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="url"
                labelName="X"
                showLabel
              />
            )}
          />
          <FormField
            control={form.control}
            name="youTube"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="url"
                labelName="YouTube"
                showLabel
              />
            )}
          />
        </div>

        <div className="block items-center gap-x-6 space-y-4 md:flex md:space-y-0">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="url"
                labelName="Instagram"
                showLabel
              />
            )}
          />
          <FormField
            control={form.control}
            name="tikTok"
            render={({ field }) => (
              <VisageFormItem
                field={field}
                inputType="url"
                labelName="TikTok"
                showLabel
              />
            )}
          />
        </div>

        <div className="pt-8 text-lg">
          <h1 className="my-6 text-center text-4xl font-semibold">
            Additional Settings
          </h1>

          <p>Remove accotextunt and all Data</p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <span className="w-fit cursor-pointer border-b border-dashed border-stone-400 text-stone-600 dark:text-stone-400">
                Remove Account
              </span>
            </DialogTrigger>
            <VisageDialogContent className="w-full p-4 md:min-w-[600px] md:p-12">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-semibold">
                  Request to Close Your Visage Account
                </DialogTitle>
              </DialogHeader>

              <p className="text-justify text-lg">
                Once you delete your account, it can&apos;t be restored. If you
                continue, we will email you a link to confirm your account
                removal.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <Dialog open={dialog2Open} onOpenChange={setDialog2Open}>
                  <DialogTrigger>
                    <Button
                      onClick={handleMailSend}
                      variant={"destructive"}
                      className="h-12 px-6 text-lg font-medium"
                    >
                      Delete My Account
                    </Button>
                  </DialogTrigger>
                  <VisageDialogContent className="min-w-[600px] p-12">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl">
                        Request to close your Visage Account
                      </DialogTitle>
                    </DialogHeader>

                    <p className="mt-6 text-lg">
                      To confirm the deletion of your Visage account, please
                      click on the link sent to{" "}
                      <span className="font-semibold">
                        kritanshrestha560@gmail.com.
                      </span>
                    </p>

                    <p className="mt-6 text-stone-400">
                      If you didn&apos;t receive this email, please{" "}
                      <span
                        onClick={async () => {
                          setDialog2Open(false);
                          setDialogOpen(false);
                          await handleMailSend();
                        }}
                        className="cursor-pointer border-b border-dashed border-stone-400 font-semibold text-stone-800"
                      >
                        click here
                      </span>{" "}
                      to receive it again.
                    </p>
                  </VisageDialogContent>
                </Dialog>
                <Button
                  variant={"outline"}
                  onClick={() => setDialogOpen(false)}
                  className="h-12 px-6 text-lg font-medium"
                >
                  Cancel
                </Button>
              </div>
            </VisageDialogContent>
          </Dialog>
        </div>

        <div className="mx-auto w-fit pt-10">
          <Button
            type="submit"
            variant={"visage"}
            className="h-12 px-6 text-lg"
          >
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
