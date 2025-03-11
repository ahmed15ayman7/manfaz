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
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus, IconQuestionMark } from "@tabler/icons-react";
import { Fab, Tooltip, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";

const actions = [
  { icon: <IconPlus size={24} />, name: 'طلب خدمة', action: 'request_service' },
  { icon: <IconQuestionMark size={24} />, name: 'المساعدة', action: 'help' },
];

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const t = useTranslations('home');
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSpeedDialAction = (action: string) => {
    switch (action) {
      case 'request_service':
        router.push('/services/request');
        break;
      case 'help':
        router.push('/help');
        break;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SearchBar placeholder={t('search_placeholder')} setSearch={setSearch} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <QuickActions />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PopularServices />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Categories />
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <SpeedDial
          ariaLabel="SpeedDial"
          icon={<SpeedDialIcon />}
          direction="up"
          className={`transition-all duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleSpeedDialAction(action.action)}
            />
          ))}
        </SpeedDial>
      </motion.div>
    </motion.div>
  );
}
