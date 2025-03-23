"use client";
import { useState, useEffect } from 'react'
import { User, Lock, Bell, Globe, CreditCard } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { toast } from 'react-toastify'
import useStore from '@/store/useLanguageStore'
import { User as UserInterface, Worker } from '@/interfaces'
import { useUser } from '@/hooks/useUser'
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton'
import API_ENDPOINTS from '@/lib/apis'
import axiosInstance from '@/lib/axios'
import Link from 'next/link';

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

const getWorkerSettings = async ({ locale,id }: { locale: string,id:string }) => {
  const url = API_ENDPOINTS.users.getById(id, { lang: locale,role: 'worker' }, false)
  const res = await axiosInstance.get(url)
  return res.data
}

export default function WorkerSettingsPage() {
  const { locale, setLocale } = useStore()
  const t = useTranslations('worker_settings')
  const [activeTab, setActiveTab] = useState("profile");
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  let {user,status}=useUser();

  const { data: settingsData, isLoading, refetch } = useQuery({
    queryKey: ['worker-settings',user?.id],
    queryFn: () => getWorkerSettings({ locale,id:user?.id||"" }),
    enabled:!user?.id
  })

  const updateSettingsMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axiosInstance.patch(API_ENDPOINTS.workers.update('me', {}, false), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    onSuccess: () => {
      toast.success(t('settings_updated'))
      refetch()
    },
    onError: () => {
      toast.error(t('settings_update_error'))
    },
  })
useEffect(()=>{
  refetch();
},[locale,user?.id])
  useEffect(() => {
    if (settingsData?.data) {
      const worker: Worker = settingsData.data
      setSkills(worker.skills)
      setImagePreview(worker.user?.imageUrl || '')
    }
  }, [settingsData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (imageFile) {
      formData.append('image', imageFile)
    }
    formData.append('skills', JSON.stringify(skills))
    updateSettingsMutation.mutate(formData)
  }

  if (isLoading) {
    return <SettingsSkeleton />
  }

  const worker: UserInterface = settingsData?.data

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24">
                <Image
                  src={imagePreview || worker?.imageUrl || '/imgs/default-avatar.png'}
                  alt={worker?.name || ''}
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
                    defaultValue={worker?.name}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('title')}</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={worker?.Worker?.[0]?.title}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={worker?.email}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={worker?.phone}
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
              <Link href="/worker/payout" className="btn-secondary w-full">pay out</Link>
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
