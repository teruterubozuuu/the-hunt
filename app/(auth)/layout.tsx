import { LightDarkModeToggle } from "@/components/dark-light-mode";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="absolute right-5 top-5">
        <LightDarkModeToggle/>
      </div>
      <div className="flex flex-col justify-center items-center h-screen md:p-0 p-2">
        {children}
      </div>
    </div>
  );
}
