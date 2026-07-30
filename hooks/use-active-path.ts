import { usePathname } from "next/navigation";

/**
 * Determines the active path the user is currently on
 */

export function useActivePath () {
    const pathname = usePathname();
    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname?.startsWith(path) ?? false;
    };
    return isActive;
}
