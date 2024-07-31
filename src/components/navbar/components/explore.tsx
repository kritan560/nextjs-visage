"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  LinkImagePage,
  LinkProfile,
  LinkVideoPage,
} from "@/links/visage-links";
import Link from "next/link";

const navigationContents = [
  { href: LinkImagePage, title: "Discover Photos" },
  { href: "/#popular", title: "Popular Searches" },
  { href: "/#leaderboard", title: "Leaderboard" },
  { href: "/#challenges", title: "Challenges" },
  { href: LinkVideoPage, title: "Free Videos" },
  { href: LinkProfile, title: "Visage Blog" },
];

export default function NavbarExplore() {
  return (
    <NavigationMenu orientation="horizontal" className="">
      <NavigationMenuList className="">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent px-0 text-base text-inherit data-[active]:bg-accent/0 data-[state=open]:bg-accent/0 hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit">
            Explore{" "}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="py-2">
            <>
              {navigationContents.map((component) => (
                <Link
                  href={component.href}
                  key={component.href}
                  className={cn(
                    "block cursor-pointer whitespace-nowrap px-6 py-2 text-sm font-medium capitalize hover:bg-stone-100 dark:hover:bg-stone-800",
                  )}
                >
                  {component.title}
                </Link>
              ))}
            </>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
