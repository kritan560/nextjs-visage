import { MasonryClient } from "@/components/masonry/masonry-client";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import EditCollectionDialog from "@/components/profile/collections/edit-collection-dialog";
import AdjustPadding from "@/components/shared/adjust-padding";
import { UniqueImage } from "@/components/shared/unique-image";
import { UniqueVideo } from "@/components/shared/unique-video";
import { AuthFailedEnum } from "@/enums/authentication-server-enums";
import {
  LinkCollections,
  LinkLoginPage,
  LinkProfile,
} from "@/links/visage-links";
import { getCurrentUser } from "@/servers/Authentication.server";

import { GetCollectionNameByIdEnum } from "@/enums/CollectionName.enum";
import { getCollectionNameById } from "@/servers/CollectionName.server";
import { UniversalImagesType } from "@/types/universalImage.type";
import { UniversalVideosType } from "@/types/universalVideo.type";
import { Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PiVideoLight } from "react-icons/pi";
import { Metadata } from "next";

type CollectionIdPageProps = {
  params: { collection_id: string };
};

export const metadata: Metadata = {
  title: `Unique Collection`,
};

export default async function CollectionIdPage(props: CollectionIdPageProps) {
  const {
    params: { collection_id },
  } = props;
  const { failed, success: collectionNameByIdSuccess } =
    await getCollectionNameById(collection_id);

  if (failed) {
    if (failed.message == AuthFailedEnum.USER_NOT_LOGGED_IN) {
      redirect(LinkLoginPage);
    }
  }

  if (
    collectionNameByIdSuccess?.message ===
    GetCollectionNameByIdEnum.COLLECTION_NOT_FOUND
  ) {
    redirect(LinkCollections);
  }

  const { userName, profilePic } = await getCurrentUser();

  const totalCollectedImages =
    collectionNameByIdSuccess?.data?.collectionImages.length ?? 0;
  const totalCollectedVideos =
    collectionNameByIdSuccess?.data?.collectionVideos.length ?? 0;

  return (
    <>
      <NavbarWithSearch />

      {/* editicon */}
      <div className="mt-12 flex flex-col items-center justify-center space-y-8">
        <EditCollectionDialog
          collectionId={collection_id}
          collectionName={collectionNameByIdSuccess?.data?.collectionName}
        />

        {/* collection name */}
        <h1 className="text-5xl font-semibold">
          {collectionNameByIdSuccess?.data?.collectionName}
        </h1>
      </div>

      <NavbarWhenScrolled threshold={100}>
        <NavbarWithSearch />
      </NavbarWhenScrolled>

      <AdjustPadding className="mt-8 space-y-8">
        {/* userimage ---- photos/videos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <Image
              src={profilePic ?? ""}
              className="rounded-full"
              alt=""
              height={49}
              width={49}
            />
            <Link
              href={LinkProfile}
              className="border-b-2 border-dashed border-visage-600 text-2xl font-semibold text-visage-600"
            >
              {userName}
            </Link>
          </div>

          <div className="flex flex-col items-start justify-center gap-x-2 text-xl font-medium text-stone-400">
            <div className="flex items-center gap-x-2">
              <Images size={25} />
              {totalCollectedImages}
              <span>Images</span>
            </div>
            <div className="flex items-center gap-x-2">
              <PiVideoLight strokeWidth={4} size={27} />
              {totalCollectedVideos}
              <span>Videos</span>
            </div>
          </div>
        </div>

        <MasonryClient>
          {(
            collectionNameByIdSuccess?.data
              ?.collectionImages as UniversalImagesType
          ).map((data) => (
            <UniqueImage key={data.id} image={data} />
          ))}
          {(
            collectionNameByIdSuccess?.data
              ?.collectionVideos as UniversalVideosType["videos"]
          ).map((data) => (
            <UniqueVideo key={data.id} video={data} />
          ))}
        </MasonryClient>
      </AdjustPadding>
    </>
  );
}
