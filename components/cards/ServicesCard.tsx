import { Card, Typography } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation'

const ServicesCard = ({ service, id }: { id: string, service: { name: string, type: string, subName: string, description: string, price: string, imageUrl: string, id: string } }) => {
  const router = useRouter()
  return (
    <Card key={service.id} onClick={() => router.push(`/categories/${id}?type=${service.type}&type2=products`)} className="p-4 min-w-[160px] max-xl:min-w-[120px]  rounded-lg shadow-md cursor-pointer">
      <img src={service.imageUrl} alt={service.name} className="w-16 h-16 mx-auto" />
      <Typography variant="subtitle1" className="font-semibold text-center mt-2">
        {service.name}
      </Typography>
      <Typography variant="body2" className="text-gray-500 text-center">
        {service.subName.substring(0, 50)}...
      </Typography>
      {/* <div className="bg-blue-500 text-white text-center mt-2 py-1 rounded-full">
              {service.price}
            </div> */}
    </Card>
  )
}

export default ServicesCard