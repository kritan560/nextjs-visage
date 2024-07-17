"use server";

import AdjustPadding from "@/components/adjust-padding";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import ImageSearch from "@/components/search/images/image-search";
import { getPexelPhotoByKeyword } from "@/servers/pexel-server";

type ImageSearchPageProps = {
  params: { keyword: string };
};

export default async function ImageSearchPage(props: ImageSearchPageProps) {
  const {
    params: { keyword },
  } = props;

  const searchedPhotos = await getPexelPhotoByKeyword(keyword);
  const totalResult = searchedPhotos?.pop()?.totalResult;

  return (
    <>
      <NavbarWithSearchBox />

      <NavbarWhenScrolled threshold={200}>
        <NavbarWithSearchBox />
      </NavbarWhenScrolled>

      <AdjustPadding>
        <ImageSearch
          keyword={keyword}
          searchedPhotos={searchedPhotos}
          totalResult={totalResult}
        />
      </AdjustPadding>
    </>
  );
}
