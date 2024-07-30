import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import VideoSearch from "@/components/search/videos/video-search";
import AdjustPadding from "@/components/shared/adjust-padding";
import { getCurrentUserId } from "@/servers/Authentication.server";
import { getVideosByKeyword } from "@/servers/pexel/pexelVideo.server";

type VideoSearchPageProps = {
  params: { keyword: string };
};

// or Dynamic metadata
export async function generateMetadata({ params }: VideoSearchPageProps) {
  return {
    title: `Free Stock Video ${params.keyword}`,
  };
}

export default async function VideoSearchPage(props: VideoSearchPageProps) {
  const {
    params: { keyword },
  } = props;

  const { userId } = await getCurrentUserId();

  const { failed, success } = await getVideosByKeyword(
    decodeURI(keyword).toLowerCase(),
  );
  const totalResult = success?.data.totalResults;
  const videos = success?.data;

  return (
    <>
      <NavbarWithSearchBox />
      <NavbarWithSearchBoxMobile userId={userId} />

      <NavbarWhenScrolled threshold={200}>
        <NavbarWithSearchBox />
        <NavbarWithSearchBoxMobile userId={userId} />
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
