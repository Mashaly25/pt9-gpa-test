'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import CircularProgress from '@/components/CircularProgress';
import { SEMESTER_COURSES } from '@/types';
import { getStudentDataFromStorage, initializeStorageIfNeeded, isClientSide } from '@/utils/localStorage';
import { calculateCumulativeGPA, getTotalCreditHours, getCompletedCreditHours } from '@/utils/gpaCalculations';
import { BookOpen, TrendingUp } from 'lucide-react';

export default function Home() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isClientSide()) {
      // Initialize storage with semester data
      const semesterData = Object.entries(SEMESTER_COURSES).map(([semesterNum, courses]) => ({
        semesterNumber: parseInt(semesterNum),
        courses,
        grades: [],
        gpa: 0,
        totalCreditHours: getTotalCreditHours(courses),
        completedCreditHours: 0,
      }));

      initializeStorageIfNeeded(semesterData);

      // Load student data
      const data = getStudentDataFromStorage();
      setStudentData(data);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Ensure semesters is an array before filtering
  const semesters = Array.isArray(studentData?.semesters) ? studentData.semesters : [];
  const cumulativeGPA = calculateCumulativeGPA(semesters);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PT9 GPA Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            
            Calculate semester GPAs and monitor your cumulative performance.
          </p>
        </div>



        {/* Cumulative GPA Display */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Overall Performance</h2>
          <div className="flex justify-center">
            <CircularProgress
              gpa={cumulativeGPA}
              size={200}
              strokeWidth={12}
              label="Cumulative GPA"
            />
          </div>
          <div className="mt-6">
            <Link
              href="/cumulative"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              View Detailed Analysis
            </Link>
          </div>
        </div>

        {/* Semester Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Semester Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((semesterNum) => {
              const semesterData = studentData?.semesters?.find((s: any) => s.semesterNumber === semesterNum);
              const hasGrades = semesterData?.grades?.length > 0;
              const gpa = semesterData?.gpa || 0;

              return (
                <Link
                  key={semesterNum}
                  href={`/semester/${semesterNum}`}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-200 text-center hover:scale-105"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Semester {semesterNum}
                  </h3>

                  {hasGrades ? (
                    <CircularProgress
                      gpa={gpa}
                      size={80}
                      strokeWidth={6}
                      showLabel={false}
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      {hasGrades ? `GPA: ${gpa.toFixed(3)}` : 'Not Started'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {SEMESTER_COURSES[semesterNum]?.length || 0} courses
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
