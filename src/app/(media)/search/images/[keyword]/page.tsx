"use server";

import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import ImageSearch from "@/components/search/images/image-search";
import AdjustPadding from "@/components/shared/adjust-padding";
import { getCurrentUserId } from "@/servers/Authentication.server";
import { getImagesByTags } from "@/servers/Image.server";
import { getPexelPhotoByKeyword } from "@/servers/pexel/pexelPhoto.server";
import { UniversalImagesType } from "@/types/universalImage.type";

type ImageSearchPageProps = {
  params: Promise<{ keyword: string }>;
};

// or Dynamic metadata
export async function generateMetadata(props: ImageSearchPageProps) {
  const params = await props.params;
  return {
    title: `Free Stock Image ${params.keyword}`,
  };
}

export default async function ImageSearchPage(props: ImageSearchPageProps) {
  const { keyword } = await props.params;

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
