"use client";
import { BriefcaseIcon } from "@phosphor-icons/react";
import React from "react";
import UserDropdown from "./sidebar/user-dropdown";

export default function TopMenu() {
  return (
    <div className="md:hidden fixed top-0 border-b-2 border-foreground w-full p-2">
        <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <BriefcaseIcon
                className="text-primary-foreground bg-foreground p-1 rounded-sm"
                size={30}
                />
                <span className="tracking-wide text-lg">The Hunt</span>
            </div>
            <UserDropdown/>
        </div>
    </div>
  );
}
