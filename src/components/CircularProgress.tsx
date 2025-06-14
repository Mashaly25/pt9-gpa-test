'use client';

import React from 'react';
import { formatGPA, getGPAColor, getGPAProgress } from '@/utils/gpaCalculations';

interface CircularProgressProps {
  gpa: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export default function CircularProgress({
  gpa,
  size = 120,
  strokeWidth = 8,
  className = '',
  showLabel = true,
  label = 'GPA'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = getGPAProgress(gpa);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Get color based on GPA value
  const getStrokeColor = (gpa: number): string => {
    if (gpa >= 3.7) return '#16a34a'; // green-600
    if (gpa >= 3.0) return '#2563eb'; // blue-600
    if (gpa >= 2.0) return '#ca8a04'; // yellow-600
    return '#dc2626'; // red-600
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getStrokeColor(gpa)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        
        {/* GPA value in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getGPAColor(gpa)}`}>
            {formatGPA(gpa)}
          </span>
          <span className="text-xs text-gray-500 mt-1">/ 4.000</span>
        </div>
      </div>
      
      {showLabel && (
        <span className="text-sm text-gray-600 mt-2 font-medium">
          {label}
        </span>
      )}
    </div>
  );
}
