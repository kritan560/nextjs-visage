import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import EditProfileChangeImage from "@/components/profile/edit-profile/edit-profile-change-image";
import { EditProfileForm } from "@/components/profile/edit-profile/edit-profile-form";
import AdjustPadding from "@/components/shared/adjust-padding";
import {
  getCurrentUserId,
  getUserDetailById,
} from "@/servers/Authentication.server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile Page",
};

export default async function EditProfilePage() {
  const { userId } = await getCurrentUserId();

  if (!userId) {
    return;
  }

  const { failed, success } = await getUserDetailById(userId);
  const profileData = success?.data;
  const profilePicture = success?.data?.image;

  return (
    <div>
      <NavbarWithSearch />
      <NavbarWithSearchBoxMobile userId={userId} />

      <NavbarWhenScrolled threshold={90}>
        <NavbarWithSearchBox />
        <NavbarWithSearchBoxMobile userId={userId} />
      </NavbarWhenScrolled>

      <h1 className="mt-6 text-center text-5xl font-semibold tracking-[0.015rem] text-stone-700 dark:text-stone-400 md:mt-1">
        Profile settings
      </h1>

      <AdjustPadding className="mx-auto mt-12 w-full md:w-[60%]">
        <EditProfileChangeImage
          userId={userId}
          profilePicture={profilePicture}
        />

        <div className="mt-7">
          <EditProfileForm
            profileId={userId}
            profileData={{
              name: profileData?.name ?? "",
              email: profileData?.email ?? "",
              lastName: profileData?.lastName ?? "",
              instagram: profileData?.instagram ?? undefined,
              location: profileData?.location ?? undefined,
              publicEmail: profileData?.publicEmail ?? undefined,
              shortBio: profileData?.shortBio ?? undefined,
              tikTok: profileData?.tikTok ?? undefined,
              webSite: profileData?.webSite ?? undefined,
              x: profileData?.x ?? undefined,
              youTube: profileData?.youTube ?? undefined,
            }}
          />
        </div>
      </AdjustPadding>
    </div>
  );
}
