import { Skeleton } from '@mui/material'
import React from 'react'

const LoadingComponent = () => {
  return (
    <div className="space-y-6">
      <Skeleton height={40} width={300} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={120} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton height={300} />
        <Skeleton height={300} />
      </div>
    </div>
  )
}

export default LoadingComponent