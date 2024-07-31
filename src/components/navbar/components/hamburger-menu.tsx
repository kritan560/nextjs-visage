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
  LinkJoinPage,
  LinkLoginPage,
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
} from "react-icons/io";
import NavbarLogoVisage from "./logo-visage";
import { ModeToggle } from "@/components/mode-toggle";

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
      <DialogContent className="h-full w-full border-none bg-black/80 p-0 text-white">
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

        <div className="h-full overflow-y-scroll text-[19px] font-bold scrollbar-thin scrollbar-track-transparent scrollbar-thumb-visage-500 scrollbar-track-rounded-full">
          <Separator className="mb-7" />
          {/* navbar */}
          <div className="mx-4">
            {/* 1st bundle */}
            <div className="space-y-[15px]">
              <Link className="block" href={LinkHomepage}>
                Home
              </Link>
              <p>Discover Photos</p>
              <p>Popular Searches</p>
              <p>Free Videos</p>
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
            <div className="mb-4 flex items-center justify-between gap-x-2">
              <IoLogoFacebook
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
              />
              <ModeToggle />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HamburgerMenu;
