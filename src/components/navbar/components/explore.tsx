"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

const navigationContents = [
  { href: "/", title: "Discover Photos" },
  { href: "/title", title: "Popular Searches" },
  { href: "/const", title: "Leaderboard" },
  { href: "/const", title: "Challenges" },
  { href: "/const", title: "Free Videos" },
  { href: "/const", title: "Pexel Blog" },
];

export default function NavbarExplore() {
  return (
    <NavigationMenu
      orientation="horizontal"
      className="">
      <NavigationMenuList className="">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:bg-transparent focus:bg-transparent data-[active]:bg-accent/0 data-[state=open]:bg-accent/0 text-base px-0 text-inherit bg-transparent hover:text-inherit focus:text-inherit">
            Explore{" "}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="py-2">
            <>
              {navigationContents.map((component) => (
                <Link
                  href={component.href}
                  key={component.href}
                  className={cn(
                    "px-6 py-2 whitespace-nowrap hover:bg-stone-100 cursor-pointer block font-medium capitalize text-sm"
                  )}>
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
