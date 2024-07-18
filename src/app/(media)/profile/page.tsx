import Gallery from "@/components/profile/gallery";
import { getImages } from "@/servers/visage/visage-server";

export default async function GalleryPage() {
  const { failed, success } = await getImages();
  const images = success?.data;

  return <Gallery images={images} />;
}
