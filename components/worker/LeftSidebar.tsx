import { Home, Calendar, ClipboardList, Star, Settings, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  {
    icon: Home,
    route: "/worker/",
    label: "Home",
  },
  {
    icon: Calendar,
    route: "/worker/schedule",
    label: "Schedule",
  },
  {
    icon: ClipboardList,
    route: "/worker/orders",
    label: "Orders",
  },
  {
    icon: Star,
    route: "/worker/reviews",
    label: "Reviews",
  },
  {
    icon: Wallet,
    route: "/worker/earnings",
    label: "Earnings",
  },
  {
    icon: Settings,
    route: "/worker/settings",
    label: "Settings",
  },
];

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          let isActive=(pathname.includes(link.label)&&link.route.length>1)||pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-background"}`}
            >
              <Icon size={24} className={isActive ? "text-black" : "text-gray-500"} />
              <p className={`text-subtle-medium max-lg:hidden ${isActive ? "text-black" : "text-gray-500"}`}>
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
