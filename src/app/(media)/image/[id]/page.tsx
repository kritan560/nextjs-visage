import ImageDynamic from "@/components/image/image-dynamic";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import { getPexelPhotoById } from "@/servers/pexel/pexelPhoto.server";
import { getPexelPhotoByIdEnum } from "@/enums/PexelPhoto.enum";
import { getImageById } from "@/servers/Image.server";
import { UniversalImageType } from "@/types/universalImage.type";
import { destructureTheIdFromStructuredParams } from "@/helpers/idHandler";

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

      <NavbarWhenScrolled threshold={70}>
        <NavbarWithSearch />
      </NavbarWhenScrolled>

      <ImageDynamic image={universalImage} />
    </>
  );
}
