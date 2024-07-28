import CollectionsClientComponent from "@/components/profile/collections/collection-client-component";
import { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "Collection Page",
};

const CollectionPage = () => {
  return <CollectionsClientComponent />;
};

export default CollectionPage;
