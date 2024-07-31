"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { useState } from "react";
import { GiUsaFlag } from "react-icons/gi";
import { HiDotsHorizontal } from "react-icons/hi";
import { Separator } from "../../ui/separator";
import { SocialLogosSize } from "../constants";
import { SocialLogosLinks } from "../links";

const hoverContents = [
  { seperator: false, title: "Login", href: "/login" },
  { seperator: false, title: "Join", href: "/join" },
  {
    seperator: true,
    title: (
      <div className="flex items-center gap-x-2 text-stone-800 dark:text-stone-200">
        Change Language <GiUsaFlag size={18} />{" "}
      </div>
    ),
    href: "/changelanguage",
  },
  { seperator: false, title: "Image & Video API", href: "/imageandvideoapi" },
  { seperator: false, title: "Apps & Plugins", href: "/appsandplugins" },
  { seperator: false, title: "FAQ", href: "/faq" },
  { seperator: false, title: "Report Content", href: "/report content" },
  { seperator: false, title: "Partnerships", href: "/partnerships" },
  { seperator: true, title: "Imprint & Terms", href: "/imprintsandterms" },
];

export function NavbarThreeDotsHorizontal() {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard
      openDelay={150}
      closeDelay={250}
      open={open}
      onOpenChange={setOpen}
    >
      <HoverCardTrigger asChild>
        <Button
          onClick={() => setOpen(!open)}
          variant="link"
          className="px-0 text-inherit"
        >
          <HiDotsHorizontal size={20} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit px-0 py-2 text-stone-700/80 dark:text-stone-300">
        {hoverContents.map((content) => (
          <div key={content.href}>
            <Link
              className="block cursor-pointer whitespace-nowrap px-6 py-2 text-sm font-semibold capitalize hover:bg-stone-100 dark:hover:bg-stone-800"
              key={content.href}
              href={content.href}
            >
              {content.title}
            </Link>
            {content.seperator && <Separator className="my-2" />}
          </div>
        ))}

        <div className="flex items-center gap-x-4 px-6 py-2">
          {SocialLogosLinks.map((logo) => (
            <Link
              target="_blank"
              className="cursor-pointer rounded-md hover:bg-stone-100"
              key={logo.href}
              href={logo.href}
            >
              <logo.socialLogo size={SocialLogosSize} />
            </Link>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
