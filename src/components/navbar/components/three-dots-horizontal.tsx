"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GiUsaFlag } from "react-icons/gi";
import { HiDotsHorizontal } from "react-icons/hi";
import { Separator } from "../../ui/separator";

const hoverContents = [
  { seperator: false, title: "Login", href: "/login" },
  { seperator: false, title: "Join", href: "/join" },
  {
    seperator: true,
    title: (
      <div className="text-stone-800 flex gap-x-2 items-center">
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

const logos = [
  { logo: <FaFacebook size={20} />, href: "" },
  { logo: <FaInstagram size={20} />, href: "" },
  { logo: <FaYoutube size={20} />, href: "" },
  { logo: <FaPinterest size={20} />, href: "" },
  { logo: <FaXTwitter size={20} />, href: "" },
];

export function NavbarThreeDotsHorizontal() {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard
      openDelay={150}
      closeDelay={250}
      open={open}
      onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <Button
          onClick={() => setOpen(!open)}
          variant="link"
          className="px-0 text-inherit">
          <HiDotsHorizontal size={20} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="px-0 w-fit py-2 text-stone-700/80">
        {hoverContents.map((content) => (
          <div key={content.href}>
            <Link
              className="px-6 text-sm font-semibold py-2 whitespace-nowrap block cursor-pointer hover:bg-stone-100 capitalize"
              key={content.href}
              href={content.href}>
              {content.title}
            </Link>
            {content.seperator && <Separator className="my-2" />}
          </div>
        ))}

        <div className="flex gap-x-4 py-2 px-6 items-center">
          {logos.map((logo) => (
            <Link
              className="rounded-md cursor-pointer hover:bg-stone-100"
              key={logo.href}
              href={logo.href}>
              {logo.logo}
            </Link>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
