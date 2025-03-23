import { IconBell, IconClipboardList, IconHome, IconUser, IconShoppingCart } from "@tabler/icons-react";
import { Home, Calendar, ClipboardList, Star, Settings, Wallet } from "lucide-react";
export const SidebarLinks = [
    {
      icon: <IconHome size={24} />,
      route: "/home",
      label: "home",
    },
    {
      icon: <IconClipboardList size={24} />,
      route: "/orders",
      label: "orders",
    },
    {
      icon: <IconShoppingCart size={24} />,
      route: "/checkout",
      label: "cart",
    },
    {
      icon: <IconBell size={24} />,
      route: "/notification",
      label: "notification",
    },
    {
      icon:   <Wallet size={24} />,
      route: "/wallet",
      label: "wallet",
    },
    {
      icon: <IconUser size={24} />,
      route: "/profile",
      label: "profile",
    },
  ];
  export const sidebarLinksWorkers = [
    {
      icon: <Home size={24} />,
      route: "/worker",
      label: "home",
    },
    {
      icon: <Calendar size={24} />,
      route: "/worker/schedule",
      label: "schedule",
    },
    {
      icon: <ClipboardList size={24} />,
      route: "/worker/orders",
      label: "orders",
    },
    {
      icon: <IconBell size={24} />,
      route: "/worker/notification",
      label: "notification",
    },
  {
    icon: <Star size={24} />,
    route: "/worker/reviews",
    label: "reviews",
  },
  {
    icon:   <Wallet size={24} />,
    route: "/worker/earnings",
    label: "earnings",
  },
  {
    icon: <Settings size={24} />,
    route: "/worker/settings",
    label: "settings",
  },
];