import { ModeToggle } from "@/components/mode-toggle";
import ImageSearchVideo2 from "@/components/shared/image-video-search2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  LinkEditProfile,
  LinkHomepage,
  LinkImagePage,
  LinkJoinPage,
  LinkLoginPage,
  LinkLogoutPage,
  LinkProfile,
  LinkUploadPage,
  LinkVideoPage,
} from "@/links/visage-links";
import { Upload, X } from "lucide-react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoYoutube,
} from "react-icons/io";
import NavbarLogoVisage from "./logo-visage";
import { SocialLogosLinks } from "../links";
import { SocialLogosSize } from "../constants";

type HamburgerMenuProps = {
  userId: string | undefined;
  hamburgerColor: "black" | "white";
};

const HamburgerMenu = (props: HamburgerMenuProps) => {
  const { userId, hamburgerColor } = props;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <GiHamburgerMenu
          id="gihamburgerMenuId"
          key="gihamburgerMenuKey"
          size={25}
          className={cn(
            "cursor-pointer md:hidden",
            hamburgerColor === "black" && "text-black dark:text-white",
            hamburgerColor === "white" && "text-white",
          )}
        />
      </DialogTrigger>
      <DialogContent className="block h-screen border-none bg-black/80 p-0 text-white md:hidden">
        <DialogHeader>
          <div className="sticky top-0 z-10 flex w-full items-center justify-center gap-x-5 px-4 pt-4">
            <NavbarLogoVisage />
            <ImageSearchVideo2 key={"imagesearchVideo2"} userId={userId} />
            <Upload strokeWidth={2.5} size={36} />
            <DialogClose>
              <X strokeWidth={2} className="h-8 w-8" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="h-full overflow-y-auto text-[19px] font-bold scrollbar-thin scrollbar-track-transparent scrollbar-thumb-visage-500 scrollbar-thumb-rounded-full">
          <Separator className="my-7" />

          {/* navbar */}
          <div className="mx-4 h-full">
            {/* 1st bundle */}
            <div className="space-y-[15px]">
              <Link className="block" href={LinkHomepage}>
                Home
              </Link>
              <Link className="block" href={LinkImagePage}>
                Discover Photos
              </Link>
              <p>Popular Searches</p>
              <Link className="block" href={LinkVideoPage}>
                Free Videos
              </Link>
              <p>Challenges</p>
              <p>LeaderBoard</p>
              <p>Visage Blog</p>
            </div>
            <Separator className="my-7" />
            {/* 2nd bundle */}
            <div className="space-y-[15px]">
              {userId && (
                <div className="space-y-[15px]">
                  <Link className="block" href={LinkProfile}>
                    Your Profile
                  </Link>
                  <p className="flex items-center gap-x-2">
                    Change Language <span></span>
                  </p>
                  <Link className="block" href={LinkUploadPage}>
                    Upload
                  </Link>
                  <p>Lisence</p>
                  <Link className="block" href={LinkEditProfile}>
                    Settings
                  </Link>
                  <Link className="block" href={LinkLogoutPage}>
                    Logout
                  </Link>
                </div>
              )}
              {!userId && (
                <div className="space-y-[15px]">
                  <Link className="block" href={LinkLoginPage}>
                    Login
                  </Link>
                  <Link className="block" href={LinkJoinPage}>
                    Join
                  </Link>
                  <p className="flex items-center gap-x-2">
                    Change Language <span></span>
                  </p>
                  <p>Lisence</p>
                </div>
              )}
            </div>

            <Separator className="my-7" />

            {/* 3rd bundle */}
            <div className="space-y-[15px]">
              <p>Apps & Plugin</p>
              <p>FAQ</p>
              <p>About Us</p>
              <p>Imprint & Terms</p>
            </div>

            <Separator className="my-7" />

            {/* 4th bundle : logos */}
            <div className="h-24">
              <div className="flex items-center justify-between gap-x-2">
                {SocialLogosLinks.map((link) => (
                  <Link href={link.href} target="_blank" key={link.href}>
                    <link.socialLogo size={30}></link.socialLogo>
                  </Link>
                ))}
                {/* <IoLogoFacebook
                  className="cursor-pointer"
                  strokeWidth={2.5}
                  size={30}
                />
                <IoLogoInstagram
                  className="cursor-pointer"
                  strokeWidth={2.5}
                  size={30}
                />
                <IoLogoTwitter
                  className="cursor-pointer"
                  strokeWidth={2.5}
                  size={30}
                />
                <IoLogoYoutube
                  className="cursor-pointer"
                  strokeWidth={2.5}
                  size={30}
                /> */}
                <ModeToggle />
              </div>
            </div>

            <Separator className="my-7" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HamburgerMenu;
