import ImageDynamicInterception from "@/components/image/image-dynamic-interception";
import { getPexelPhotoById } from "@/servers/pexel-server";
import { getPexelPhotoByIdEnum } from "@/servers/pexel-server-enums";
import { getImageById } from "@/servers/visage-server";
import { UniversalImageType } from "@/types/visage-type";
import { destructureTheIdFromStructuredParams } from "@/utility/utils";

type ImageInterceptionRoutePageProps = {
  params: { id: string };
};

let universalImage: UniversalImageType;

export default async function ImageInterceptionRoutePage(
  props: ImageInterceptionRoutePageProps
) {
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

  return <ImageDynamicInterception image={universalImage} />;
}
