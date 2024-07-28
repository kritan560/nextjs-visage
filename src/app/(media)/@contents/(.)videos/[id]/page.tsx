import VideoDynamicInterception from "@/components/search/videos/video-dynamic-interception";
import { getPexelVideoById } from "@/servers/pexel/pexelVideo.server";
import { destructureTheIdFromStructuredParams } from "@/helpers/idHandler";
import React from "react";

type VideoDynamicInterceptionProps = {
  params: { id: string };
};

// or Dynamic metadata
export async function generateMetadata({
  params,
}: VideoDynamicInterceptionProps) {
  return {
    title: `Free Stock Video ${params.id}`,
  };
}

const VideosDynamicInterceptionPage = async (
  props: VideoDynamicInterceptionProps,
) => {
  const {
    params: { id },
  } = props;

  const videoId = destructureTheIdFromStructuredParams(id);

  const { failed, success } = await getPexelVideoById(videoId);
  const video = success?.data;

  if (video) {
    return <VideoDynamicInterception video={video} />;
  }

  return <></>;
};

export default VideosDynamicInterceptionPage;
