"use client";

import { useGlobalCollectionNameStore } from "@/global-states/visage-image-state";
import { cn } from "@/lib/utils";
import {
  ImageOrVideoSearchKeywordSchema,
  ImageOrVideoSearchKeywordSchemaType,
} from "@/schemas/schemas";
import { getCurrentUserId } from "@/servers/authentication/authentication-server";
import { UniversalImagesType, UniversalVideosType } from "@/types/visage-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Image as LucideImage, Search, Video } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CollectionImageResizable } from "../profile/collections/collection-resizable";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CollectionVideoResizable } from "../profile/collections/collection-resizable-video";

const searchedKeyword = "searchedKeyword";

const IconSize: number = 21;

// if in future need to display more element just add the object in array
const onHoverDisplayElement: onHoverDisplayElementsType = [
  {
    elementName: "Image",
    element: (
      <div
        className={
          "flex h-10 cursor-pointer items-center gap-x-2 text-base font-semibold"
        }
      >
        <LucideImage size={IconSize} />
        <p>Image</p>
      </div>
    ),
  },
  {
    elementName: "Video",
    element: (
      <div
        className={
          "flex h-10 cursor-pointer items-center gap-x-2 text-base font-semibold"
        }
      >
        <Video size={IconSize} />
        <p>Video</p>
      </div>
    ),
  },
];

type MediaType = "Image" | "Video";

type onHoverDisplayElementsType = {
  elementName: MediaType;
  element: JSX.Element;
}[];

type ImageOrVideoSearchType = {
  border?: boolean;
  userId: string | undefined;
  grid?: 3 | 4;
};

