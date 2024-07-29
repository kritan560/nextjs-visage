import ImageSearchVideo2 from "@/components/shared/image-video-search2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  LinkEditProfile,
  LinkHomepage,
  LinkLogoutPage,
  LinkProfile,
  LinkUploadPage,
} from "@/links/visage-links";
import { Upload, X } from "lucide-react";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoYoutube,
} from "react-icons/io5";
import AdjustPadding from "../shared/adjust-padding";
import { Separator } from "../ui/separator";
import { NavbarButton } from "./components/button";
import NavbarLogoVisage from "./components/logo-visage";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import HamburgerMenu from "./components/hamburger-menu";

type NavbarWithoutSearchBoxMobile = {
  userId: string | undefined;
};

const NavbarWithoutSearchBoxMobile = (props: NavbarWithoutSearchBoxMobile) => {
  const { userId } = props;

  return (
    <AdjustPadding className="relative block md:hidden">
      <div className="flex items-center justify-between">
        <NavbarLogoVisage />

        <div className="flex items-center gap-x-2 md:hidden">
          <NavbarButton buttonName="upload" href={LinkUploadPage} />
          <HamburgerMenu hamburgerColor="white" userId={userId} />
        </div>
      </div>
    </AdjustPadding>
  );
};

export default NavbarWithoutSearchBoxMobile;
