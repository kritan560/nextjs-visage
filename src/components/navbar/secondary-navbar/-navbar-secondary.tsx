"use client";

import { cn } from "@/lib/utils";
import { LinkHomepage, LinkVideoPage } from "@/links/links";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import TrendingNewComboBox from "./trending-newcombobox";

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
      <div className="flex items-center gap-x-4 justify-center">
        {SecondaryNavbarLinks.map((nav) => (
          <Link
            className={cn(
              "px-4 py-3 font-semibold text-base transition bg-visage-100 rounded-full",
              pathname === nav.href &&
                "bg-visage-500 text-white  hover:bg-visage-600/80 active:bg-visage-600"
            )}
            key={nav.href}
            href={nav.href}>
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
