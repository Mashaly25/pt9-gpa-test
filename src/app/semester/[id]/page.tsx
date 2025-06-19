'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import CircularProgress from '@/components/CircularProgress';
import CourseTableRow from '@/components/CourseTableRow';
import { SEMESTER_COURSES, Grade, Course } from '@/types';
import {
  getStudentDataFromStorage,
  saveGradeToStorage,
  removeGradeFromStorage,
  updateSemesterGPAInStorage,
  updateCumulativeGPAInStorage,
  initializeStorageIfNeeded,
  isClientSide
} from '@/utils/localStorage';
import { 
  calculateSemesterGPA, 
  calculateCumulativeGPA,
  getCompletedCreditHours,
  getTotalCreditHours 
} from '@/utils/gpaCalculations';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SemesterPage() {
  const params = useParams();
  const router = useRouter();
  const semesterNumber = parseInt(params.id as string);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [semesterGPA, setSemesterGPA] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);

  useEffect(() => {
    if (isClientSide()) {
      // Validate semester number
      if (semesterNumber < 1 || semesterNumber > 10) {
        router.push('/');
        return;
      }

      // Load semester courses
      const semesterCourses = SEMESTER_COURSES[semesterNumber];
      if (!semesterCourses) {
        router.push('/');
        return;
      }

      setCourses(semesterCourses);

      // Initialize storage with semester data first
      const semesterData = Object.entries(SEMESTER_COURSES).map(([semesterNum, courses]) => ({
        semesterNumber: parseInt(semesterNum),
        courses,
        grades: [],
        gpa: 0,
        totalCreditHours: getTotalCreditHours(courses),
        completedCreditHours: 0,
      }));

      initializeStorageIfNeeded(semesterData);

      // Load existing grades
      const data = getStudentDataFromStorage();
      setStudentData(data);

      const currentSemesterData = data.semesters.find(s => s.semesterNumber === semesterNumber);
      if (currentSemesterData) {
        setGrades(currentSemesterData.grades || []);
        setSemesterGPA(currentSemesterData.gpa || 0);
        console.log('Loaded grades for semester', semesterNumber, ':', currentSemesterData.grades);
      } else {
        console.log('No semester data found for semester', semesterNumber);
        setGrades([]);
        setSemesterGPA(0);
      }

      setIsLoading(false);
    }
  }, [semesterNumber, router]);

  const handleGradeChange = (courseId: string, grade: Grade | null) => {
    let updatedGrades: Grade[];
    
    if (grade) {
      // Add or update grade
      const existingIndex = grades.findIndex(g => g.courseId === courseId);
      if (existingIndex >= 0) {
        updatedGrades = [...grades];
        updatedGrades[existingIndex] = grade;
      } else {
        updatedGrades = [...grades, grade];
      }
      saveGradeToStorage(semesterNumber, grade);
    } else {
      // Remove grade
      updatedGrades = grades.filter(g => g.courseId !== courseId);
      removeGradeFromStorage(semesterNumber, courseId);
    }

    setGrades(updatedGrades);

    // Recalculate semester GPA
    const newSemesterGPA = calculateSemesterGPA(courses, updatedGrades);
    setSemesterGPA(newSemesterGPA);

    // Update storage
    const completedCreditHours = getCompletedCreditHours(courses, updatedGrades);
    updateSemesterGPAInStorage(semesterNumber, newSemesterGPA, completedCreditHours);

    // Recalculate cumulative GPA
    const updatedStudentData = getStudentDataFromStorage();
    const cumulativeGPA = calculateCumulativeGPA(updatedStudentData.semesters);
    const totalCompletedCreditHours = updatedStudentData.semesters.reduce((total, sem) => 
      total + getCompletedCreditHours(sem.courses, sem.grades), 0
    );
    updateCumulativeGPAInStorage(cumulativeGPA, totalCompletedCreditHours);
  };

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

  const totalCreditHours = getTotalCreditHours(courses);
  const completedCreditHours = getCompletedCreditHours(courses, grades);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Semester {semesterNumber}
            </h1>
            <p className="text-xl text-gray-600">
              Enter your percentage grades for each course to calculate your semester GPA
            </p>
          </div>
        </div>



        {/* Courses Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Grades</h2>

          {/* Table for all screen sizes */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <tr>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-2 lg:px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-2 lg:px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Letter Grade
                    </th>
                    <th className="px-2 lg:px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Credit Hours
                    </th>
                    <th className="px-2 lg:px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      GPA Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course, index) => {
                    const existingGrade = grades.find(g => g.courseId === course.id);
                    return (
                      <CourseTableRow
                        key={course.id}
                        course={course}
                        existingGrade={existingGrade}
                        onGradeChange={(grade) => handleGradeChange(course.id, grade)}
                        isEven={index % 2 === 0}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* GPA Display */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Semester {semesterNumber} GPA</h2>
          <div className="flex justify-center">
            <CircularProgress
              gpa={semesterGPA}
              size={200}
              strokeWidth={12}
              label={`Semester ${semesterNumber} GPA`}
            />
          </div>
          {grades.length > 0 && (
            <div className="mt-6 text-gray-600">
              <p>Based on {grades.length} completed course{grades.length !== 1 ? 's' : ''}</p>
              <p className="text-sm mt-1">
                {completedCreditHours} of {totalCreditHours} credit hours completed
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {semesterNumber > 1 && (
              <Link
                href={`/semester/${semesterNumber - 1}`}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 ml-2" />
                Previous Semester
              </Link>
            )}
          </div>

          <div>
            {semesterNumber < 10 && (
              <Link
                href={`/semester/${semesterNumber + 1}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Next Semester
                <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
