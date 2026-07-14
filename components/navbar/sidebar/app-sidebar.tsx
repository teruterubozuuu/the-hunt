"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "../../ui/sidebar";
import {BriefcaseIcon} from "@phosphor-icons/react";
import UserDropdown from "./user-dropdown";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { menuItem } from "@/utils/app/constants";

export default function AppSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);
  
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
        <SidebarMenu className="flex flex-col items-center p-2 h-full justify-between">
          <div className="flex flex-col items-center gap-5">
            {menuItem.map((item)=>(
              <Tooltip key={item.id}>
                <TooltipTrigger>
                  <Link href={item.path}>
                    <div
                      className={cn(
                        "cursor-pointer flex items-center justify-center",
                        isActive(item.path) &&
                          "border-2 border-foreground rounded-md p-1 transition-all ease-in-out"
                      )}
                    >
                      {item.icon}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <Tooltip>
            <TooltipTrigger>
              <UserDropdown/>
            </TooltipTrigger>
            <TooltipContent side="right">
              Settings
            </TooltipContent>
          </Tooltip>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
