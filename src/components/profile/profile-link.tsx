"use client";

import {
  useGlobalCollectionNameStore,
  useGlobalLikeImageStore,
} from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLink() {
  const pathname = usePathname();

  const { globalLikedImagesIds } = useGlobalLikeImageStore();
  const { globalCollectionNames } = useGlobalCollectionNameStore();

  const ProfileLinks = [
    { name: "Gallery", link: "/profile", count: undefined },
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
              " px-6 py-3 bg-stone-100 rounded-full mr-4 hover:opacity-80 opacity-100 transition active:opacity-100 flex gap-x-2 items-center",
              pathname === link.link && "bg-black text-white"
            )}
            href={link.link}>
            {link.name}
            <span>{link.count}</span>
          </Link>
        ))}
      </div>
    );
}
