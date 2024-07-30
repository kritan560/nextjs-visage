import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import UploadImageContent from "@/components/upload/upload-image-content";
import { getCurrentUserId } from "@/servers/Authentication.server";

export default async function UploadPage() {
  const { userId } = await getCurrentUserId();
  if (!userId) {
    return;
  }

  return (
    <>
      <NavbarWithSearchBox />
      <NavbarWithSearchBoxMobile userId={userId} />

      <NavbarWhenScrolled threshold={70}>
        <NavbarWithSearchBox />
        <NavbarWithSearchBoxMobile userId={userId} />
      </NavbarWhenScrolled>

      <UploadImageContent />
    </>
  );
}
