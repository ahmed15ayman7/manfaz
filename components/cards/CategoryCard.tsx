import React from 'react'

interface CategoryCardProps {
  category: string
  image: string
  categoryId: string
  onClick: () => void
}

const CategoryCard = ({ category, image, categoryId, onClick }: CategoryCardProps) => {
  return (
    <div className="rounded-xl  cursor-pointer" onClick={onClick}>
      <div className="flex bg-white p-2 rounded-3xl flex-col items-center">
        <img src={image} alt={category} className="w-10 h-10" />
        <p className="text-xs font-medium mt-1 text-center">{category}</p>
      </div>
    </div>
  )
}

export default CategoryCard