import VideoDynamicInterception from "@/components/search/videos/video-dynamic-interception";
import { destructureTheIdFromStructuredParams } from "@/helpers/idHandler";
import { getPexelVideoById } from "@/servers/pexel/pexelVideo.server";
import React from "react";

type VideoDynamicInterceptionProps = {
  params: Promise<{ id: string }>;
};

// or Dynamic metadata
export async function generateMetadata(props: VideoDynamicInterceptionProps) {
  const params = await props.params;
  return {
    title: `Free Stock Video ${params.id}`,
  };
}

const VideosDynamicInterceptionPage = async (
  props: VideoDynamicInterceptionProps,
) => {
  const { id } = await props.params;

  const videoId = destructureTheIdFromStructuredParams(id);

  const { failed, success } = await getPexelVideoById(videoId);
  const video = success?.data;

  if (video) {
    return <VideoDynamicInterception video={video} />;
  }

  return <></>;
};

export default VideosDynamicInterceptionPage;
