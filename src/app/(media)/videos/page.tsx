import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithoutSearchBox from "@/components/navbar/-navbar-without-searchbox";
import { SecondaryNavbar } from "@/components/navbar/secondary-navbar/-navbar-secondary";
import ImageSearchVideo2 from "@/components/shared/image-video-search2";
import InfiniteScrollVideo from "@/components/shared/infinite-scroll-video";
import { getCurrentUserId } from "@/servers/authentication/authentication-server";

const VideosPage = async () => {
  const { userId } = await getCurrentUserId();

  return (
    <div>
      {/* inside main video */}
      <div className="relative h-[500px]">
        <video
          autoPlay
          className="z-50 h-[100%] w-full object-cover"
          muted
          loop
        >
          <source
            type="video/mp4"
            src={
              "https://videos.pexels.com/video-files/17932288/17932288-sd_640_360_30fps.mp4"
            }
          />
        </video>

        <div className="absolute left-0 right-0 top-0 z-[60]">
          <NavbarWithoutSearchBox />
        </div>

        <NavbarWhenScrolled>
          <NavbarWithSearchBox />
        </NavbarWhenScrolled>

        <div className="absolute left-0 right-0 top-1/2 z-[50] mx-auto flex w-[55%] -translate-y-1/2 flex-col gap-y-8">
          <h1 className="text-4xl font-medium text-white">
            The best free stock videos shared by the Visage community.
          </h1>
          <ImageSearchVideo2 userId={userId} border />
        </div>

        <div className="absolute bottom-4 right-6 text-sm font-semibold text-white">
          Video By <span className="">Kritan Shrestha</span>
        </div>
      </div>

      <div className="mt-8">
        <SecondaryNavbar />
      </div>

      {/* image : mansonry */}
      <div className="mt-6">
        <InfiniteScrollVideo mediaType={"Video"} />
      </div>
    </div>
  );
};

export default VideosPage;
