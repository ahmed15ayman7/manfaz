"use client"
import "../globals.css";
import BottomSidebar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Topbar from "@/components/shared/Topbar";
import  useStore  from '@/store/useLanguageStore';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let { locale } =  useStore();
  return (
<div style={{direction:'ltr'}} >
      <Topbar/>
      <main className=' flex flex-row w-full'>

        <LeftSidebar/>
        <section className="main-container relative">
        <div className=" w-full max-w-4xl" style={{direction:locale === 'en' ? 'ltr' : 'rtl'}}>
        {children}
        </div>
        </section>
        <RightSidebar/>
      </main>
      <BottomSidebar/>
        </div>
  );
}
