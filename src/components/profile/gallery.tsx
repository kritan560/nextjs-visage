"use client";

import { UniversalImagesType } from "@/types/visage-type";
import { MasonryClient } from "../masonry-client";
import { UniqueImage } from "../unique-image";

type GalleryProps = {
  images: UniversalImagesType | undefined;
};

const Gallery = (props: GalleryProps) => {
  const { images } = props;

  return (
    <MasonryClient>
      {images?.map((img) => (
        <UniqueImage
          key={img.id}
          image={img}
        />
      ))}
    </MasonryClient>
  );
};

export default Gallery;
