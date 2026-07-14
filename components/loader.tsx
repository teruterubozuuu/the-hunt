import { CircleNotchIcon } from "@phosphor-icons/react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary backdrop-blur-sm">
      <CircleNotchIcon className="animate-spin text-foreground" size={32} />
    </div>
  );
}