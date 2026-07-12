import { LightDarkModeToggle } from "@/components/dark-light-mode";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute right-5 top-5">
        <LightDarkModeToggle/>
      </div>
      <div className="flex flex-col justify-center items-center h-screen">
        {children}
      </div>
    </>
  );
}
