import { IconBell, IconClipboardList, IconHome, IconUser } from "@tabler/icons-react";

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
  