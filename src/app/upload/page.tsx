import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import UploadImageContent from "@/components/upload/upload-image-content";
import { getCurrentUserId } from "@/servers/authentication/authentication-server";

export default async function UploadPage() {
  const { userId } = await getCurrentUserId();
  if (!userId) {
    return;
  }

  return (
    <>
      <NavbarWithSearchBox />
      <NavbarWhenScrolled threshold={70}>
        <NavbarWithSearchBox />
      </NavbarWhenScrolled>

      <UploadImageContent />
    </>
  );
}
