import { MediaType } from "@/types/mediaType.type";

/**
 * This method will download the media
 *
 * @param link - The download link
 * @param contentId - The download content ID
 * @param contentType - The download content Type.
 */
export function handleDownloadMediaClick(
  link: string,
  contentId: string,
  contentType: MediaType,
) {
  fetch(link)
    .then((response) => response.blob()) // using the fetch API to get image as blob.
    .then((blob) => {
      const anchorElement = document.createElement("a");
      anchorElement.href = URL.createObjectURL(blob); // converting the blob (binary large object) to a URL link which can then be used as downloadable link
      if (contentType === "Image") {
        anchorElement.download = contentId.toString(); // You can set the default download name here
      }
      if (contentType === "Video") {
        anchorElement.download = contentId.toString().concat(".mp4"); // You can set the default download name here
      }
      document.body.appendChild(anchorElement);
      anchorElement.click();
      document.body.removeChild(anchorElement);
      URL.revokeObjectURL(anchorElement.href);
    })
    .catch((error) => console.error("Error downloading the image:", error));
}
