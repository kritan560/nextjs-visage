import DeleteAccountClientComponent from "@/components/delete-account/delete-account-client-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account Page",
};

type DeleteAccountPageProps = {
  params: Promise<{ id: string }>;
};

const DeleteAccountPage = async (props: DeleteAccountPageProps) => {
  const { id } = await props.params;

  return <DeleteAccountClientComponent id={id} />;
};

export default DeleteAccountPage;
