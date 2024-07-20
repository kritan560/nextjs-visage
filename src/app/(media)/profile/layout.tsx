import AdjustPadding from "@/components/shared/adjust-padding";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import { LinkEditProfile } from "@/links/links";
import { getCurrentUser } from "@/servers/authentication/authentication-server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileLink from "../../../components/profile/profile-link";
import EditProfileButton from "@/components/profile/edit-profile/edit-profile-button";
import { getTotalViewsCount } from "@/servers/visage/visage-server";

type ProfileLayoutProps = {
  children: React.ReactNode;
};

export default async function ProfileLayout(props: ProfileLayoutProps) {
  const { children } = props;

  const { profilePicture, userName } = await getCurrentUser();
  const { failed, success } = await getTotalViewsCount();
  const totalViews = success?.data.views;
  const totalContent = success?.data.totalContent

  return (
    <>
      <NavbarWithSearch />
      <div className="w-fit mx-auto mt-16">
        <div className="space-y-8 flex items-center flex-col">
          {/* profile image */}
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="profie picture"
              className="rounded-full "
              height={120}
              width={120}
              priority
            />
          ) : (
            <div className="w-12 h-12 rounded-full uppercase flex justify-center items-center font-bold text-xl">
              {userName?.slice(1, 2)}
            </div>
          )}

          {/* profile name */}
          <h1 className="font-medium capitalize text-stone-700 dark:text-stone-400 text-5xl">
            {userName ?? ""}
          </h1>
          {/* profile edit button */}
          <Link href={LinkEditProfile}>
            <EditProfileButton buttonName="Edit Profile" />
          </Link>

          {/* total views  */}
          <div className="flex flex-col items-center gap-y-1">
            <p className="text-base text-stone-500 dark:text-stone-400">Total Views</p>
            <span className="font-semibold text-2xl">{totalViews}</span>
          </div>
        </div>
      </div>

      <NavbarWhenScrolled threshold={100}>
        <NavbarWithSearch />
      </NavbarWhenScrolled>

      {/* profile links */}
      <AdjustPadding className="mt-12 font-medium">
        <ProfileLink totalContent={totalContent}/>
      </AdjustPadding>

      {/* children */}
      <AdjustPadding className="mt-8">{children}</AdjustPadding>
    </>
  );
}
