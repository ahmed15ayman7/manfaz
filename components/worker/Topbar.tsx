import { Bell, LogOut, User } from "lucide-react";
import Link from "next/link";
import { BASE_URL } from '@/lib/config';

const Topbar = () => {
  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-white px-6 py-3">
      <Link href="/" className="flex items-center gap-4">
        <img src="/assets/images/manfaz_logo.png" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-dark-1 max-xs:hidden">Manfaz Worker</p>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-dark-1" />
          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-light-4 rounded-lg">
            <User className="h-6 w-6 text-gray-500" />
            <p className="text-subtle-medium text-gray-500">Profile</p>
          </div>
          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-light-4 rounded-lg">
            <LogOut className="h-6 w-6 text-gray-500" />
            <p className="text-subtle-medium text-gray-500">Logout</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
