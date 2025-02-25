import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

const scheduleData = [
  {
    id: "1",
    title: "Home Cleaning Service",
    customer: "Ahmed Mohamed",
    time: "09:00 AM - 11:00 AM",
    date: "2025-02-24",
    location: "123 Main St, Cairo",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Furniture Assembly",
    customer: "Sara Ahmed",
    time: "02:00 PM - 04:00 PM",
    date: "2025-02-24",
    location: "456 Park Ave, Alexandria",
    status: "upcoming",
  },
  // Add more sample schedule items...
];

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Schedule</h2>
        <div className="flex items-center space-x-4">
          <button className="btn-primary flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Set Availability
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">February 2025</h3>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">&lt;</button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">&gt;</button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <button
                  key={i}
                  className={`aspect-square rounded-lg p-2 text-center hover:bg-gray-100 
                    ${i === 23 ? "bg-primary-100 text-primary-600" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              {scheduleData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:border-primary-500 transition-colors"
                >
                  <h4 className="font-medium text-lg">{item.title}</h4>
                  <p className="text-gray-600">{item.customer}</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {item.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {item.location}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="text-sm text-primary-600 hover:text-primary-800">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
