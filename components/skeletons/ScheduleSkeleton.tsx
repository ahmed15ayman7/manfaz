export default function ScheduleSkeleton() {
  return (
    <div className="container mx-auto p-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Skeleton */}
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-7 gap-2">
            {/* Week days */}
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded" />
            ))}
            {/* Calendar days */}
            {[...Array(35)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded" />
            ))}
          </div>
        </div>

        {/* Schedule Skeleton */}
        {/* <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
