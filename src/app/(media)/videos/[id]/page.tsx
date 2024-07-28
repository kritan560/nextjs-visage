import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import VideoDynamic from "@/components/search/videos/video-dynamic";
import { getPexelVideoById } from "@/servers/pexel/pexelVideo.server";
import { destructureTheIdFromStructuredParams } from "@/helpers/idHandler";

type VideoIdProps = {
  params: { id: string };
};

// or Dynamic metadata
export async function generateMetadata({ params }: VideoIdProps) {
  return {
    title: `Free Stock Video ${params.id}`,
  };
}

export default async function VideoIdPage(props: VideoIdProps) {
  const {
    params: { id },
  } = props;

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
