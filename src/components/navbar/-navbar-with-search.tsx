import { getCurrentUser } from "@/servers/Authentication.server";
import AdjustPadding from "../shared/adjust-padding";
import ImageSearchVideo2 from "../shared/image-video-search2";
import { NavbarAvatarLoggedIn } from "./components/avatar-loggedin";
import Explore from "./components/explore";
import License from "./components/license";
import LogoVisage from "./components/logo-visage";
import { NavbarThreeDotsHorizontal } from "./components/three-dots-horizontal";
import Upload from "./components/upload";
import { NavbarNotificationLoggedInOnly } from "./components/notification-loggedIn-only";
import { NavbarButton } from "./components/button";
import { LinkJoinPage, LinkUploadPage } from "@/links/visage-links";
import { ModeToggle } from "../mode-toggle";

const NavbarWithSearchBox = async () => {
  const { userId, profilePic, userName } = await getCurrentUser();

  const userAuthenticated = (
    <div className="">
      <div className="flex items-center gap-x-8">
        <LogoVisage />

        <div className="flex-grow">
          <ImageSearchVideo2 userId={userId} grid={3} />
        </div>

        <div className="flex items-center gap-x-6">
          <Explore />
          <License />
          <NavbarNotificationLoggedInOnly />
          <NavbarAvatarLoggedIn
            userName={userName}
            profilePicture={profilePic}
          />
          <ModeToggle />
          <NavbarButton buttonName="Upload" href={LinkUploadPage} />
        </div>
      </div>
    </div>
  );

  const anonymousUser = (
    <div className="flex items-center gap-x-8">
      <LogoVisage />

      <div className="flex-grow">
        <ImageSearchVideo2 userId={userId} grid={3} />
      </div>

      <div className="flex items-center gap-x-8">
        <Explore />
        <License />
        <Upload />
        <NavbarThreeDotsHorizontal />
        <ModeToggle />
        <NavbarButton buttonName="join" href={LinkJoinPage} />
      </div>
    </div>
  );

  return (
    <AdjustPadding className="bg-white dark:bg-stone-800 dark:text-stone-50">
      {!!userId ? userAuthenticated : anonymousUser}
    </AdjustPadding>
  );
};

export default NavbarWithSearchBox;
