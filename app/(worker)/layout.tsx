"use client";
// import { Metadata } from "next";
import "../globals.css";
// import { Topbar, LeftSidebar, Bottombar } from "@/components/worker";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import  useStore  from '@/store/useLanguageStore';
import { WorkerSocketHandler } from './components/WorkerSocketHandler';

// export const metadata: Metadata = {
//   title: "Worker Dashboard",
//   description: "Worker Dashboard for Manfaz Platform"
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let { locale } =  useStore();
  return (
    <div style={{direction:'ltr'}} >
    <Topbar isWorker/>
    <main className=' flex flex-row w-full'>

      <LeftSidebar isWorker/>
      <section className="main-container relative">
      <div className=" w-full " style={{direction:locale === 'en' ? 'ltr' : 'rtl'}}>
      <WorkerSocketHandler />
      {children}
      </div>
      </section>
      {/* <RightSidebar/> */}
    </main>
    <Bottombar isWorker/>
      </div>
  );
}
