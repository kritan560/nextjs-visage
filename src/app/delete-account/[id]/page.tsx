import DeleteAccountClientComponent from "@/components/delete-account/delete-account-client-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account Page",
};

type DeleteAccountPageProps = {
  params: { id: string };
};

const DeleteAccountPage = (props: DeleteAccountPageProps) => {
  const {
    params: { id },
  } = props;
  return <DeleteAccountClientComponent id={id} />;
};

export default DeleteAccountPage;
