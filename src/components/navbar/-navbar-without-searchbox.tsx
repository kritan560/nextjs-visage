import { LinkJoinPage, LinkUploadPage } from "@/links/links";
import { getCurrentUser } from "@/servers/authentication-server";
import AdjustPadding from "../adjust-padding";
import { NavbarAvatarLoggedIn } from "./avatar-loggedin";
import { NavbarButton } from "./button";
import Explore from "./explore";
import License from "./license";
import LogoVisage from "./logo-visage";
import { NavbarNotificationLoggedInOnly } from "./notification-loggedIn-only";
import { NavbarThreeDotsHorizontal } from "./three-dots-horizontal";
import Upload from "./upload";

const NavbarWithoutSearchBox = async () => {
  const { isUserAuthenticated, profilePicture } = await getCurrentUser();
  const userAuthenticated = (
    <div className="text-white">
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
