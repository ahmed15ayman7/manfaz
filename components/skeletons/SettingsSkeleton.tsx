export default function SettingsSkeleton() {
  return (
    <div className="container mx-auto p-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6" />

      <div className="space-y-6">
        {/* Profile Image Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
            <div className="h-10 w-32 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
} 