import VisageHighFive from "@/images/high-five.svg";
import { Bell, Info } from "lucide-react";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function NavbarNotificationLoggedInOnly() {
  return (
    <div>
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild className="cursor-pointer">
          <div>
            <Bell size={18} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="center" className="mt-3 w-fit rounded-xl p-0">
          <div className="w-[420px] px-4 py-2 text-sm font-normal">
            <div className="my-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notification</h2>
              <div>
                <Info />
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="mr-7">
                <Image
                  src={VisageHighFive}
                  alt="high-five"
                  className="rounded-full"
                />
              </div>
              <div className="text-slate-800 dark:text-slate-300">
                Virtual high five for joining visage! We are striving to build
                the most extraordinary photo community and are proud to work
                with talented photographers from around the world who submit
                thousands of free photos per day. You can help the community by:
                <ul className="list-disc pl-12 text-slate-700 underline dark:text-slate-400">
                  <li>Uploading your photos</li>
                  <li>Following photographers that inspire you</li>
                  <li>Discovering and liking trending photos</li>
                </ul>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  4 years ago
                </p>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
