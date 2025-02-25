"use client";
import { Briefcase, Star, TrendingUp, Users, Clock, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Orders",
    value: "150",
    icon: Briefcase,
    change: "+12%",
    description: "vs. previous month",
  },
  {
    title: "Rating",
    value: "4.8",
    icon: Star,
    change: "+0.2",
    description: "vs. previous month",
  },
  {
    title: "Earnings",
    value: "$2,450",
    icon: TrendingUp,
    change: "+18%",
    description: "vs. previous month",
  },
  {
    title: "Active Clients",
    value: "45",
    icon: Users,
    change: "+5",
    description: "vs. previous month",
  },
];

const recentOrders = [
  {
    id: "1",
    customer: "Ahmed Mohamed",
    service: "Home Cleaning",
    status: "pending",
    time: "2 hours ago",
  },
  {
    id: "2",
    customer: "Sara Ahmed",
    service: "Furniture Assembly",
    status: "in_progress",
    time: "5 hours ago",
  },
  {
    id: "3",
    customer: "Mohamed Ali",
    service: "Plumbing",
    status: "completed",
    time: "1 day ago",
  },
];

const upcomingSchedule = [
  {
    id: "1",
    service: "Home Cleaning",
    customer: "Fatima Hassan",
    time: "09:00 AM - 11:00 AM",
    location: "123 Main St, Cairo",
  },
  {
    id: "2",
    service: "Furniture Assembly",
    customer: "Omar Khaled",
    time: "02:00 PM - 04:00 PM",
    location: "456 Park Ave, Alexandria",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function WorkerDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <div className="flex items-center space-x-4">
          <Link href="/worker/orders" className="btn-primary">
            New Orders
          </Link>
          <Link href="/worker/schedule" className="btn-secondary">
            View Schedule
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="rounded-full bg-primary-50 p-3">
                  <Icon className="h-6 w-6 text-primary-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm font-medium text-green-500">
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500">{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <Link href="/worker/orders" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:border-primary-500 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{order.service}</h4>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                  <span className="text-xs text-gray-400">{order.time}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button className="text-primary-600 hover:text-primary-700">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Upcoming Schedule</h3>
            <Link href="/worker/schedule" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingSchedule.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-lg border p-4 hover:border-primary-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{schedule.service}</h4>
                    <p className="text-sm text-gray-500">{schedule.customer}</p>
                  </div>
                  <span className="flex items-center text-xs text-primary-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Confirmed
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {schedule.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {schedule.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
