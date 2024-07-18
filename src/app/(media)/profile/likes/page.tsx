import { MasonryClient } from "@/components/masonry/masonry-client";
import { UniqueImage } from "@/components/shared/unique-image";
import { getLikedImages } from "@/servers/visage/visage-server";

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
