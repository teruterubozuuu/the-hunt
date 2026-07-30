"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "../ui/sidebar";
import {BriefcaseIcon} from "@phosphor-icons/react";
import UserDropdown from "./user-dropdown";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { menuItem } from "@/utils/app/constants";
import { useActivePath } from "@/hooks/use-active-path";


export default function AppSidebar() {
  const isActive = useActivePath();

  return (
    <Sidebar
      collapsible="none"
      className="hidden md:flex md:w-[calc(var(--sidebar-width-icon)+10px)]! border-r-2 border-foreground h-screen"
    >
      <SidebarHeader
        className="flex items-center flex-col border-b-2 border-foreground p-2"
        title="The Hunt"
      >
        <div className="rounded-lg cursor-pointer bg-foreground p-2"><BriefcaseIcon className="text-primary-foreground" size={20} /></div>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarMenu className="flex flex-col items-center p-2 justify-between h-full">
          <div className="flex flex-col items-center gap-5">
            {menuItem.map((item)=>(
              <Tooltip key={item.id}>
                <TooltipTrigger>
                  <Link href={item.path}>
                    <div
                      className="cursor-pointer flex items-center justify-center"
                    >
                      {isActive(item.path) ? item.filled : item.icon}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <UserDropdown/>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
