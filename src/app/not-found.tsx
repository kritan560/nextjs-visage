import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import { blurDataURL } from "@/constants/blurDataUrl";
import ImageNotFound from "@/images/image-not-found.jpeg";
import { LinkHomepage, LinkVideoPage } from "@/links/visage-links";
import {
  getCurrentUser,
  getCurrentUserId,
} from "@/servers/Authentication.server";
import { getRandomPhoto } from "@/servers/pexel/pexelPhoto.server";
import Image from "next/image";
import Link from "next/link";
import { FaCameraRetro } from "react-icons/fa";
import { IoMdRefreshCircle } from "react-icons/io";
import { RiMessage3Line } from "react-icons/ri";
import { TbViewfinder } from "react-icons/tb";

const PageNotFoundPage = async () => {
  const { success } = await getRandomPhoto();

  const { userId } = await getCurrentUserId();
  const randomPhoto = success?.data?.src.medium ?? ImageNotFound;
  const photographerName = success?.data?.photographer;

  return (
    <div className="bg-inherit">
      <NavbarWithSearchBox />
      <NavbarWithSearchBoxMobile userId={userId} />

      <NavbarWhenScrolled threshold={40}>
        <NavbarWithSearchBox />
        <NavbarWithSearchBoxMobile userId={userId} />
      </NavbarWhenScrolled>

      <div className="mx-auto my-8 flex w-full px-4 md:w-[70%] md:px-0">
        {/* left section */}
        <div className="flex w-full items-center md:w-1/2">
          <div className="flex flex-col">
            <h1 className="text-5xl font-semibold tracking-[0.01rem] text-stone-700 dark:text-stone-400">
              Oops, we couldn&apos;t find this page.
            </h1>
            <b className="mt-3 text-2xl font-semibold text-stone-700 dark:text-stone-500">
              Here are some helpful links instead:
            </b>

            {/* links */}
            <div className="mt-8 space-y-3 font-medium text-stone-600 dark:text-stone-500">
              <p className="flex items-center gap-x-2">
                <span>
                  <FaCameraRetro />
                </span>
                Discover free{" "}
                <Link
                  className="underline decoration-dotted underline-offset-4"
                  href={LinkHomepage}
                >
                  photos
                </Link>{" "}
                or{" "}
                <Link
                  className="underline decoration-dotted underline-offset-4"
                  href={LinkVideoPage}
                >
                  videos
                </Link>
              </p>

              <p className="flex items-center gap-x-2">
                <span>
                  <TbViewfinder />
                </span>
                View the most{" "}
                <Link
                  className="underline decoration-dotted underline-offset-4"
                  href={LinkHomepage}
                >
                  popular searches
                </Link>
              </p>

              <p className="flex items-center gap-x-2">
                <span>
                  <IoMdRefreshCircle />
                </span>
                Refresh the page
              </p>

              <p className="flex items-center gap-x-2 whitespace-break-spaces">
                <span>
                  <RiMessage3Line />
                </span>
                If you believe this is an error, please{" "}
                <Link
                  className="underline decoration-dotted underline-offset-4"
                  href={"mailto:kritanshrestha560@gmail.com"}
                >
                  contact us
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* right section */}
        <div className="hidden h-[500px] flex-1 md:block">
          <div className="relative mx-auto h-full w-80">
            <Image
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="rounded-md"
              src={randomPhoto}
              alt="image not found"
              quality={25}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="text-center text-stone-500">
            photo by{" "}
            <span className="font-medium text-stone-600">
              {photographerName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFoundPage;
