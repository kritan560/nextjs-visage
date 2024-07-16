import MainImage from "@/images/pexels-alexmoliski-26341034.jpg";
import ImageSearchVideo2 from "@/components/image-video-search2";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithoutSearchBox from "@/components/navbar/-navbar-without-searchbox";
import { SecondaryNavbar } from "@/components/navbar/secondary-navbar/-navbar-secondary";
import Image from "next/image";
import InfiniteScroll from "@/components/infinite-scroll";

const Page = async () => {
  return (
    <div>
      {/* inside main image */}
      <div className="h-[500px] relative">
        <Image
          className="-z-10"
          style={{ objectFit: "cover" }}
          src={MainImage}
          fill
          alt="main image"
        />

        <NavbarWithoutSearchBox />

        <NavbarWhenScrolled>
          <NavbarWithSearchBox />
        </NavbarWhenScrolled>

        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 mx-auto w-[55%] flex gap-y-8 flex-col">
          <h1 className="font-medium text-4xl text-white">
            The best free stock photos, royalty free images & videos shared by
            creators.
          </h1>
          <ImageSearchVideo2 border />
        </div>

        <div className="font-semibold text-sm absolute bottom-4 right-6 text-white">
          Photo By <span className="">Kritan Shrestha</span>
        </div>
      </div>

      <div className="mt-8">
        <SecondaryNavbar />
      </div>

      {/* image or video : mansonry */}
      <div className="mt-6">
        <InfiniteScroll mediaType={"Image"} />
      </div>
    </div>
  );
};

export default Page;
