"use client";

import {
    LinkCollections,
    LinkEditProfile,
    LinkLogoutPage,
    LinkProfile,
} from "@/links/links";
import { ChevronUp } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";
import { SocialLogosSize } from "./constants";
import { AvatarPublicLinks, SocialLogosLinks } from "./links";

const components: { title: string; href: string }[] = [
  {
    title: "Your Profile",
    href: LinkProfile,
  },
  {
    title: "Your Collections",
    href: LinkCollections,
  },
  {
    title: "Settings",
    href: LinkEditProfile,
  },
  {
    title: "Change Language",
    href: "/docs/primitives/scroll-area",
  },
  {
    title: "Logout",
    href: LinkLogoutPage,
  },
  ...AvatarPublicLinks,
];

type NavbarAvatarLoggedInProps = {
  profilePicture: User["image"];
};

export function NavbarAvatarLoggedIn(props: NavbarAvatarLoggedInProps) {
  const { profilePicture } = props;

  const [hoverCardOpen, setHoverCardOpen] = useState(false);

  return (
    <HoverCard
      openDelay={100}
      closeDelay={100}
      onOpenChange={setHoverCardOpen}
      open={hoverCardOpen}>
      <HoverCardTrigger
        onClick={() => setHoverCardOpen(!hoverCardOpen)}
        className="text-base font-semibold m-0 p-0 data-[active]:bg-accent/0 data-[state=open]:bg-accent/0 hover:bg-transparent cursor-pointer">
        <div className="flex gap-x-1 items-center group text-current">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profilePicture ?? "https://github.com/shadcn.png"}
              alt="profile picture"
            />
            <AvatarFallback className="animate-spin text-lg font-bold text-stone-800">
              C
            </AvatarFallback>
          </Avatar>{" "}
          <ChevronUp
            size={15}
            className="group-hover:rotate-180"
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 m-0 w-fit mt-2">
        <div className="flex flex-col capitalize py-2 text-sm font-medium whitespace-nowrap">
          {components.map((component) => (
            <div key={component.href}>
              <Link
                href={component.href}
                className="h-10 px-6 hover:bg-stone-100 flex items-center cursor-pointer ">
                {component.title}
              </Link>
              {component.title === "Logout" && <Separator className="my-3" />}
              {component.title === "Imprint & terms" && (
                <Separator className="my-3" />
              )}
            </div>
          ))}

          {/* social icons */}
          <div className="flex items-center gap-x-3 px-6 justify-center">
            {SocialLogosLinks.map((logo) => (
              <div
                className="cursor-pointer"
                key={logo.socialLogoName}>
                <logo.socialLogo size={SocialLogosSize} />
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
