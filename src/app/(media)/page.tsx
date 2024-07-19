import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithoutSearchBox from "@/components/navbar/-navbar-without-searchbox";
import { SecondaryNavbar } from "@/components/navbar/secondary-navbar/-navbar-secondary";
import ImageSearchVideo2 from "@/components/shared/image-video-search2";
import InfiniteScroll from "@/components/shared/infinite-scroll";
import MainImage from "@/images/pexels-alexmoliski-26341034.jpg";
import { getCurrentUserId } from "@/servers/authentication/authentication-server";
import Image from "next/image";

const Page = async () => {
  const { isUserAuthenticated, userId } = await getCurrentUserId();
  return (
    <div>
      {/* inside main image */}
      <div className="h-[500px] relative">
        <Image
          style={{ objectFit: "cover" }}
          src={MainImage}
          fill
          alt="main image"
          priority
          className="relative z-50"
        />

        <div className="relative z-[60]">
          <NavbarWithoutSearchBox />
        </div>

        <NavbarWhenScrolled>
          <NavbarWithSearchBox />
        </NavbarWhenScrolled>

        <div className="absolute z-[50] left-0 right-0 top-1/2 -translate-y-1/2 mx-auto w-[55%] flex gap-y-8 flex-col">
          <h1 className="font-medium text-4xl text-white">
            The best free stock photos, royalty free images & videos shared by
            creators.
          </h1>
          <ImageSearchVideo2
            userId={userId}
            border
          />
        </div>

        <div className="font-semibold text-sm absolute bottom-4 right-6 text-white">
          Photo By <span className="">Kritan Shrestha</span>
        </div>
      </div>

      <div className="mt-8">
        <SecondaryNavbar />
      </div>

      {/* image : mansonry */}
      <div className="mt-6">
        <InfiniteScroll mediaType={"Image"} />
      </div>
    </div>
  );
};

export default Page;
