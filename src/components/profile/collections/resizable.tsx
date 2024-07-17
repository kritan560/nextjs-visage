import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { UniversalImagesType } from "@/types/visage-type";
import Image from "next/image";

type CollectionImageResizableProps = {
  images: UniversalImagesType;
};

export function CollectionImageResizable(props: CollectionImageResizableProps) {
  const { images } = props;

  if (images.length <= 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center relative">
            <Image
              src={images[0].src.medium}
              alt=""
              fill
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
        className="max-w-md rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center mr-1 relative">
            <Image
              src={images[0].src.medium}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </ResizablePanel>

        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center ml-1 relative">
            <Image
              src={images[1].src.medium}
              alt=""
              fill
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
        className="max-w-md rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center mr-2 relative">
            <Image
              src={images[images.length - 3].src.medium}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </ResizablePanel>

        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center relative">
                <Image
                  src={images[images.length - 2].src.medium}
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </ResizablePanel>

            <ResizablePanel defaultSize={50}>
              <div className="flex h-full mt-2 items-center justify-center relative">
                <Image
                  src={images[images.length - 1].src.medium}
                  alt=""
                  fill
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
