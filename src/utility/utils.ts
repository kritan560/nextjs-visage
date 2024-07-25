import { TruncatePhotgrapherNameCharacterLimit } from "@/constants/constants";
import { MediaType } from "@/types/visage-type";

/**
 * Truncate the name of photographer that has length greater than 15
 * @param photographerName string
 * @param truncateLength number
 * @default truncateLength 15
 * @returns string
 */
export function TruncatePhotgrapherName(photographerName: string) {
  if (photographerName.length > TruncatePhotgrapherNameCharacterLimit) {
    const truncatedName = photographerName
      .slice(0, TruncatePhotgrapherNameCharacterLimit)
      .concat("...");

    return truncatedName;
  }

  return photographerName;
}

export function StructureTheImageParam(
  imageId: number | string,
  imageAlt: string | null,
) {
  const whatIsAnImage = [
    "captures the soul of a moment",

    "a silent storyteller",

    "pexel holds a piece of the artist's heart",

    "dance of perception and reality",

    "timeless portal",

    "symphony of colors",

    "delicate dance between light and shadow",

    "window to the artist's inner world",

    "silent dialogue between the creator and the observer",

    "frozen fragment of time",

    "mystical journey through the realms of imagination",

    "bridge between the past and the present",

    "testament to the power of creativity",
  ];

  const randomDigit = Math.ceil(Math.random() * (whatIsAnImage.length - 1));

  let alt =
    imageAlt ??
    "visual representation of an object scene person or abstract concept";

  if (imageAlt == "") {
    alt = whatIsAnImage[randomDigit];
  }

  const newStructuredImageParams = alt
    .replaceAll(" ", "-")
    .replaceAll(",", "")
    .concat("-")
    .concat(String(imageId));

  return newStructuredImageParams;
}

export function destructureTheIdFromStructuredParams(structuredParam: string) {
  const destructuredId = structuredParam.split("-").pop() ?? "";

  return destructuredId;
}

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

export function capitalize(value: string) {
  // const splitAtSpace = value.
  function capitalizeFirstLetter(str: string) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
  return capitalizeFirstLetter(value);
}
