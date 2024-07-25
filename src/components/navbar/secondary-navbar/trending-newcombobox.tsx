"use client";

import AdjustPadding from "@/components/shared/adjust-padding";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGlobalImagesStore } from "@/global-states/visage-image-state";
import { useGlobalVideos } from "@/global-states/visage-video-state";
import { cn } from "@/lib/utils";
import { LinkVideoPage } from "@/links/links";
import { Check, ChevronsUpDown } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const frameworks = [
  {
    value: "trending",
    label: "Trending",
  },
  {
    value: "new",
    label: "New",
  },
];

export default function TrendingNewComboBox() {
  const [title, setTitle] = useState("Free Stock Photos");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("trending");
  const pathname = usePathname();
  const isVideos = pathname.startsWith(LinkVideoPage);
  const { globalImages, setGlobalImages } = useGlobalImagesStore();
  const { setVideos, videos } = useGlobalVideos();

  useEffect(() => {
    if (!isVideos) {
      if (value === "trending") {
        setTitle("Trending Stock Photos");
        if (globalImages) {
          setGlobalImages(globalImages.reverse());
        }
      }
      if (value === "new") {
        setTitle("New Stock Photos");
        if (globalImages) {
          setGlobalImages(globalImages.reverse());
        }
      }
    }
    if (isVideos) {
      if (value === "trending") {
        setTitle("Trending Stock Videos");
        if (videos) {
          setVideos(videos.reverse());
        }
      }
      if (value === "new") {
        setTitle("New Stock Videos");
        if (videos) {
          setVideos(videos.reverse());
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideos, value]);

  return (
    <AdjustPadding className="flex items-center justify-between">
      {/* title */}
      <p className="text-2xl font-semibold">{title}</p>

      {/* combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-[200px] text-base font-semibold">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-12 justify-between px-9"
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No list found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="h-12 text-base font-semibold"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </AdjustPadding>
  );
}
