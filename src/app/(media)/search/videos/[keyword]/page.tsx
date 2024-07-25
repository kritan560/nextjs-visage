"use server";

import AdjustPadding from "@/components/shared/adjust-padding";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import { getVideosByKeyword } from "@/servers/pexel/pexel-server";
import VideoSearch from "@/components/search/videos/video-search";

type VideoSearchPageProps = {
  params: { keyword: string };
};

export default async function VideoSearchPage(props: VideoSearchPageProps) {
  const {
    params: { keyword },
  } = props;

  const { failed, success } = await getVideosByKeyword(
    decodeURI(keyword).toLowerCase(),
  );
  const totalResult = success?.data.totalResults;
  const videos = success?.data;

  return (
    <>
      <NavbarWithSearchBox />

      <NavbarWhenScrolled threshold={200}>
        <NavbarWithSearchBox />
      </NavbarWhenScrolled>

      <AdjustPadding>
        <VideoSearch
          keyword={keyword}
          searchedVideos={videos}
          totalResult={totalResult}
        />
      </AdjustPadding>
    </>
  );
}
