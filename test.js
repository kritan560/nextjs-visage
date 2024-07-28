let url =
  "https://res.cloudinary.com/dueo0pswo/image/upload/v1721641705/zhdwu1dqb8cdjxnrr2m9.jpg";

const splicCharacter = "/image/upload/";
const urls = url.split(splicCharacter);

const formattedURL = urls[0]
  .concat(splicCharacter)
  .concat(`c_scale,w_${150}/`)
  .concat(urls[1]);
