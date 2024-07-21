"use server";

import AdjustPadding from "@/components/shared/adjust-padding";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearchBox from "@/components/navbar/-navbar-with-search";
import ImageSearch from "@/components/search/images/image-search";
import { getPexelPhotoByKeyword } from "@/servers/pexel/pexel-server";
import { getImagesByTags } from "@/servers/visage/visage-server";
import { UniversalImagesType } from "@/types/visage-type";

type ImageSearchPageProps = {
  params: { keyword: string };
};

export default async function ImageSearchPage(props: ImageSearchPageProps) {
  const {
    params: { keyword },
  } = props;

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
