import ImageDynamic from "@/components/image/image-dynamic";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import { getPexelPhotoById } from "@/servers/pexel/pexel-server";
import { getPexelPhotoByIdEnum } from "@/servers/pexel/pexel-server-enums";
import { getImageById } from "@/servers/visage/visage-server";
import { UniversalImageType } from "@/types/visage-type";
import { destructureTheIdFromStructuredParams } from "@/utility/utils";

type ImageIdProps = {
  params: { id: string };
};

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
