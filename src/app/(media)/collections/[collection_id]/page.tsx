import AdjustPadding from "@/components/adjust-padding";
import { MasonryClient } from "@/components/masonry-client";
import { NavbarWhenScrolled } from "@/components/navbar/-navbar-when-scrolled";
import NavbarWithSearch from "@/components/navbar/-navbar-with-search";
import EditCollectionDialog from "@/components/profile/collections/edit-collection-dialog";
import { UniqueImage } from "@/components/unique-image";
import { LinkCollections, LinkProfile } from "@/links/links";
import { getCurrentUser } from "@/servers/authentication-server";
import { getCollectionNameById } from "@/servers/visage-server";
import { getCollectionNameByIdEnum } from "@/servers/visage-server-enum";
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
    getCollectionNameByIdEnum.COLLECTION_NOT_FOUND
  ) {
    redirect(LinkCollections);
  }

  const { userName, profilePicture } = await getCurrentUser();

  return (
    <div className="">
      <NavbarWithSearch />

      {/* editicon */}
      <div className="flex flex-col space-y-8 mt-12 justify-center items-center">
        <EditCollectionDialog
          collectionId={collection_id}
          collectionName={collectionNameByIdSuccess?.data?.collectionName}
        />

        {/* collection name */}
        <h1 className="font-semibold text-5xl">
          {collectionNameByIdSuccess?.data?.collectionName}
        </h1>
      </div>

      <NavbarWhenScrolled threshold={100}>
        <NavbarWithSearch />
      </NavbarWhenScrolled>

      <AdjustPadding className="space-y-8 mt-8">
        {/* userimage ---- photos/videos */}
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <Image
              src={profilePicture ?? ""}
              className="rounded-full"
              alt=""
              height={49}
              width={49}
            />
            <Link
              href={LinkProfile}
              className="font-semibold text-2xl text-visage-600 border-b-2 border-dashed border-visage-600">
              {userName}
            </Link>
          </div>

          <div className="text-stone-400 font-medium text-xl flex gap-x-2 items-center">
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
            <UniqueImage
              key={data.id}
              image={data}
            />
          ))}
        </MasonryClient>
      </AdjustPadding>
    </div>
  );
}
