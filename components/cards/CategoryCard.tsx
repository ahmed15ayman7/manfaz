import { Typography } from '@mui/material'
import React from 'react'

interface CategoryCardProps {
  category: string
  image: string
  categoryId: string
  onClick: () => void
}

const CategoryCard = ({ category, image, categoryId, onClick }: CategoryCardProps) => {
  return (
    <div className="rounded-xl  cursor-pointer min-w-[160px] max-xl:min-w-[70px] " onClick={onClick}>
      <div className="flex bg-white p-2 rounded-3xl flex-col items-center">
        <img src={image} alt={category} className="w-10 h-10" />
        <Typography variant="body2" className="text-xs font-medium mt-1 text-center max-xl:hidden" sx={{ fontSize: { sm: '11px', xs: '10px', md: "1rem" } }}>{category}</Typography>
      </div>
    </div>
  )
}

export default CategoryCard