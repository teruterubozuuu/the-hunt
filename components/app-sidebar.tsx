"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  BriefcaseIcon,
  ChartDonutIcon,
  ReadCvLogoIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { LightDarkModeToggle } from "./dark-light-mode";

export default function AppSidebar() {
  return (
    <Sidebar
      collapsible="none"
      className="w-[calc(var(--sidebar-width-icon)+10px)]! border-r-2 border-foreground h-screen  p-2"
    >
      <SidebarHeader
        className="border-2 border-foreground flex items-center flex-col rounded-lg cursor-pointer bg-foreground"
        title="The Hunt"
      >
        <BriefcaseIcon className="text-primary-foreground" size={20} />
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarMenu className="flex flex-col items-center p-2 h-full justify-between">
          <div className="flex flex-col gap-5">
            <SidebarMenuItem className="cursor-pointer" title="Dashboard">
              <ChartDonutIcon size={25} />
            </SidebarMenuItem>
            <SidebarMenuItem className="cursor-pointer" title="Tracker">
              <ReadCvLogoIcon size={25} />
            </SidebarMenuItem>
          </div>
            <SidebarMenuItem className="cursor-pointer" title="Profile">
              <UserCircleIcon size={25} />
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
