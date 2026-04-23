import { create } from "zustand";

type VisageScrollAreaGlobalType = {
  globalViewPort: React.RefObject<HTMLDivElement | null> | null;
  setGlobalViewPort: (viewPort: React.RefObject<HTMLDivElement | null>) => void;
};

/**
 * The globalScrollArea position gives you ability to adjust scroll position to your liking 
 * 
 * @example
 * const { globalViewPort } = useGlobalVisageScrollAreaGlobal();

  useEffect(() => {
    globalViewPort?.current?.scrollTo({ top: 0, behavior: "smooth" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  @link https://mantine.dev/core/scroll-area/#scroll-to-position
 */
export const useGlobalVisageScrollAreaGlobal =
  create<VisageScrollAreaGlobalType>((set) => ({
    globalViewPort: null,
    setGlobalViewPort: (value) => set({ globalViewPort: value }),
  }));
