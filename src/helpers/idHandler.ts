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
