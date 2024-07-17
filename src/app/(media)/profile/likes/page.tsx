import { MasonryClient } from "@/components/masonry-client";
import { UniqueImage } from "@/components/unique-image";
import { getLikedImages } from "@/servers/visage-server";

export default async function LikesPage() {
  const { failed, success } = await getLikedImages();

  const likedImages = success?.data;
  return (
    <div>
      <MasonryClient>
        {likedImages?.map((image) => (
          <UniqueImage
            key={image.id}
            image={image}
          />
        ))}
      </MasonryClient>
    </div>
  );
}
