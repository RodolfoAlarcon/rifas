'use client';

import React from 'react';

type ProgressBarProps = {
  percentage: number;
  color?: string;
  bgColor?: string;
  height?: number;
};

export const ProgressBar = ({
  percentage,
  color = 'bg-red-600',
  bgColor = 'bg-gray-200',
  height = 10
}: ProgressBarProps) => {
  return (
    <div className="w-full">
      <div className={`${bgColor} border border-3 border-[#c2272d] overflow-hidden`} style={{ height: `${height}px` }}>
        <div
          className={`${color} h-full  transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right mt-1 text-xl font-bold text-gray-600">
        {percentage.toFixed(2)}% vendidos
      </div>
    </div>
  );
};