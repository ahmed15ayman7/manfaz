"use client"
import QuickActions from "@/components/cards/QuickActions";
import Categories from "@/components/shared/Categories";
import HomeHeader from "@/components/shared/HomeHeader";
import PopularServices from "@/components/shared/PopularServices";
import SearchBar from "@/components/shared/SearchBar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const t = useTranslations('home');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);



  return (
    <div className="min-h-screen">
      <HomeHeader user={session?.user!} isLoading={status === "loading"} />
      <div className="h-20"></div>
      <SearchBar placeholder={t('search_placeholder')} setSearch={setSearch} />
      <QuickActions />
      <PopularServices />
      <Categories />
    </div>
  );
}
