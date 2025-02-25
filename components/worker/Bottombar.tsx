import { Home, Calendar, ClipboardList, Star, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const bottombarLinks = [
  {
    icon: Home,
    route: "/worker",
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
    icon: Settings,
    route: "/worker/settings",
    label: "Settings",
  },
];

const Bottombar = () => {
  const pathname = usePathname();

  return (
    <section className="fixed bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg xs:px-7 md:hidden">
      <div className="flex items-center justify-between gap-3 xs:gap-5">
        {bottombarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex flex-col items-center gap-2 p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${
                isActive && "bg-primary-500 rounded-lg"
              }`}
            >
              <Icon size={24} className={isActive ? "text-light-1" : "text-gray-500"} />
              <p className={`text-subtle-medium ${isActive ? "text-light-1" : "text-gray-500"}`}>
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
