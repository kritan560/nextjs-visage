import VisageHighFive from "@/images/high-five.svg";
import { Bell, Info } from "lucide-react";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

export function NavbarNotificationLoggedInOnly() {
  return (
    <div>
      <HoverCard
        openDelay={100}
        closeDelay={100}>
        <HoverCardTrigger
          asChild
          className="cursor-pointer">
          <div>
            <Bell size={18} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="center"
          className="p-0 w-fit rounded-xl mt-3">
          {" "}
          <div className=" w-[420px] px-4 py-2 text-sm font-normal">
            <div className="flex justify-between items-center my-4">
              <h2 className="font-bold text-2xl">Notification</h2>
              <div>
                <Info />
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div className="mr-7">
                <Image
                  src={VisageHighFive}
                  alt="high-five"
                  className="rounded-full"
                />
              </div>
              <div className="text-slate-800">
                Virtual high five for joining ImageHive! We are striving to
                build the most extraordinary photo community and are proud to
                work with talented photographers from around the world who
                submit thousands of free photos per day. You can help the
                community by:
                <ul className="list-disc underline pl-12 text-slate-700">
                  <li>Uploading your photos</li>
                  <li>Following photographers that inspire you</li>
                  <li>Discovering and liking trending photos</li>
                </ul>
                <p className="text-sm text-slate-500">4 years ago</p>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
