import React from 'react'

const CategoryCard = ({category,image}:{category:string,image:string}) => {
  return (
    <div>        <div  className="flex flex-col items-center">
    <img src={image} alt={category} className="w-10 h-10" />
    <p className="text-xs font-medium mt-1 text-center">{category}</p>
  </div></div>
  )
}

export default CategoryCard