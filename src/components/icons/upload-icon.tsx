import { FaRegImage } from "react-icons/fa";
import { IoImageSharp } from "react-icons/io5";

const UploadIcon = () => {
  return (
    <div className="relative">
      <IoImageSharp
        className="relative top-0 z-[2] rounded-3xl fill-visage-400"
        size={130}
      />
      {/* this div is used as background between the main and side Icons */}
      <div className="absolute bottom-1/2 left-1/2 z-[1] aspect-square h-[98px] -translate-x-1/2 translate-y-1/2 bg-white dark:bg-black"></div>

      {/* scale-x-[-1] is for filp horizontal */}
      <FaRegImage
        className="absolute bottom-1/2 left-[85%] z-0 translate-y-1/2 rotate-[31deg] scale-x-[-1] fill-visage-400"
        size={85}
      />

      <FaRegImage
        className="absolute bottom-1/2 right-[85%] z-0 translate-y-1/2 -rotate-[31deg] fill-visage-400"
        size={85}
      />
    </div>
  );
};

export default UploadIcon;
