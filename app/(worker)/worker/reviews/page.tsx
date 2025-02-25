import { Star } from "lucide-react";

const reviews = [
  {
    id: "1",
    customer: "Ahmed Mohamed",
    rating: 5,
    comment: "Excellent service! Very professional and thorough with the cleaning.",
    date: "2025-02-24",
    service: "Home Cleaning",
  },
  {
    id: "2",
    customer: "Sara Ahmed",
    rating: 4,
    comment: "Good work with the furniture assembly. Just a bit late to arrive.",
    date: "2025-02-23",
    service: "Furniture Assembly",
  },
  // Add more sample reviews...
];

const stats = [
  { label: "Total Reviews", value: "150" },
  { label: "Average Rating", value: "4.8" },
  { label: "5 Star Reviews", value: "85%" },
  { label: "Response Rate", value: "98%" },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Reviews</h2>
        <select className="rounded-lg border p-2">
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{review.customer}</h3>
                <p className="text-sm text-gray-500">{review.service}</p>
              </div>
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
            
            <div className="mt-2">
              <RatingStars rating={review.rating} />
            </div>
            
            <p className="mt-4 text-gray-700">{review.comment}</p>
            
            <div className="mt-4 flex justify-end">
              <button className="text-sm text-primary-600 hover:text-primary-800">
                Reply to Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">10</span> of{" "}
            <span className="font-medium">150</span> reviews
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
