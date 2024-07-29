import { LinkJoinPage, LinkUploadPage } from "@/links/visage-links";
import { getCurrentUser } from "@/servers/Authentication.server";
import { ModeToggle } from "../mode-toggle";
import AdjustPadding from "../shared/adjust-padding";
import ImageSearchVideo2 from "../shared/image-video-search2";
import { NavbarAvatarLoggedIn } from "./components/avatar-loggedin";
import { NavbarButton } from "./components/button";
import Explore from "./components/explore";
import License from "./components/license";
import LogoVisage from "./components/logo-visage";
import { NavbarNotificationLoggedInOnly } from "./components/notification-loggedIn-only";
import { NavbarThreeDotsHorizontal } from "./components/three-dots-horizontal";
import Upload from "./components/upload";

const NavbarWithSearchBox = async () => {
  const { userId, profilePic, userName } = await getCurrentUser();

  const userAuthenticated = (
    <div className="hidden items-center gap-x-8 md:flex">
      <LogoVisage />

      <div className="flex-1">
        <ImageSearchVideo2 userId={userId} grid={3} />
      </div>

      <div className="flex items-center gap-x-6">
        <Explore />
        <License />
        <NavbarNotificationLoggedInOnly />
        <NavbarAvatarLoggedIn userName={userName} profilePicture={profilePic} />
        <ModeToggle />
        <NavbarButton buttonName="Upload" href={LinkUploadPage} />
      </div>
    </div>
  );

  const anonymousUser = (
    <div className="hidden items-center gap-x-8 md:flex">
      <LogoVisage />

      <div className="flex-1">
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
    <AdjustPadding className="hidden bg-white dark:bg-stone-800 dark:text-stone-50 md:block">
      {!!userId ? userAuthenticated : anonymousUser}
    </AdjustPadding>
  );
};

export default NavbarWithSearchBox;
