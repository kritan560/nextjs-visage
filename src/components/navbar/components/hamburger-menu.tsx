import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import NavbarLogoVisage from "./logo-visage";
import ImageSearchVideo2 from "@/components/shared/image-video-search2";
import { cn } from "@/lib/utils";

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
          className={cn(
            hamburgerColor === "white" && "text-white",
            hamburgerColor === "black" && "text-black",
          )}
          size={25}
        />
      </DialogTrigger>
      <DialogContent className="h-full border-none bg-black p-0 text-white sm:max-w-[425px]">
        <div className="flex items-center gap-x-2">
          <NavbarLogoVisage />
          <ImageSearchVideo2 userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HamburgerMenu;
