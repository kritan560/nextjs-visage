import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import VideoSearch from "@/components/search/videos/video-search";
import AdjustPadding from "@/components/shared/adjust-padding";
import { getCurrentUserId } from "@/servers/Authentication.server";
import { getVideosByKeyword } from "@/servers/pexel/pexelVideo.server";

type VideoSearchPageProps = {
  params: Promise<{ keyword: string }>;
};

// or Dynamic metadata
export async function generateMetadata(props: VideoSearchPageProps) {
  const params = await props.params;
  return {
    title: `Free Stock Video ${params.keyword}`,
  };
}

export default async function VideoSearchPage(props: VideoSearchPageProps) {
  const { keyword } = await props.params;

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
