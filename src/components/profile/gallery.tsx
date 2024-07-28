"use client";

import { UniversalImagesType } from "@/types/universalImage.type";
import { MasonryClient } from "../masonry/masonry-client";
import { UniqueImage } from "../shared/unique-image";

type GalleryProps = {
  images: UniversalImagesType | undefined;
};

const Gallery = (props: GalleryProps) => {
  const { images } = props;

  return (
    <MasonryClient>
      {images?.map((img) => <UniqueImage key={img.id} image={img} />)}
    </MasonryClient>
  );
};

export default Gallery;
