export function ManipulateCloudinaryURL(
  url: string,
  width: number,
  height?: number,
  orientation?: "potrait" | "landscape" | null,
  customSize?: boolean,
) {
  //   let url =
  //     "https://res.cloudinary.com/dueo0pswo/image/upload/v1721641705/zhdwu1dqb8cdjxnrr2m9.jpg";

  const splicCharacter = "/image/upload/";
  const urls = url.split(splicCharacter);

  let formattedURL = urls[0]
    .concat(splicCharacter)
    .concat(`c_scale,w_${width}/`)
    .concat(urls[1]);

  if (orientation === "potrait") {
    return (formattedURL = urls[0]
      .concat(splicCharacter)
      .concat(`c_scale,w_${width / 2},h_${height}/`)
      .concat(urls[1]));
  }
  if (orientation === "landscape") {
    return (formattedURL = urls[0]
      .concat(splicCharacter)
      .concat(`c_scale,w_${width},h_${height && height / 2}/`)
      .concat(urls[1]));
  }
  if (customSize) {
    return (formattedURL = urls[0]
      .concat(splicCharacter)
      .concat(`c_scale,w_${width},h_${height}/`)
      .concat(urls[1]));
  }

  return formattedURL;
}
