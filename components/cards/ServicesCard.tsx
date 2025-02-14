import { Card, Typography } from '@mui/material'
import React from 'react'

const ServicesCard = ({service}:{service:{name:string,category:string,price:string}}) => {
  return (
    <Card key={service.name} className="p-4 min-w-[160px] rounded-lg shadow-md">
            <img src="/burger.png" alt={service.name} className="w-12 mx-auto" />
            <Typography variant="subtitle1" className="font-semibold text-center mt-2">
              {service.name}
            </Typography>
            <Typography variant="body2" className="text-gray-500 text-center">
              {service.category}
            </Typography>
            <div className="bg-blue-500 text-white text-center mt-2 py-1 rounded-full">
              {service.price}
            </div>
          </Card>
  )
}

export default ServicesCard