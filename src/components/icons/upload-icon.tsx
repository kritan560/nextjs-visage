import { FaRegImage } from "react-icons/fa";
import { IoImageSharp } from "react-icons/io5";

const UploadIcon = () => {
  return (
    <div className="relative">
      <IoImageSharp
        className="z-[2] rounded-3xl relative top-0 fill-visage-400"
        size={130}
      />
      {/* this div is used as background between the main and side Icons */}
      <div className="h-[98px] aspect-square z-[1] bg-white absolute  bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2"></div>

      {/* scale-x-[-1] is for filp horizontal */}
      <FaRegImage
        className="z-0 scale-x-[-1] absolute fill-visage-400 rotate-[31deg] left-[85%] bottom-1/2 translate-y-1/2"
        size={85}
      />

      <FaRegImage
        className="absolute z-0 -rotate-[31deg] right-[85%] fill-visage-400 bottom-1/2 translate-y-1/2"
        size={85}
      />
    </div>
  );
};

export default UploadIcon;
