"use client";

import { cn } from "@/lib/utils";
import {
  ImageOrVideoSearchKeywordSchema,
  ImageOrVideoSearchKeywordSchemaType,
} from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Image as LucideImage, Search, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const searchedKeyword = "searchedKeyword";

const IconSize: number = 21;

// if in future need to display more element just add the object in array
const onHoverDisplayElement: onHoverDisplayElementsType = [
  {
    elementName: "Image",
    element: (
      <div
        className={
          "flex items-center gap-x-2 h-10 cursor-pointer font-semibold text-base"
        }>
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
          "flex items-center gap-x-2 h-10 cursor-pointer font-semibold text-base"
        }>
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
  mediaType?: MediaType;
};

const ImageSearchVideo2 = (props: ImageOrVideoSearchType) => {
  const { border, mediaType } = props;

  const router = useRouter()
  const [openPopOver, setOpenPopOver] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const [keywords, setKeywords] = useState<string[] | null>([]);
  const [hoverElement, setHoverElement] = useState(onHoverDisplayElement[0]);

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
    router.push(`/search/images/${values.searchedKeyword}`);

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

  return (
    <div className="relative">
      <div
        className={cn(
          "bg-white h-12 rounded-md flex items-center z-10 relative",
          border ? "bg-white" : "bg-stone-100",
          openPopOver && "bg-white ring-1 ring-stone-300"
        )}
        ref={inputRef}>
        {" "}
        <HoverCard
          openDelay={100}
          closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "flex items-center w-32 justify-center px-4 group mx-1 rounded-md",
                border && "border border-stone-400 bg-stone-200"
              )}>
              {hoverElement?.element}

              <div className="ml-2 transition duration-300 group-hover:rotate-180 ">
                <ChevronDown size={17} />
              </div>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            className="-ml-1 p-0 mt-[2px] py-2 w-fit"
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
        {!border && (
          <Separator
            orientation="vertical"
            className="h-9 bg-stone-300"
          />
        )}
        <div className="flex-grow">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center">
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
                        onClick={() => setOpenPopOver(true)}
                        type="text"
                        className={cn(
                          "text-lg ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none pl-4",
                          !border && "bg-slate-100",
                          openPopOver && "bg-white"
                        )}
                        placeholder={`Search for free ${hoverElement?.elementName}`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator
                orientation="vertical"
                className="h-9 bg-stone-300"
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
      </div>

      <div
        className={cn(
          "absolute rounded-md top-0 bg-white h-fit w-full p-4",
          openPopOver ? "visible ring-1 ring-stone-300" : "invisible"
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
            {keywords?.map((keyword, index) => (
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
          <div className="flex gap-x-4"></div>
        </div>
      </div>
    </div>
  );
};

export default ImageSearchVideo2;
