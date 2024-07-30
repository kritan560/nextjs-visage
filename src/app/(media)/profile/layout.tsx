import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import {
  default as NavbarWithSearch,
  default as NavbarWithSearchBox,
} from "@/components/navbar/-navbar-with-search";
import EditProfileButton from "@/components/profile/edit-profile/edit-profile-button";
import AdjustPadding from "@/components/shared/adjust-padding";
import { LinkEditProfile } from "@/links/visage-links";
import { getCurrentUser } from "@/servers/Authentication.server";
import { getTotalImagesViewsCount } from "@/servers/Image.server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileLink from "../../../components/profile/profile-link";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";

type ProfileLayoutProps = {
  children: React.ReactNode;
};

export default async function ProfileLayout(props: ProfileLayoutProps) {
  const { children } = props;

  const { profilePic, userName, userId } = await getCurrentUser();
  const { failed, success } = await getTotalImagesViewsCount();
  const totalViews = success?.data.views;
  const totalContent = success?.data.totalContent;

  return (
    <div className="w-full">
      <NavbarWithSearchBox />
      {/* <div className="w-screen"> */}
      <NavbarWithSearchBoxMobile userId={userId} />
      {/* </div> */}

      <div className="mx-auto mt-16 w-fit">
        <div className="flex flex-col items-center space-y-8">
          {/* profile image */}
          {profilePic ? (
            <Image
              src={profilePic}
              alt="profie picture"
              className="rounded-full"
              height={120}
              width={120}
              priority
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold uppercase">
              {userName?.slice(1, 2)}
            </div>
          )}

          {/* profile name */}
          <h1 className="text-5xl font-medium capitalize text-stone-700 dark:text-stone-400">
            {userName ?? ""}
          </h1>
          {/* profile edit button */}
          <Link href={LinkEditProfile}>
            <EditProfileButton buttonName="Edit Profile" />
          </Link>

          {/* total views  */}
          <div className="flex flex-col items-center gap-y-1">
            <p className="text-base text-stone-500 dark:text-stone-400">
              Total Views
            </p>
            <span className="text-2xl font-semibold">{totalViews}</span>
          </div>
        </div>
      </div>

      <NavbarWhenScrolled threshold={100}>
        <NavbarWithSearchBox />
        <NavbarWithSearchBoxMobile userId={userId} />
      </NavbarWhenScrolled>

      {/* profile links */}
      <AdjustPadding className="mt-12 w-full font-medium">
        <ProfileLink totalContent={totalContent} />
      </AdjustPadding>

      {/* children */}
      <AdjustPadding className="mt-8">{children}</AdjustPadding>
    </div>
  );
}
