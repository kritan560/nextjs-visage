"use server";

import AdjustPadding from "@/components/shared/adjust-padding";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import ImageSearch from "@/components/search/images/image-search";
import { getPexelPhotoByKeyword } from "@/servers/pexel/pexelPhoto.server";
import { UniversalImagesType } from "@/types/universalImage.type";
import { getImagesByTags } from "@/servers/Image.server";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import { getCurrentUserId } from "@/servers/Authentication.server";

type ImageSearchPageProps = {
  params: { keyword: string };
};

// or Dynamic metadata
export async function generateMetadata({ params }: ImageSearchPageProps) {
  return {
    title: `Free Stock Image ${params.keyword}`,
  };
}

export default async function ImageSearchPage(props: ImageSearchPageProps) {
  const {
    params: { keyword },
  } = props;

  const { userId } = await getCurrentUserId();

  const pexelPhotoByKeyword = await getPexelPhotoByKeyword(keyword);
  const totalResult = pexelPhotoByKeyword?.pop()?.totalResult;

  const { failed, success } = await getImagesByTags(
    decodeURI(keyword).toLowerCase(),
  );

  const imagesByTags = success?.data.map(
    (img) => img.image,
  ) as UniversalImagesType;

  let searchedPhotos: UniversalImagesType = [];

  if (imagesByTags && pexelPhotoByKeyword) {
    searchedPhotos = [...imagesByTags, ...pexelPhotoByKeyword];
  }

  return (
    <>
      <NavbarWithSearchBox />
      <NavbarWithSearchBoxMobile userId={userId} />

      <NavbarWhenScrolled threshold={200}>
        <NavbarWithSearchBox />
        <NavbarWithSearchBoxMobile userId={userId} />
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
