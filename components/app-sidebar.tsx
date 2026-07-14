"use client";
import React, { useState } from "react";
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
  FadersHorizontalIcon,
  ReadCvLogoIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { LightDarkModeToggle } from "./dark-light-mode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "./loader";

export default function AppSidebar() {
  const { setTheme } = useTheme();
  const supabase = createClient();
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
        setIsLoading(false);
        return;
      }
      router.push("/sign-in");
      setIsLoading(false);
    } catch (error) {
      console.error("An unexpected error occurred", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <Loader/>

  return (
    <Sidebar
      collapsible="none"
      className="w-[calc(var(--sidebar-width-icon)+10px)]! border-r-2 border-foreground h-screen p-2"
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
          <SidebarMenuItem title="Profile">
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <UserCircleIcon size={25} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    Preferences
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("light")}
                      >
                        Light Mode
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("dark")}
                      >
                        Dark Mode
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("system")}
                      >
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleSignOut}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
