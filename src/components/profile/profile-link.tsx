"use client";

import {
  useGlobalCollectionNameStore,
  useGlobalLikeImageStore,
} from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type ProfileLinkProps = { totalContent: number | undefined };

export default function ProfileLink(props: ProfileLinkProps) {
  const { totalContent } = props;
  const pathname = usePathname();

  const { globalLikedImagesIds } = useGlobalLikeImageStore();
  const { globalCollectionNames } = useGlobalCollectionNameStore();

  const ProfileLinks = [
    { name: "Gallery", link: "/profile", count: totalContent },
    {
      name: "Collections",
      link: "/profile/collections",
      count: globalCollectionNames?.length,
    },
    {
      name: "Likes",
      link: "/profile/likes",
      count: globalLikedImagesIds?.length,
    },
  ];

  if (ProfileLinks)
    return (
      <ScrollArea className="pb-3">
        <div className="flex items-center">
          {ProfileLinks.map((link, index) => (
            <Link
              key={index}
              className={cn(
                "mr-4 flex items-center gap-x-2 rounded-full bg-stone-100 px-6 py-3 opacity-100 transition hover:opacity-80 active:opacity-100 dark:bg-stone-800 dark:text-white",
                pathname === link.link &&
                  "bg-black text-white dark:bg-stone-400 dark:text-black",
              )}
              href={link.link}
            >
              {link.name}
              <span>{link.count}</span>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
}
