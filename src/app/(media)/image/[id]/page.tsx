import ImageDynamic from "@/components/image/image-dynamic";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import NavbarWithSearchBoxMobile from "@/components/navbar/-navbar-with-search-mobile";
import { getPexelPhotoByIdEnum } from "@/enums/PexelPhoto.enum";
import { destructureTheIdFromStructuredParams } from "@/helpers/idHandler";
import { getImageById } from "@/servers/Image.server";
import { getPexelPhotoById } from "@/servers/pexel/pexelPhoto.server";
import { UniversalImageType } from "@/types/universalImage.type";

type ImageIdProps = {
  params: { id: string };
};

// or Dynamic metadata
export async function generateMetadata({ params }: ImageIdProps) {
  return {
    title: `Free Stock Image ${params.id}`,
  };
}

let universalImage: UniversalImageType;

export default async function ImageIdPage(props: ImageIdProps) {
  const {
    params: { id },
  } = props;

  const ImageId = destructureTheIdFromStructuredParams(id);

  const { failed, success } = await getPexelPhotoById(ImageId);
  const image = success?.data;
  if (image) {
    universalImage = image;
  }

  if (failed?.message === getPexelPhotoByIdEnum.NULL) {
    const { success, failed } = await getImageById(ImageId);
    if (success) {
      const image = success.data;
      universalImage = image;
    }
  }

  return (
    <>
      <NavbarWithSearch />
      <div className="w-screen">
        <NavbarWithSearchBoxMobile userId={image?.userId} />
      </div>

      <NavbarWhenScrolled threshold={70}>
        <NavbarWithSearch />
        <NavbarWithSearchBoxMobile userId={image?.userId} />
      </NavbarWhenScrolled>

      <ImageDynamic image={universalImage} />
    </>
  );
}
