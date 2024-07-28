import { MasonryClient } from "@/components/masonry/masonry-client";
import NoMediaContent from "@/components/profile/no-media-content";
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

  const totalContent = (likedImages?.length ?? 0) + (likedVideos?.length ?? 0);

  if (totalContent <= 0) {
    return (
      <NoMediaContent
        heading="You haven't liked any content yet 🙁"
        message="It's ok, we know it's probably hard to like what you see
    from all your amazing photos. You can come back and like at any time.
    In the meantime, how about some amazing content from the talented
    photographers on Visage?"
      />
    );
  }

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
