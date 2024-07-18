import AdjustPadding from "@/components/shared/adjust-padding";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import EditProfileChangeImage from "@/components/profile/edit-profile/edit-profile-change-image";
import { EditProfileForm } from "@/components/profile/edit-profile/edit-profile-form";
import { getCurrentUserId, getUserDetailById } from "@/servers/authentication/authentication-server";

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

      <NavbarWhenScrolled threshold={90}>
        <NavbarWithSearch />
      </NavbarWhenScrolled>

      <h1 className="text-center font-semibold text-5xl tracking-[0.015rem]">
        Profile settings
      </h1>

      <AdjustPadding className="w-[60%] mx-auto mt-12">
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
