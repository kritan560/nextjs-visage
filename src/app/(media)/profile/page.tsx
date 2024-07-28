import Gallery from "@/components/profile/gallery";
import { getImages } from "@/servers/Image.server";
import { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "profile page",
};

export default async function GalleryPage() {
  const { failed, success } = await getImages();
  const images = success?.data;

  return <Gallery images={images} />;
}
