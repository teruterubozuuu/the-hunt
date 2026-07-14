import { ChartDonutIcon, ReadCvLogoIcon, UserIcon } from "@phosphor-icons/react";

  export const menuItem = [
    {id: "dashboard", label: "Dashboard", icon: <ChartDonutIcon size={25}/>, path: "/dashboard"},
    {id: "tracker", label: "Tracker", icon: <ReadCvLogoIcon size={25}/>, path: "/tracker"},
    {id: "profile", label: "Profile", icon: <UserIcon size={25}/>, path: "/profile"}
  ]