import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import NavbarWithoutSearchBox from "@/components/navbar/-navbar-without-searchbox";
import NavbarWithoutSearchBoxMobile from "@/components/navbar/-navbar-without-searchbox-mobile";
import { SecondaryNavbar } from "@/components/navbar/secondary-navbar/-navbar-secondary";
import ImageSearchVideo2 from "@/components/shared/image-video-search2";
import InfiniteScroll from "@/components/shared/infinite-scroll";
import MainImage from "@/images/pexels-alexmoliski-26341034.jpg";
import { getCurrentUserId } from "@/servers/Authentication.server";
import { getRandomPhoto } from "@/servers/pexel/pexelPhoto.server";
import { Metadata } from "next";
import Image from "next/image";

// Static metadata
export const metadata: Metadata = {
  title: "Free Stock Photos",
};

const ImagesPage = async () => {
  const { userId } = await getCurrentUserId();
  const { success } = await getRandomPhoto();

  const randomPhoto = success?.data?.src.landscape ?? MainImage;
  const photographerName = success?.data?.photographer;

  return (
    <>
      {/* inside main image */}
      <div className="relative h-[500px]">
        <Image
          style={{ objectFit: "cover" }}
          src={randomPhoto}
          fill
          alt="main image"
          priority
          className="relative z-10"
        />

        <div className="relative z-[20]">
          <NavbarWithoutSearchBox />
          <NavbarWithoutSearchBoxMobile userId={userId} />
        </div>

        <NavbarWhenScrolled>
          <NavbarWithSearchBox />
          <NavbarWithSearchBoxMobile userId={userId} />
        </NavbarWhenScrolled>

        <div className="absolute left-0 right-0 top-1/2 z-[18] mx-auto flex w-full -translate-y-1/2 flex-col gap-y-8 px-4 md:w-[55%]">
          <h1 className="text-3xl font-semibold text-white md:text-4xl md:font-medium">
            The best free stock photos, royalty free images & videos shared by
            creators.
          </h1>
          <ImageSearchVideo2 userId={userId} border />
        </div>

        <div className="absolute bottom-4 right-6 z-[18] text-sm font-semibold text-white">
          Photo By <span className="">{photographerName}</span>
        </div>

        {/* black overlay 40% */}
        <div className="absolute top-0 z-[15] h-full w-full bg-black/40"></div>
      </div>

      <div className="mt-8">
        <SecondaryNavbar />
      </div>

      {/* image : mansonry */}
      <div className="mt-6">
        <InfiniteScroll mediaType={"Image"} />
      </div>
    </>
  );
};

export default ImagesPage;
