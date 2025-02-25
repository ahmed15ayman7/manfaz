"use client";
// import { Metadata } from "next";
import "../globals.css";
import { Topbar, LeftSidebar, Bottombar } from "@/components/worker";

// export const metadata: Metadata = {
//   title: "Worker Dashboard",
//   description: "Worker Dashboard for Manfaz Platform"
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen">
      <LeftSidebar />
      
      <div className="flex flex-col flex-1">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto bg-light-2 p-4 pt-20">
          {children}
        </main>
        
        <Bottombar />
      </div>
    </div>
  );
}
