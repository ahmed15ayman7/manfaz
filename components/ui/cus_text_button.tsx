"use client";

import React from 'react';

interface CusTextButtonProps {
  borderRadius?: number; // Border radius in pixels
  backgroundColor?: string; // Tailwind CSS class for background color
  borderSideColor?: string; // Tailwind CSS class for border color
  horizontalPadding?: number; // Horizontal padding in pixels
  verticalPadding?: number; // Vertical padding in pixels
  buttonWidth?: number; // Width of the button
  buttonHeight?: number; // Height of the button
  buttonText: string; // Text to display on the button
  textStyle: string; // Tailwind CSS class for text style
  onPressed: (event: React.FormEvent) => void; // Function to call on button press
}

const CusTextButton: React.FC<CusTextButtonProps> = ({
  borderRadius = 16,
  backgroundColor = 'bg-blue-500', // Default background color
  borderSideColor = 'border-black', // Default border color
  horizontalPadding = 12, // Default horizontal padding
  verticalPadding = 14, // Default vertical padding
  buttonWidth = 200, // Default button width
  buttonHeight = 50, // Default button height
  buttonText,
  textStyle,
  onPressed,
}) => {
  return (
    <button
      onClick={onPressed}
      className={`flex items-center justify-center ${backgroundColor} border ${borderSideColor} rounded-[${borderRadius}px]`}
      style={{
        padding: `${verticalPadding}px ${horizontalPadding}px`,
        width: `${buttonWidth}px`,
        height: `${buttonHeight}px`,
      }}
    >
      <span className={textStyle}>{buttonText}</span>
    </button>
  );
};

export default CusTextButton;