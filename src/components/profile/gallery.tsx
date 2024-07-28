"use client";

import { UniversalImagesType } from "@/types/universalImage.type";
import NoMediaContent from "./no-media-content";
import { MasonryClient } from "../masonry/masonry-client";
import { UniqueImage } from "../shared/unique-image";

type GalleryProps = {
  images: UniversalImagesType | undefined;
};

const Gallery = (props: GalleryProps) => {
  const { images } = props;

  if (images && images?.length <= 0) {
    return (
      <NoMediaContent
        heading="You don't have any content yet 🙁"
        message="It's ok, we know it's probably hard to choose what to upload
        from all your amazing photos. You can come back and upload at any time.
        In the meantime, how about some inspiration from the talented
        photographers on Visage?"
      />
    );
  }

  return (
    <MasonryClient>
      {images?.map((img) => <UniqueImage key={img.id} image={img} />)}
    </MasonryClient>
  );
};

export default Gallery;
