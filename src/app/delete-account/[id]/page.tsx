"use client";

import VisageDialogContent from "@/components/shared/visage-dialog-content";
import { VisageToast } from "@/components/shared/visage-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LinkEditProfile, LinkHomepage, LinkLoginPage } from "@/links/links";
import { deleteAccountByUserId } from "@/servers/visage/visage-server";
import { DeleteAccountByUserIdEnum } from "@/servers/visage/visage-server-enum";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

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
      VisageToast.success(success.message);
      router.push(LinkLoginPage);
      nProgress.start();
    }

    if (failed) {
      VisageToast.error(failed.message);

      if (failed.message === DeleteAccountByUserIdEnum.TOKEN_EXPIRED) {
        router.push(LinkEditProfile);
        nProgress.start();
      }
    }
  }

  return (
    <Dialog open={true}>
      <VisageDialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-semibold text-rose-600">
            ⚠️ Account Deletion
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 text-center text-lg font-medium">
          <p>This is the last chance to prevent account deletion.</p>
          <p>Are you Sure?</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            onClick={handleAccountDelete}
            className="h-12 px-6 text-lg capitalize"
            variant={"destructive"}
          >
            Delete my Account
          </Button>
          <Link href={LinkHomepage}>
            <Button
              className="h-12 px-6 text-lg capitalize"
              variant={"outline"}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </VisageDialogContent>
    </Dialog>
  );
}
