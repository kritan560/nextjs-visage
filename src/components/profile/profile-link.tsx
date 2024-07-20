"use client";

import {
  useGlobalCollectionNameStore,
  useGlobalLikeImageStore,
} from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ProfileLinkProps = { totalContent: number | undefined }

export default function ProfileLink(props: ProfileLinkProps) {
  const { totalContent } = props
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
      <div className="flex ">
        {ProfileLinks.map((link, index) => (
          <Link
            key={index}
            className={cn(
              " px-6 py-3 bg-stone-100 dark:bg-stone-800 dark:text-white rounded-full mr-4 hover:opacity-80 opacity-100 transition active:opacity-100 flex gap-x-2 items-center",
              pathname === link.link && "bg-black text-white dark:bg-stone-400 dark:text-black"
            )}
            href={link.link}>
            {link.name}
            <span>{link.count}</span>
          </Link>
        ))}
      </div>
    );
}
