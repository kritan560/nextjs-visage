"use server";

import { LinkJoinPage, LinkUploadPage } from "@/links/visage-links";
import { getCurrentUser } from "@/servers/Authentication.server";
import { ModeToggle } from "../mode-toggle";
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
  const { isUserAuthenticated, profilePic, userName } = await getCurrentUser();

  const userAuthenticated = (
    <div className="text-white">
      <div className="flex items-center justify-between">
        <LogoVisage />

        <div className="flex items-center gap-x-7">
          <Explore />
          <License />
          <NavbarNotificationLoggedInOnly />
          <NavbarAvatarLoggedIn
            userName={userName}
            profilePicture={profilePic}
          />
          <ModeToggle />
          <NavbarButton buttonName="upload" href={LinkUploadPage} />
        </div>
      </div>
    </div>
  );

  const anonymousUser = (
    <div className="text-white">
      <div className="flex items-center justify-between">
        <LogoVisage />

        <div className="items-center gap-x-9">
          <Explore />
          <License />
          <Upload />
          <NavbarThreeDotsHorizontal />
          <ModeToggle />
          <NavbarButton buttonName="join" href={LinkJoinPage} />
        </div>
      </div>
    </div>
  );
  return (
    <AdjustPadding className="relative z-[11] hidden md:block">
      {isUserAuthenticated ? userAuthenticated : anonymousUser}
    </AdjustPadding>
  );
};

export default NavbarWithoutSearchBox;
