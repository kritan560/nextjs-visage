"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  ImageOrVideoSearchKeywordSchema,
  ImageOrVideoSearchKeywordSchemaType,
} from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Image as Picture, Search, Video } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";

const className =
  "flex items-center gap-x-2 h-10 cursor-pointer font-semibold text-base";
const IconSize: number = 21;

type MediaType = "Image" | "Video";
type onHoverDisplayElementsType = {
  elementName: MediaType;
  element: JSX.Element;
}[];

// if in future need to display more element just add the object in array
const onHoverDisplayElement: onHoverDisplayElementsType = [
  {
    elementName: "Image",
    element: (
      <div className={className}>
        <Picture size={IconSize} />
        <p>Image</p>
      </div>
    ),
  },
  {
    elementName: "Video",
    element: (
      <div className={className}>
        <Video size={IconSize} />
        <p>Video</p>
      </div>
    ),
  },
];

type ImageOrVideoSearchType = {
  border?: boolean;
  mediaType?: MediaType;
};

/**
 * @deprecated
 * this component is absolute prefer to use new image-video-search2 component
 * @param props
 * @returns
 */

export default function ImageOrVideoSearch(props: ImageOrVideoSearchType) {
  const { border, mediaType } = props;

  const router = useRouter();
  const pathname = usePathname();
  const [hoverElement, setHoverElement] = useState(onHoverDisplayElement[0]);
  const [activeMediaType, setActiveMediaType] = useState<MediaType>("Image");
  const [openPopOver, setOpenPopOver] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const [keywords, setKeywords] = useState([""]);

  useEffect(() => {
    if (mediaType === "Video" || pathname.startsWith("/video")) {
      setActiveMediaType("Video");
      const videoElement = onHoverDisplayElement.find(
        (element) => element.elementName === "Video"
      );

      if (videoElement) {
        setHoverElement(videoElement);
      }
    }
  }, [mediaType, pathname]);

  // 1. Define your form.
  const form = useForm<ImageOrVideoSearchKeywordSchemaType>({
    resolver: zodResolver(ImageOrVideoSearchKeywordSchema),
    defaultValues: {
      searchedKeyword: "",
    },
  });

  const searchedKeyword = "searchedKeyword";

  async function onSubmit(values: ImageOrVideoSearchKeywordSchemaType) {
    if (activeMediaType === "Image") {
      // router.push(`/search/images/${values.searchedKeyword}`);
    }

    // the logic is to add array to localstorage.
    const getItem = localStorage.getItem(searchedKeyword);

    if (getItem) {
      const lsSearchedKeyword = JSON.parse(getItem) as string[];
      lsSearchedKeyword.push(values.searchedKeyword);

      const stringifyLsSearchedKeyword = JSON.stringify(lsSearchedKeyword);
      localStorage.setItem(searchedKeyword, stringifyLsSearchedKeyword);
      setKeywords(lsSearchedKeyword);
    }

    if (!getItem) {
      const searchedKeywordStringify = JSON.stringify([values.searchedKeyword]);
      localStorage.setItem(searchedKeyword, searchedKeywordStringify);
      setKeywords([values.searchedKeyword]);
    }
  }

  function handleElementClick(element: onHoverDisplayElementsType[0]) {
    setHoverElement(element);
  }

  function handleClearClick() {
    localStorage.removeItem(searchedKeyword);
    setKeywords([]);
  }

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
    document.addEventListener("keydown", (e) => handleKeyDown(e));
    document.addEventListener("click", handleClickEvent);
    const words = localStorage.getItem(searchedKeyword);
    if (words) {
      const stringArrays = JSON.parse(words) as string[];
      setKeywords(stringArrays);
    }

    return document.removeEventListener("keydown", (e) => handleKeyDown(e));
  }, []);

  return (
    <div className="flex relative bg-blue-600">
      <div
        className={cn(
          "h-12 rounded-md flex w-full gap-x-4 items-center z-20",
          border ? "bg-white" : "bg-stone-100",
          openPopOver && "bg-white border"
        )}
        ref={inputRef}>
        {/* hovercard : image or video */}
        <HoverCard
          openDelay={100}
          closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "flex items-center w-32 justify-center px-4 group mx-1 rounded-md",
                border && "border bg-stone-200"
              )}>
              {hoverElement?.element}

              <div className="ml-2 transition duration-300 group-hover:rotate-180 ">
                <ChevronDown size={17} />
              </div>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            className="p-0 py-2 w-fit"
            align="start">
            <div className="flex flex-col">
              {onHoverDisplayElement.map((element) => (
                <div
                  key={element.elementName}
                  onClick={() => handleElementClick(element)}
                  className={cn(
                    "hover:bg-stone-200 px-7 flex justify-center",
                    hoverElement?.elementName == element.elementName &&
                      "text-visage-600"
                  )}>
                  {element.element}
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* input form : search the keyword */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center w-full">
            <FormField
              control={form.control}
              name="searchedKeyword"
              render={({ field }) => (
                <FormItem className="w-fit">
                  <FormControl>
                    <Input
                      maxLength={25}
                      onClick={() => setOpenPopOver(true)}
                      autoComplete="off"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setOpenPopOver(false);
                        }
                      }}
                      type="text"
                      className={cn("text-lg")}
                      size={45}
                      placeholder={`Search for free ${hoverElement?.elementName}`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant={"ghost"}
              className="hover:text-visage-600 cursor-pointer transition">
              <Search
                type="submit"
                strokeWidth={2.4}
                size={20}
              />
            </Button>
          </form>
        </Form>
      </div>

      {/* popover */}
      <div
        className={cn(
          "-z-10 absolute rounded-md top-0 bg-white h-fit w-full border p-4",
          openPopOver ? "block z-10" : "hidden"
        )}>
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <p className="font-bold text-xl text-stone-800">Recent Searches</p>
            <Button
              variant={"link"}
              className="text-base"
              onClick={handleClearClick}>
              Clear
            </Button>
          </div>
          <div className="flex gap-x-4">
            {keywords.map((keyword, index) => (
              <Button
                key={index}
                className="h-12 text-base font-medium flex gap-x-2 items-center"
                variant={"outline"}>
                {keyword}
                <Search
                  type="submit"
                  strokeWidth={2.4}
                  size={20}
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
