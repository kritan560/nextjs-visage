"use client";

import { cn } from "@/lib/utils";
import { LinkHomepage, LinkVideoPage } from "@/links/links";
// import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import TrendingNewComboBox from "./trending-newcombobox";
import Link from "next/link";

const SecondaryNavbarLinks = [
  {
    linkName: "Home",
    href: LinkHomepage,
  },
  {
    linkName: "Videos",
    href: LinkVideoPage,
  },
];

export function SecondaryNavbar() {
  const pathname = usePathname();

  return (
    <div>
      {/* secondary navbar */}
      <div className="flex items-center justify-center gap-x-4">
        {SecondaryNavbarLinks.map((nav) => (
          <Link
            className={cn(
              "rounded-full bg-visage-100 px-4 py-3 text-base font-semibold transition dark:bg-visage-900 dark:text-white",
              pathname === nav.href &&
                "bg-visage-500 text-white hover:bg-visage-600/80 active:bg-visage-600 dark:bg-visage-600 dark:hover:bg-visage-700 dark:active:bg-visage-600",
            )}
            key={nav.href}
            href={nav.href}
          >
            <p>{nav.linkName}</p>
          </Link>
        ))}
      </div>

      {/* trending / new combobox */}
      <div className="mt-4">
        <TrendingNewComboBox />
      </div>
    </div>
  );
}
