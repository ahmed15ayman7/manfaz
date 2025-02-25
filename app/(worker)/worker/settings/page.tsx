"use client";
import { useState } from "react";
import { User, Lock, Bell, Globe, CreditCard } from "lucide-react";

const settingsTabs = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "security",
    label: "Security",
    icon: Lock,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "language",
    label: "Language",
    icon: Globe,
  },
  {
    id: "payment",
    label: "Payment",
    icon: CreditCard,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 rounded-full bg-gray-200">
                <img
                  src="/assets/default-avatar.png"
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <button className="btn-primary">Change Photo</button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="City, Country"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Change Password</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">New Order Notifications</h4>
                  <p className="text-sm text-gray-500">Get notified when you receive a new order</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Order Status Updates</h4>
                  <p className="text-sm text-gray-500">Get notified when order status changes</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Language</label>
              <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Payment Methods</h3>
              <p className="text-sm text-gray-500">Manage your payment methods and preferences</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-6 w-6 text-gray-500" />
                    <div>
                      <p className="font-medium">**** **** **** 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/24</p>
                    </div>
                  </div>
                  <button className="text-sm text-red-600 hover:text-red-800">Remove</button>
                </div>
              </div>
              <button className="btn-secondary w-full">Add New Payment Method</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold">Settings</h2>

      <div className="space-y-6">
        {/* Horizontal Tabs */}
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-2">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 rounded-lg p-3 whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary-500 text-black"
                      : "hover:bg-background"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-black" : "text-gray-500"}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
