"use client"

import * as React from "react"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoonIcon, SunIcon } from "@phosphor-icons/react"

export function LightDarkModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative cursor-pointer border-2 p-2 rounded-lg border-foreground!">
          <SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" size={15}/>
          <MoonIcon className="absolute -translate-y-1/2 top-1/2 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" size={15} />
          <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
