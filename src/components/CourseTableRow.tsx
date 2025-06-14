'use client';

import React, { useState, useEffect } from 'react';
import { Course, Grade } from '@/types';
import { convertPercentageToGrade, validatePercentage } from '@/utils/gpaCalculations';
import { Trash2 } from 'lucide-react';

interface CourseTableRowProps {
  course: Course;
  existingGrade?: Grade;
  onGradeChange: (grade: Grade | null) => void;
  isEven: boolean;
}

export default function CourseTableRow({ course, existingGrade, onGradeChange, isEven }: CourseTableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [percentage, setPercentage] = useState<string>(
    existingGrade ? existingGrade.percentage.toString() : ''
  );
  const [error, setError] = useState<string>('');
  const [letterGrade, setLetterGrade] = useState<string>(existingGrade?.letterGrade || '');
  const [gpaPoints, setGpaPoints] = useState<number>(existingGrade?.gpaPoints || 0);

  useEffect(() => {
    if (existingGrade) {
      setPercentage(existingGrade.percentage.toString());
      setLetterGrade(existingGrade.letterGrade);
      setGpaPoints(existingGrade.gpaPoints);
    }
  }, [existingGrade]);

  const handlePercentageChange = (value: string) => {
    setPercentage(value);
    setError('');

    if (value === '') {
      setLetterGrade('');
      setGpaPoints(0);
      onGradeChange(null);
      return;
    }

    const validation = validatePercentage(value);
    if (!validation.isValid) {
      setError(validation.error || '');
      return;
    }

    try {
      const numValue = parseFloat(value);
      const gradeInfo = convertPercentageToGrade(numValue);

      setLetterGrade(gradeInfo.letter);
      setGpaPoints(gradeInfo.points);

      // Auto-save the grade
      const grade: Grade = {
        courseId: course.id,
        percentage: numValue,
        letterGrade: gradeInfo.letter,
        gpaPoints: gradeInfo.points,
      };

      // Use setTimeout to ensure the state is updated before saving
      setTimeout(() => {
        onGradeChange(grade);
      }, 100);
    } catch (err) {
      setError('Invalid percentage value');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleClear = () => {
    setPercentage('');
    setLetterGrade('');
    setGpaPoints(0);
    setError('');
    onGradeChange(null);
    setIsEditing(false);
  };

  const getGradeColor = (points: number) => {
    if (points >= 3.7) return 'text-green-600 bg-green-50';
    if (points >= 3.0) return 'text-blue-600 bg-blue-50';
    if (points >= 2.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getInputBorderColor = () => {
    if (error) return 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900';
    if (percentage && !error) return 'border-green-300 focus:border-green-500 focus:ring-green-500 text-gray-900';
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900';
  };

  return (
    <tr className={`${isEven ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200`}>
      {/* Course Name */}
      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
        <div className="text-xs lg:text-sm font-medium text-gray-900 text-left">
          {course.name}
        </div>
      </td>

      {/* Credit Hours */}
      <td className="px-2 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
        <span className="inline-flex items-center px-1.5 lg:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {course.creditHours}
        </span>
      </td>

      {/* Percentage Input */}
      <td className="px-2 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={percentage}
            onChange={(e) => handlePercentageChange(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            className={`w-16 lg:w-20 px-1 lg:px-2 py-1 text-center border rounded-md text-xs lg:text-sm focus:outline-none focus:ring-2 transition-all duration-200 font-medium ${getInputBorderColor()}`}
            placeholder="0-100"
          />
          {error && (
            <div className="absolute top-full left-0 mt-1 text-xs text-red-600 whitespace-nowrap z-10">
              {error}
            </div>
          )}
        </div>
      </td>

      {/* Letter Grade */}
      <td className="px-2 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
        {letterGrade ? (
          <span className={`inline-flex items-center px-1.5 lg:px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(gpaPoints)}`}>
            {letterGrade}
          </span>
        ) : (
          <span className="text-gray-400 text-xs lg:text-sm">-</span>
        )}
      </td>

      {/* GPA Points */}
      <td className="px-2 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
        {gpaPoints > 0 ? (
          <span className={`inline-flex items-center px-1.5 lg:px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(gpaPoints)}`}>
            {gpaPoints.toFixed(3)}
          </span>
        ) : (
          <span className="text-gray-400 text-xs lg:text-sm">-</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-2 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center">
          {percentage && (
            <button
              onClick={handleClear}
              className="text-red-600 hover:text-red-700 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
              title="Clear grade"
            >
              <Trash2 className="h-3 lg:h-4 w-3 lg:w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
