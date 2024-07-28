"use client";

import Scroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { UniversalImagesType } from "@/types/universalImage.type";

type JoinRandomImagesProps = {
  images: UniversalImagesType | null;
};

export function JoinRandomImages(props: JoinRandomImagesProps) {
  const { images } = props;

  const imagesCollection = images ?? [
    {
      src: {
        large:
          "https://images.pexels.com/photos/25976674/pexels-photo-25976674.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      },
      photographer: "Kritan Shrestha",
    },
  ];

  const plugin = React.useRef(
    Scroll({
      active: true,
      speed: 1,
      stopOnInteraction: false,
      stopOnFocusIn: false,
      stopOnMouseEnter: false,
      direction: "forward",
      playOnInit: true,
      startDelay: 4000,
    }),
  );

  return (
    <Carousel plugins={[plugin.current]} className="pointer-events-none">
      <CarouselContent className="">
        {imagesCollection.map((_, index) => (
          <CarouselItem className="" key={index}>
            <Card className="border-none">
              <CardContent className="relative h-[724px] w-full rounded-2xl p-0">
                <Image
                  src={_.src.large.toString()}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  alt=""
                  className="h-screen rounded-2xl"
                />
                <p className="absolute bottom-6 right-6 text-sm font-semibold text-white">
                  Photgraphed by {_.photographer}
                </p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
