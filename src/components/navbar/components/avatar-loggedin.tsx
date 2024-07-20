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
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";
import { Separator } from "../../ui/separator";
import { SocialLogosSize } from "../constants";
import { AvatarPublicLinks, SocialLogosLinks } from "../links";

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
  userName: string | null | undefined;
};

export function NavbarAvatarLoggedIn(props: NavbarAvatarLoggedInProps) {
  const { profilePicture, userName } = props;

  const [hoverCardOpen, setHoverCardOpen] = useState(false);

  return (
    <HoverCard
      openDelay={100}
      closeDelay={100}
      onOpenChange={setHoverCardOpen}
      open={hoverCardOpen}
    >
      <HoverCardTrigger
        onClick={() => setHoverCardOpen(!hoverCardOpen)}
        className="m-0 cursor-pointer p-0 text-base font-semibold data-[active]:bg-accent/0 data-[state=open]:bg-accent/0 hover:bg-transparent"
      >
        <div className="group flex items-center gap-x-1 text-current">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profilePicture ?? "https://github.com/shadcn.png"}
              alt="profile picture"
            />
            <AvatarFallback className="animate-spin text-lg font-bold text-stone-800 dark:text-stone-300">
              C
            </AvatarFallback>
          </Avatar>{" "}
          <ChevronUp size={15} className="group-hover:rotate-180" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="m-0 mt-2 w-fit p-0">
        <div className="flex flex-col whitespace-nowrap py-2 text-sm font-medium capitalize">
          {components.map((component) => (
            <div key={component.href}>
              <Link
                href={component.href}
                className="flex h-10 cursor-pointer items-center truncate px-6 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {component.title === "Logout" ? (
                  <>
                    <span>{component.title}</span>{" "}
                    <span className="ml-1 text-stone-600 underline">
                      ({userName})
                    </span>
                  </>
                ) : (
                  component.title
                )}
              </Link>
              {component.title === "Logout" && <Separator className="my-3" />}
              {component.title === "Imprint & terms" && (
                <Separator className="my-3" />
              )}
            </div>
          ))}

          {/* social icons */}
          <div className="flex items-center justify-center gap-x-3 px-6">
            {SocialLogosLinks.map((logo) => (
              <div className="cursor-pointer" key={logo.socialLogoName}>
                <logo.socialLogo size={SocialLogosSize} />
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