const ImageSearchVideo2 = (props: ImageOrVideoSearchType) => {
  const { border, userId, grid = 4 } = props;

  const router = useRouter();
  const pathname = usePathname();
  const [openPopOver, setOpenPopOver] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const [keywords, setKeywords] = useState<string[] | null>([]);
  const [hoverElement, setHoverElement] = useState(onHoverDisplayElement[0]);
  const { globalCollectionNames } = useGlobalCollectionNameStore();
  const hasCollection =
    globalCollectionNames
      ?.map((collectionName) => collectionName.collectionImages)
      .reduce((prev, current) => prev + current.length, 0) ?? 0;

  // accessibility features. (escape key press / click elsewhere to close popover)
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      setOpenPopOver(false);
    }
  }

  function handleClickEvent(e: MouseEvent) {
    if (!inputRef.current?.contains(e.target as Node)) {
      setOpenPopOver(false);
    }
  }

  useEffect(() => {
    const words = localStorage.getItem(searchedKeyword);

    if (words) {
      const stringArrays = JSON.parse(words) as string[];
      setKeywords(stringArrays);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => handleKeyDown(e));
    document.addEventListener("click", handleClickEvent);

    return document.removeEventListener("keydown", (e) => handleKeyDown(e));
  }, []);

  useEffect(() => {
    if (pathname.includes("/video")) {
      const videoElement = onHoverDisplayElement.find(
        (ele) => ele.elementName === "Video",
      );
      if (videoElement) {
        setHoverElement(videoElement);
      }
    }
  }, [pathname]);

  function handleClearClick() {
    localStorage.removeItem(searchedKeyword);
    setKeywords([]);
  }

  function handleElementClick(element: onHoverDisplayElementsType[0]) {
    setHoverElement(element);
  }

  const form = useForm<ImageOrVideoSearchKeywordSchemaType>({
    resolver: zodResolver(ImageOrVideoSearchKeywordSchema),
    defaultValues: {
      searchedKeyword: "",
    },
  });

  async function onSubmit(values: ImageOrVideoSearchKeywordSchemaType) {
    if (hoverElement.elementName === "Video") {
      router.push(`/search/videos/${values.searchedKeyword}`);
    }

    if (hoverElement.elementName == "Image") {
      router.push(`/search/images/${values.searchedKeyword}`);
    }

    nProgress.start();

    const { isUserAuthenticated } = await getCurrentUserId();
    if (!isUserAuthenticated) {
      return;
    }
    // the logic is: to add array to localstorage.
    const getItem = localStorage.getItem(searchedKeyword);

    if (getItem) {
      const lsSearchedKeyword = JSON.parse(getItem) as string[];
      const lsSearchedKeywordLowerCase = lsSearchedKeyword.map((keyword) =>
        keyword.toLowerCase(),
      );

      if (
        !lsSearchedKeywordLowerCase.includes(
          values.searchedKeyword.toLowerCase(),
        )
      ) {
        lsSearchedKeyword.push(values.searchedKeyword);

        const stringifyLsSearchedKeyword = JSON.stringify(lsSearchedKeyword);
        localStorage.setItem(searchedKeyword, stringifyLsSearchedKeyword);
        setKeywords(lsSearchedKeyword);
      }
    }

    if (!getItem) {
      const searchedKeywordStringify = JSON.stringify([values.searchedKeyword]);
      localStorage.setItem(searchedKeyword, searchedKeywordStringify);
      setKeywords([values.searchedKeyword]);
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "relative z-10 flex h-12 items-center rounded-md bg-white dark:bg-black dark:text-stone-50",
          border ? "bg-white" : "bg-stone-100",
          openPopOver && "bg-white ring-1 ring-stone-300",
        )}
        ref={inputRef}
      >
        {" "}
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "group mx-1 flex w-32 items-center justify-center rounded-md px-4",
                border &&
                  "border border-stone-400 bg-stone-200 dark:bg-stone-900",
              )}
            >
              {hoverElement?.element}

              <div className="ml-2 transition duration-300 group-hover:rotate-180">
                <ChevronDown size={17} />
              </div>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            className="-ml-1 mt-[2px] w-fit p-0 py-2"
            align="start"
          >
            <div className="flex flex-col">
              {onHoverDisplayElement.map((element) => (
                <div
                  key={element.elementName}
                  onClick={() => handleElementClick(element)}
                  className={cn(
                    "flex justify-center px-7 hover:bg-stone-200 dark:hover:bg-stone-800",
                    hoverElement?.elementName == element.elementName &&
                      "text-visage-600",
                  )}
                >
                  {element.element}
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
        {!border && (
          <Separator orientation="vertical" className="h-9 bg-stone-300" />
        )}
        <div className="flex-grow">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center"
            >
              <FormField
                control={form.control}
                name="searchedKeyword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="off"
                        maxLength={40}
                        onClick={() => {
                          if (!!userId) {
                            setOpenPopOver(!openPopOver);
                          }
                        }}
                        type="text"
                        className={cn(
                          "border-none bg-white pl-4 text-lg ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-black",
                          !border && "bg-slate-100",
                          openPopOver && "bg-white",
                        )}
                        placeholder={`Search for free ${hoverElement?.elementName}`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator orientation="vertical" className="h-9 bg-stone-300" />
              <Button
                type="submit"
                variant={"ghost"}
                className="cursor-pointer transition hover:text-visage-600"
              >
                <Search type="submit" strokeWidth={2.4} size={20} />
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div
        className={cn(
          "absolute top-0 w-full rounded-md bg-white dark:bg-black",
          openPopOver ? "visible z-[7] ring-1 ring-stone-300" : "invisible",
        )}
      >
        <ScrollArea
          className={cn(
            "mt-10 p-4",
            hasCollection > 0
              ? hasCollection > 2
                ? "h-96"
                : "h-[272px]"
              : "h-fit",
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-stone-800 dark:text-stone-400">
              Recent Searches
            </p>
            <Button
              variant={"link"}
              className="text-base"
              onClick={handleClearClick}
            >
              Clear
            </Button>
          </div>
          <div
            className={cn(
              "grid gap-3",
              grid === 3 && "grid-cols-3",
              grid === 4 && "grid-cols-4",
            )}
          >
            {keywords?.map((keyword, index) => (
              <Link
                href={`/search/images/${keyword}`}
                key={index}
                className="rounded-md border bg-white text-base font-medium transition hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-600"
              >
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex h-12 items-center justify-center px-2">
                        <div className="w-[90%] truncate">{keyword}</div>
                        <Search
                          className="m-0 h-5 w-5 flex-1 p-0"
                          type="submit"
                          strokeWidth={2.4}
                        />{" "}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{keyword}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            ))}
          </div>

          {/* collections names */}
          {hasCollection > 0 && (
            <>
              <h2 className="mb-2 mt-6 text-xl font-bold text-stone-800 dark:text-stone-400">
                Collections
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {globalCollectionNames
                  ?.filter((collectionName) => {
                    if (collectionName.userId === userId) {
                      return collectionName;
                    }
                  })
                  .map((collection) => {
                    const collectionImages =
                      collection.collectionImages as unknown as UniversalImagesType;
                    const collectionVideos =
                      collection.collectionVideos as unknown as UniversalVideosType["videos"];

                    return (
                      <Link
                        href={`/collections/${collection.id}`}
                        key={collection.id}
                        className="flex items-center gap-x-2 rounded-md transition hover:bg-stone-100 dark:hover:bg-stone-900"
                      >
                        <div className="h-20 w-20">
                          <CollectionImageResizable
                            gapSize="sm"
                            images={collectionImages}
                          />
                          <CollectionVideoResizable
                            gapSize="sm"
                            videos={collectionVideos}
                          />
                        </div>
                        <div className="flex flex-col gap-y-2">
                          <p className="text-base font-medium capitalize text-stone-800 dark:text-stone-400">
                            {collection.collectionName}
                          </p>
                          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                            {collection.collectionImages.length +
                              collection.collectionVideos.length}{" "}
                            Content
                          </p>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ImageSearchVideo2;
