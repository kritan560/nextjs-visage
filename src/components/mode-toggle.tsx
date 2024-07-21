"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { FaCheck } from "react-icons/fa";
import { FiCpu } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-fit w-fit">
          <IoSunny className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="mt-3">
        <DropdownMenuItem
          className="flex items-center gap-x-2"
          onClick={() => setTheme("light")}
        >
          <IoSunny />
          Light
          {theme === "light" && <FaCheck />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-x-2"
          onClick={() => setTheme("dark")}
        >
          <Moon size={14} />
          Dark
          {theme === "dark" && <FaCheck />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-x-2"
          onClick={() => setTheme("system")}
        >
          <FiCpu />
          System
          {theme === "system" && <FaCheck />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
