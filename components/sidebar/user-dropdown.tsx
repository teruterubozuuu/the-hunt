"use client";
import { GearIcon, UserCircleIcon } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const { setTheme } = useTheme();
  const router = useRouter();

  const preferences = [
    { id: "light", label: "Light Mode" },
    { id: "dark", label: "Dark Mode" },
    { id: "system", label: "System" },
  ];

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/sign-out", { method: "POST" });

      if (!res.ok) {
        toast.error("Error signing out");
        return;
      }
      router.push("/sign-in");
    } catch (error) {
      console.error("An unexpected error occurred", error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <GearIcon size={25} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            Preferences
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {preferences.map((pref) => (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme(pref.id)}
                  key={pref.id}
                >
                  {pref.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
