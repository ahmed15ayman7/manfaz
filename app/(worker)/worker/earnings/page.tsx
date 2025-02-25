import { ArrowUpRight, Download, DollarSign, TrendingUp, Wallet } from "lucide-react";

const earnings = [
  {
    id: "1",
    service: "Home Cleaning",
    amount: 150,
    date: "2025-02-24",
    status: "completed",
    customer: "Ahmed Mohamed",
  },
  {
    id: "2",
    service: "Furniture Assembly",
    amount: 200,
    date: "2025-02-23",
    status: "pending",
    customer: "Sara Ahmed",
  },
  // Add more sample earnings...
];

const stats = [
  {
    title: "Total Earnings",
    value: "$2,450",
    icon: DollarSign,
    change: "+12%",
    description: "vs. previous month",
  },
  {
    title: "Pending Payments",
    value: "$350",
    icon: Wallet,
    change: "-5%",
    description: "vs. previous month",
  },
  {
    title: "Average Order Value",
    value: "$175",
    icon: TrendingUp,
    change: "+8%",
    description: "vs. previous month",
  },
];

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Earnings</h2>
        <div className="flex items-center space-x-4">
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </button>
          <select className="rounded-lg border p-2">
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-xl bg-white p-6 shadow-sm"
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

      {/* Earnings Chart */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Earnings Overview</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart placeholder - Implement with your preferred chart library
        </div>
      </div>

      {/* Earnings Table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">Recent Earnings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {earnings.map((earning) => (
                <tr key={earning.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{earning.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${earning.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{earning.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        earning.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {earning.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
