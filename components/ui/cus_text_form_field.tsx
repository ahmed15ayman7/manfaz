"use client";

import React, { useState, forwardRef } from "react";
import useStore from '@/store/useLanguageStore';

interface CusTextFormFieldProps {
  name?: string; // Tailwind CSS padding class
  contentPadding?: string; // Tailwind CSS padding class
  focusedBorder?: string; // Tailwind CSS class for focused border
  enabledBorder?: string; // Tailwind CSS class for enabled border
  inputTextStyle?: string; // Tailwind CSS class for input text style
  hintText: string;
  hintStyle?: string; // Tailwind CSS class for hint text style
  isObscureText?: boolean;
  suffixIcon?: React.ReactNode;
  fillColor?: string; // Tailwind CSS class for fill color
  controller?: React.Dispatch<React.SetStateAction<string>>; // Controlled component
  validator: (value: string | undefined) => string | undefined; // Validation function
  handelShowPassword?: () => void; // Validation function
}

const CusTextFormField = forwardRef<HTMLInputElement, CusTextFormFieldProps>(({
  contentPadding = "p-4", // Default padding
  focusedBorder = "border-blue-500", // Default focused border
  enabledBorder = "border-gray-300", // Default enabled border
  inputTextStyle = "text-gray-800", // Default text style
  hintText,
  hintStyle = "text-gray-400", // Default hint style
  isObscureText = false,
  suffixIcon,
  fillColor = "bg-white", // Default fill color
  controller,
  validator,
  name,
  handelShowPassword
}, ref) => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");
  const { locale } = useStore();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Update external controller if provided
    if (controller) {
      controller(newValue);
    }

    // Run the validator and set error state
    const validationError = validator(newValue);
    setError(validationError);
  };

  return (
    <div className={`relative ${fillColor} rounded-[16px]`}>
      <input
        ref={ref}
        name={name}
        type={isObscureText ? "password" : "text"}
        className={`block w-full min-w-[300px] ${contentPadding} border ${error ? "border-red-500" : enabledBorder
          } focus:outline-none focus:ring-2 ${focusedBorder} rounded-[16px]`}
        placeholder={hintText}
        value={value}
        onChange={handleChange}
        style={{ color: inputTextStyle }}
      />
      {suffixIcon && (
        <span className={`absolute ${locale !== 'en' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2`} onClick={handelShowPassword}>
          {suffixIcon}
        </span>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

export default CusTextFormField;
