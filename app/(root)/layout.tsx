"use client"
import "../globals.css";
import BottomSidebar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Topbar from "@/components/shared/Topbar";
import  useStore  from '@/store/useLanguageStore';
import { UserSocketHandler } from './components/UserSocketHandler';

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
        <div className=" w-full " style={{direction:locale === 'en' ? 'ltr' : 'rtl'}}>
        <UserSocketHandler />
        {children}
        </div>
        </section>
        {/* <RightSidebar/> */}
      </main>
      <BottomSidebar/>
        </div>
  );
}
