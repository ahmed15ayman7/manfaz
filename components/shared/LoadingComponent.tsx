import React from 'react'

const LoadingComponent = () => {
  return (
    <div className="animate-pulse">
    <div className="w-full h-64 bg-gray-200" />
    <div className="container mx-auto p-4 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  </div>
  )
}

export default LoadingComponent