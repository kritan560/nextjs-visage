import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import VideoDynamic from "@/components/search/videos/video-dynamic";
import { destructureTheIdFromStructuredParams } from "@/helpers/idHandler";
import { getPexelVideoById } from "@/servers/pexel/pexelVideo.server";

type VideoIdProps = {
  params: Promise<{ id: string }>;
};

// or Dynamic metadata
export async function generateMetadata(props: VideoIdProps) {
  const params = await props.params;
  return {
    title: `Free Stock Video ${params.id}`,
  };
}

export default async function VideoIdPage(props: VideoIdProps) {
  const { id } = await props.params;

  const videoId = destructureTheIdFromStructuredParams(id);

  const { failed, success } = await getPexelVideoById(videoId);
  const video = success?.data;

  if (video) {
    return (
      <>
        <NavbarWithSearch />

        <NavbarWhenScrolled threshold={70}>
          <NavbarWithSearch />
        </NavbarWhenScrolled>

        <VideoDynamic video={video} />
      </>
    );
  }
  return <></>;
}
