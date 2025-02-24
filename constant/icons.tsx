import { IconBell, IconClipboardList, IconHome, IconUser, IconShoppingCart } from "@tabler/icons-react";

export const SidebarLinks = [
    {
      icon: <IconHome size={24} />,
      route: "/",
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
      icon: <IconUser size={24} />,
      route: "/profile",
      label: "profile",
    },
];