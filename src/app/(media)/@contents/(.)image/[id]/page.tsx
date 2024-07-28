import ImageDynamicInterception from "@/components/image/image-dynamic-interception";
import { getPexelPhotoById } from "@/servers/pexel/pexelPhoto.server";
import { getPexelPhotoByIdEnum } from "@/enums/pexel-server-enums";
import { getImageById } from "@/servers/Image.server";
import { UniversalImageType } from "@/types/universalImage.type";
import { destructureTheIdFromStructuredParams } from "@/helpers/idHandler";

type ImageInterceptionRoutePageProps = {
  params: { id: string };
};

// or Dynamic metadata
export async function generateMetadata({
  params,
}: ImageInterceptionRoutePageProps) {
  return {
    title: `Free Stock Image ${params.id}`,
  };
}

let universalImage: UniversalImageType;

export default async function ImageInterceptionRoutePage(
  props: ImageInterceptionRoutePageProps,
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
