import { LinkJoinPage, LinkUploadPage } from "@/links/links";
import { getCurrentUser } from "@/servers/authentication/authentication-server";
import AdjustPadding from "../shared/adjust-padding";
import { NavbarAvatarLoggedIn } from "./components/avatar-loggedin";
import { NavbarButton } from "./components/button";
import Explore from "./components/explore";
import License from "./components/license";
import LogoVisage from "./components/logo-visage";
import { NavbarNotificationLoggedInOnly } from "./components/notification-loggedIn-only";
import { NavbarThreeDotsHorizontal } from "./components/three-dots-horizontal";
import Upload from "./components/upload";

const NavbarWithoutSearchBox = async () => {
  const { isUserAuthenticated, profilePicture } = await getCurrentUser();

  const userAuthenticated = (
    <div className="text-white z-[11] relative">
      <div className="flex justify-between items-center">
        <LogoVisage />

        <div className="flex gap-x-7 items-center ">
          <Explore />
          <License />
          <NavbarNotificationLoggedInOnly />
          <NavbarAvatarLoggedIn profilePicture={profilePicture} />
          <NavbarButton
            buttonName="upload"
            href={LinkUploadPage}
          />
        </div>
      </div>
    </div>
  );

  const anonymousUser = (
    <div className="text-white">
      <div className="flex justify-between items-center">
        <LogoVisage />

        <div className="flex gap-x-9 items-center ">
          <Explore />
          <License />
          <Upload />
          <NavbarThreeDotsHorizontal />
          <NavbarButton
            buttonName="join"
            href={LinkJoinPage}
          />
        </div>
      </div>
    </div>
  );
  return (
    <AdjustPadding className="">
      {isUserAuthenticated ? userAuthenticated : anonymousUser}
    </AdjustPadding>
  );
};

export default NavbarWithoutSearchBox;
