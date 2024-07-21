import { MasonryClient } from "@/components/masonry/masonry-client";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import EditCollectionDialog from "@/components/profile/collections/edit-collection-dialog";
import AdjustPadding from "@/components/shared/adjust-padding";
import { UniqueImage } from "@/components/shared/unique-image";
import { LinkCollections, LinkProfile } from "@/links/links";
import { getCurrentUser } from "@/servers/authentication/authentication-server";
import { getCollectionNameById } from "@/servers/visage/visage-server";
import { GetCollectionNameByIdEnum } from "@/servers/visage/visage-server-enum";
import { UniversalImagesType } from "@/types/visage-type";
import { Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type CollectionIdPageProps = {
  params: { collection_id: string };
};

export default async function CollectionIdPage(props: CollectionIdPageProps) {
  const {
    params: { collection_id },
  } = props;
  const { failed, success: collectionNameByIdSuccess } =
    await getCollectionNameById(collection_id);

  if (
    collectionNameByIdSuccess?.message ===
    GetCollectionNameByIdEnum.COLLECTION_NOT_FOUND
  ) {
    redirect(LinkCollections);
  }

  const { userName, profilePicture } = await getCurrentUser();

  return (
    <div className="">
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
              src={profilePicture ?? ""}
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

          <div className="flex items-center gap-x-2 text-xl font-medium text-stone-400">
            <Images size={25} />
            {collectionNameByIdSuccess?.data?.collectionImages.length}
            <span>Contents</span>
          </div>
        </div>

        <MasonryClient>
          {(
            collectionNameByIdSuccess?.data
              ?.collectionImages as UniversalImagesType
          ).map((data) => (
            <UniqueImage key={data.id} image={data} />
          ))}
        </MasonryClient>
      </AdjustPadding>
    </div>
  );
}
