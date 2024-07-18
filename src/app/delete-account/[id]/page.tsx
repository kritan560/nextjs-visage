"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LinkEditProfile, LinkHomepage, LinkLoginPage } from "@/links/links";
import { deleteAccountByUserId } from "@/servers/visage/visage-server";
import { deleteAccountByUserIdEnum } from "@/servers/visage/visage-server-enum";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type DeleteAcccountPageProps = {
  params: { id: string };
};

export default function DeleteAcccountPage(props: DeleteAcccountPageProps) {
  const {
    params: { id: token },
  } = props;

  const router = useRouter();

  async function handleAccountDelete() {
    if (!token) {
      return;
    }

    const { failed, success } = await deleteAccountByUserId(token);

    if (success) {
      await signOut({ redirect: true, callbackUrl: LinkLoginPage });
      toast.success(success.message);
      router.push(LinkLoginPage);
    }

    if (failed) {
      toast.error(failed.message);
      if (failed.message === deleteAccountByUserIdEnum.TOKEN_EXPIRED) {
        router.push(LinkEditProfile);
      }
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-semibold text-rose-600">
            ⚠️ Account Deletion
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mt-6 text-lg font-medium">
          <p>This is the last chance to prevent account deletion.</p>
          <p>Are you Sure?</p>
        </div>

        <div className="flex justify-between items-center mt-6 ">
          <Button
            onClick={handleAccountDelete}
            className="capitalize px-6 h-12 text-lg"
            variant={"destructive"}>
            Delete my Account
          </Button>
          <Link href={LinkHomepage}>
            <Button
              className="capitalize px-6 h-12 text-lg"
              variant={"outline"}>
              Cancel
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
