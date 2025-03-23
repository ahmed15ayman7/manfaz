import React from "react";

interface CustomToastProps {
  image: string;
  name: string;
  title: string;
  message: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ image, name, title, message }) => {
  return (
    <div className="flex items-start gap-3">
      <img
        src={image}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-gray-300"
      />
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
};

export default CustomToast;
