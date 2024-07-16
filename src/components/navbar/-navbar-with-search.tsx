import { getCurrentUser } from "@/servers/authentication-server";
import AdjustPadding from "../adjust-padding";
import ImageSearchVideo2 from "../image-video-search2";
import { NavbarAvatarLoggedIn } from "./avatar-loggedin";
import Explore from "./explore";
import License from "./license";
import LogoVisage from "./logo-visage";
import { NavbarThreeDotsHorizontal } from "./three-dots-horizontal";
import Upload from "./upload";
import { NavbarNotificationLoggedInOnly } from "./notification-loggedIn-only";
import { NavbarButton } from "./button";
import { LinkJoinPage, LinkUploadPage } from "@/links/links";

const NavbarWithSearchBox = async () => {
  const { isUserAuthenticated, profilePicture } = await getCurrentUser();

  const userAuthenticated = (
    <div className="text-stone-800 bg-white">
      <div className="flex items-center gap-x-8">
        <LogoVisage />

        <div className="flex-grow">
          <ImageSearchVideo2 />
        </div>

        <div className="flex gap-x-6 items-center">
          <Explore />
          <License />
          <NavbarNotificationLoggedInOnly />
          <NavbarAvatarLoggedIn profilePicture={profilePicture} />
          <NavbarButton
            buttonName="Upload"
            href={LinkUploadPage}
          />
        </div>
      </div>
    </div>
  );

  const anonymousUser = (
    <div className="flex items-center gap-x-8">
      <LogoVisage />

      <div className="flex-grow">
        <ImageSearchVideo2 />
      </div>

      <div className="flex gap-x-8 items-center">
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
  );

  return (
    <AdjustPadding className="bg-white">
      {isUserAuthenticated ? userAuthenticated : anonymousUser}
    </AdjustPadding>
  );
};

export default NavbarWithSearchBox;
