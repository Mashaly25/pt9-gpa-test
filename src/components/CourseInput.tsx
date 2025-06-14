'use client';

import React, { useState, useEffect } from 'react';
import { Course, Grade } from '@/types';
import { convertPercentageToGrade, validatePercentage } from '@/utils/gpaCalculations';
import { Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface CourseInputProps {
  course: Course;
  existingGrade?: Grade;
  onGradeChange: (grade: Grade | null) => void;
}

export default function CourseInput({ course, existingGrade, onGradeChange }: CourseInputProps) {
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

      const grade: Grade = {
        courseId: course.id,
        percentage: numValue,
        letterGrade: gradeInfo.letter,
        gpaPoints: gradeInfo.points,
      };

      onGradeChange(grade);
    } catch (err) {
      setError('Invalid percentage value');
    }
  };

  const handleClear = () => {
    setPercentage('');
    setLetterGrade('');
    setGpaPoints(0);
    setError('');
    onGradeChange(null);
  };

  const getInputBorderColor = () => {
    if (error) return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    if (percentage && !error) return 'border-green-300 focus:border-green-500 focus:ring-green-500';
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  const getGradeColor = (points: number) => {
    if (points >= 3.7) return 'text-green-600 bg-green-50';
    if (points >= 3.0) return 'text-blue-600 bg-blue-50';
    if (points >= 2.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-right">
            {course.name}
          </h3>
          <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {course.creditHours} credit hour{course.creditHours !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {percentage && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
            title="Clear grade"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Percentage Input */}
        <div>
          <label htmlFor={`percentage-${course.id}`} className="block text-sm font-medium text-gray-700 mb-2">
            Percentage Grade (0-100)
          </label>
          <div className="relative">
            <input
              id={`percentage-${course.id}`}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={percentage}
              onChange={(e) => handlePercentageChange(e.target.value)}
              className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 text-center text-lg font-medium ${getInputBorderColor()}`}
              placeholder="Enter percentage (e.g., 85.5)"
            />
            {percentage && !error && (
              <CheckCircle className="absolute left-3 top-3.5 h-5 w-5 text-green-500" />
            )}
            {error && (
              <AlertCircle className="absolute left-3 top-3.5 h-5 w-5 text-red-500" />
            )}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Grade Display */}
        {letterGrade && !error && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Letter Grade</div>
                <div className={`px-3 py-2 rounded-lg text-sm font-bold ${getGradeColor(gpaPoints)}`}>
                  {letterGrade}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">GPA Points</div>
                <div className={`px-3 py-2 rounded-lg text-sm font-bold ${getGradeColor(gpaPoints)}`}>
                  {gpaPoints.toFixed(3)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
