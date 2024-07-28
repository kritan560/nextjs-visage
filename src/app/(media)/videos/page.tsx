import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithoutSearchBox from "@/components/navbar/-navbar-without-searchbox";
import { SecondaryNavbar } from "@/components/navbar/secondary-navbar/-navbar-secondary";
import ImageSearchVideo2 from "@/components/shared/image-video-search2";
import InfiniteScrollVideo from "@/components/shared/infinite-scroll-video";
import { getCurrentUserId } from "@/servers/Authentication.server";
import { getRandomVideo } from "@/servers/pexel/pexelVideo.server";
import { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "Free Stock Videos",
};

const VideosPage = async () => {
  const { userId } = await getCurrentUserId();
  const { success } = await getRandomVideo();

  const fallbackRandomVideoLink =
    "https://videos.pexels.com/video-files/17932288/17932288-sd_640_360_30fps.mp4";

  const randomHDVideo = success?.data?.video_files.find(
    (video) => video.quality === "hd",
  );

  const randomHdVideoLink = randomHDVideo?.link ?? fallbackRandomVideoLink;
  const randomHdVideographer = success?.data?.user.name;

  return (
    <>
      {/* inside main video */}
      <div className="relative h-[500px]">
        <video
          autoPlay
          className="relative z-50 h-[100%] w-full object-cover"
          muted
          loop
        >
          <source type="video/mp4" src={randomHdVideoLink} />
        </video>

        <div className="absolute left-0 right-0 top-0 z-[60]">
          <NavbarWithoutSearchBox />
        </div>

        <NavbarWhenScrolled>
          <NavbarWithSearchBox />
        </NavbarWhenScrolled>

        <div className="absolute left-0 right-0 top-1/2 z-[59] mx-auto flex w-[55%] -translate-y-1/2 flex-col gap-y-8">
          <h1 className="text-4xl font-medium text-white">
            The best free stock videos shared by the Visage community.
          </h1>
          <ImageSearchVideo2 userId={userId} border />
        </div>

        <div className="absolute bottom-4 right-6 z-[60] text-sm font-semibold text-white">
          Video By <span className="">{randomHdVideographer}</span>
        </div>

        {/* black overlay 40% */}
        <div className="absolute top-0 z-[55] h-full w-full bg-black/40"></div>
      </div>

      <div className="mt-8">
        <SecondaryNavbar />
      </div>

      {/* image : mansonry */}
      <div className="mt-6">
        <InfiniteScrollVideo mediaType={"Video"} />
      </div>
    </>
  );
};

export default VideosPage;
