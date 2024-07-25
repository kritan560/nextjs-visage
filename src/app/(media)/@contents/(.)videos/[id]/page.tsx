import VideoDynamicInterception from "@/components/search/videos/video-dynamic-interception";
import { getPexelVideoById } from "@/servers/pexel/pexel-server";
import { destructureTheIdFromStructuredParams } from "@/utility/utils";
import React from "react";

type VideoDynamicInterceptionProps = {
  params: { id: string };
};

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
    return (
      <div>
        <VideoDynamicInterception video={video} />
      </div>
    );
  }
  return null;
};

export default VideosDynamicInterceptionPage;
