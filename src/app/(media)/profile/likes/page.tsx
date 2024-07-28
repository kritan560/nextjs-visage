import { MasonryClient } from "@/components/masonry/masonry-client";
import { UniqueImage } from "@/components/shared/unique-image";
import { UniqueVideo } from "@/components/shared/unique-video";
import { getLikedImages } from "@/servers/LikeImage.server";
import { getLikedVideos } from "@/servers/LikeVideo.server";
import { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "Likes page",
};

export default async function LikesPage() {
  const { failed, success } = await getLikedImages();
  const { success: successGetLikedVideos } = await getLikedVideos();

  const likedImages = success?.data;
  const likedVideos = successGetLikedVideos?.data;

  return (
    <>
      <MasonryClient>
        {likedImages?.map((image) => (
          <UniqueImage key={image.id} image={image} />
        ))}
        {likedVideos?.map((video) => (
          <UniqueVideo key={video.id} video={video} />
        ))}
      </MasonryClient>
    </>
  );
}
