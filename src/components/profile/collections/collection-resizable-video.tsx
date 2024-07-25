import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { UniversalVideosType } from "@/types/visage-type";
import Image from "next/image";

type CollectionVideoResizableProps = {
  videos: UniversalVideosType["videos"];
  gapSize?: "sm" | "base";
};

export function CollectionVideoResizable(props: CollectionVideoResizableProps) {
  const { videos, gapSize = "base" } = props;

  if (videos.length <= 0) {
    return null;
  }

  if (videos.length === 1) {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-80 w-80 rounded-lg border"
      >
        <ResizablePanel defaultSize={100}>
          <div className="relative flex h-full items-center justify-center">
            <Image
              src={videos[0].image}
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

  if (videos.length <= 2 && videos.length >= 1) {
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
              src={videos[0].image}
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
              src={videos[1].image}
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

  if ((videos.length <= 3 && videos.length >= 1) || videos.length > 3) {
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
              src={videos[videos.length - 3].image}
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
                  src={videos[videos.length - 2].image}
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
                  src={videos[videos.length - 1].image}
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
