import { cn } from "@/lib/utils";
import {
  LinkEditProfile,
  LinkHomepage,
  LinkLogoutPage,
  LinkProfile,
  LinkUploadPage,
} from "@/links/visage-links";
import { Upload, X } from "lucide-react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoYoutube,
} from "react-icons/io5";
import AdjustPadding from "../shared/adjust-padding";
import ImageSearchVideo2 from "../shared/image-video-search2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import NavbarLogoVisage from "./components/logo-visage";
import HamburgerMenu from "./components/hamburger-menu";

type NavbarWithSearchBoxMobile = {
  userId: string | undefined;
};

const NavbarWithSearchBoxMobile = (props: NavbarWithSearchBoxMobile) => {
  const { userId } = props;

  return (
    <AdjustPadding
      className={
        "flex w-full items-center gap-x-2 bg-white dark:bg-stone-800 dark:text-stone-50 md:hidden"
      }
    >
      <NavbarLogoVisage />

      <div className="flex-1">
        <ImageSearchVideo2 userId={userId} />
      </div>

      <Link href={LinkUploadPage}>
        <Upload />
      </Link>

      <HamburgerMenu hamburgerColor="black" userId={userId} />
    </AdjustPadding>
  );
};

export default NavbarWithSearchBoxMobile;
