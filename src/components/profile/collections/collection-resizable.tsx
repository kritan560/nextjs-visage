import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import Image from "next/image";

type CollectionImageResizableProps = {
  images: string[];
  gapSize?: "sm" | "base";
};

export function CollectionImageResizable(props: CollectionImageResizableProps) {
  const { images, gapSize = "base" } = props;

  if (images.length <= 0) {
    return <div className="h-44 w-44 md:h-80 md:w-80"></div>;
  }

  if (images.length === 1) {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-44 w-44 rounded-lg border md:h-80 md:w-80"
      >
        <ResizablePanel defaultSize={100}>
          <div className="relative flex h-full items-center justify-center">
            <Image
              src={images[0]}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  if (images.length <= 2 && images.length >= 1) {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div
            className={cn(
              "relative flex h-full items-center justify-center",
              gapSize === "sm" ? "mr-[1px]" : "mr-1",
            )}
          >
            <Image
              src={images[0]}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle className="pointer-events-none" />

        <ResizablePanel defaultSize={50}>
          <div
            className={cn(
              "relative flex h-full items-center justify-center",
              gapSize === "sm" ? "ml-[1px]" : "ml-1",
            )}
          >
            <Image
              src={images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  if ((images.length <= 3 && images.length >= 1) || images.length > 3) {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div
            className={cn(
              "relative flex h-full items-center justify-center",
              gapSize === "sm" ? "mr-[2px]" : "mr-2",
            )}
          >
            <Image
              src={images[images.length - 3]}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle className="pointer-events-none" />

        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <div className="relative flex h-full items-center justify-center">
                <Image
                  src={images[images.length - 2]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle className="pointer-events-none" />

            <ResizablePanel defaultSize={50}>
              <div
                className={cn(
                  "relative flex h-full items-center justify-center",
                  gapSize === "sm" ? "mt-[2px]" : "mt-2",
                )}
              >
                <Image
                  src={images[images.length - 1]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
}
