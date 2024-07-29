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

          <Dialog>
            <DialogTrigger asChild>
              <GiHamburgerMenu
                className={cn("cursor-pointer bg-white md:hidden")}
              />
            </DialogTrigger>
            <DialogContent className="z-[100] h-full border-none bg-black p-0 text-white sm:max-w-[425px]">
              <DialogHeader>
                <div className="sticky top-0 flex w-full items-center justify-center gap-x-5 px-4 pt-4">
                  <NavbarLogoVisage />
                  <ImageSearchVideo2 userId={userId} />
                  <Upload strokeWidth={2.5} size={36} />
                  <DialogClose>
                    <X strokeWidth={2} className="h-8 w-8" />
                  </DialogClose>
                </div>
              </DialogHeader>

              <ScrollArea className="text-[19px] font-bold">
                <Separator className="mb-7" />
                {/* navbar */}
                <div className="mx-4">
                  {/* 1st bundle */}
                  <div className="space-y-[15px]">
                    <Link href={LinkHomepage}>Home</Link>
                    <p>Discover Photos</p>
                    <p>Popular Searches</p>
                    <p>Free Videos</p>
                    <p>Challenges</p>
                    <p>LeaderBoard</p>
                    <p>Pexels Blog</p>
                  </div>

                  <Separator className="my-7" />
                  {/* 2nd bundle */}
                  <div className="space-y-[15px]">
                    <Link href={LinkProfile}>Your Profile</Link>
                    <p className="flex items-center gap-x-2">
                      Change Language <span></span>
                    </p>
                    <Link href={LinkUploadPage}>Upload</Link>
                    <p>Lisence</p>
                    <Link href={LinkEditProfile}>Settings</Link>
                    <Link href={LinkLogoutPage}>Logout</Link>
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

                  {/* 4th bungle */}
                  {/* logoss... */}
                  <div className="mb-8 mt-8 flex items-center justify-center gap-x-10">
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
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdjustPadding>
  );
};

export default NavbarWithoutSearchBoxMobile;
