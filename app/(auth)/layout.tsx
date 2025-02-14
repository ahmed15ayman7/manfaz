import type { Metadata } from "next";
import "../globals.css";
import LanguageToggle from "@/components/ui/LanguageToggle";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
    >
      <div className="fixed top-4 right-4">
        <LanguageToggle/>
      </div>
  {children}
    </div>
  );
}
