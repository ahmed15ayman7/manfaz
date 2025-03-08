"use client";
import { useState } from "react";
import { User, Lock, Bell, Globe, CreditCard } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { apiUrl } from '@/constant'
import useStore from '@/store/useLanguageStore'
import { Worker } from '@/interfaces'
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton'

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

const getWorkerSettings = async ({ locale }: { locale: string }) => {
  const res = await axios.get(`${apiUrl}/workers/settings?lang=${locale}`)
  return res.data
}

export default function WorkerSettingsPage() {
  const { locale, setLocale } = useStore()
  const t = useTranslations('worker_settings')
  const [activeTab, setActiveTab] = useState("profile");
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data: settingsData, isLoading, refetch } = useQuery({
    queryKey: ['worker-settings'],
    queryFn: () => getWorkerSettings({ locale }),
  })

  const updateSettingsMutation = useMutation({
    mutationFn: (data: FormData) =>
      axios.patch(`${apiUrl}/workers/settings`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      toast.success(t('settings_updated'))
      refetch()
    },
    onError: () => {
      toast.error(t('settings_update_error'))
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    updateSettingsMutation.mutate(formData)
  }

  if (isLoading) {
    return <SettingsSkeleton />
  }

  const worker: Worker = settingsData?.data

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24">
                <Image
                  src={imagePreview || worker.user?.imageUrl || '/imgs/default-avatar.png'}
                  alt={worker.user?.name || ''}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-600 transition-colors"
                >
                  {t('change_image')}
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={worker.user?.name}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('title')}</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={worker.title}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={worker.user?.email}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={worker.user?.phone}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
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
                  {t('save_changes')}
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
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="ur">اردو</option>
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
      <h2 className="text-3xl font-bold">{t('title')}</h2>

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
