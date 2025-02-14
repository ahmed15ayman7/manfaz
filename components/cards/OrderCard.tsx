import { Card, Typography, Badge } from '@mui/material'
import React from 'react'

const OrderCard = ({ order }:{order:{id:string,seller:string,date:string,title:string,messages:number,notifications:number}}) => {
  return (
    <Card key={order.id} className="p-4 flex flex-col space-y-2 shadow-md rounded-lg">
    <Typography variant="h6" className="font-semibold text-blue-600">
      Order ID {order.id}
    </Typography>
    <Typography variant="body2" className="text-gray-600">
      <strong>Seller:</strong> {order.seller}
    </Typography>
    <Typography variant="body2" className="text-gray-600">
      {order.date}
    </Typography>
    <Typography variant="body2" className="text-gray-800">
      <strong>Title:</strong> {order.title}
    </Typography>
    <div className="flex space-x-2">
      <Badge badgeContent={order.messages} color="primary" />
      <Badge badgeContent={order.notifications} color="secondary" />
    </div>
  </Card>
  )
}

export default OrderCard