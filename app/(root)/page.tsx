import QuickActions from "@/components/cards/QuickActions";
import Categories from "@/components/shared/Categories";
import HomeHeader from "@/components/shared/HomeHeader";
import PopularServices from "@/components/shared/PopularServices";
import SearchBar from "@/components/shared/SearchBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
    <HomeHeader />
    <div className="h-20"></div>
    <SearchBar />
    <QuickActions />
    <PopularServices />
    <Categories />
  </div>
  );
}
