'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import CircularProgress from '@/components/CircularProgress';
import { getStudentDataFromStorage, isClientSide } from '@/utils/localStorage';
import { calculateCumulativeGPA } from '@/utils/gpaCalculations';
import { ArrowLeft, TrendingUp, Award, BookOpen, BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CumulativePage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isClientSide()) {
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
  const completedSemesters = semesters.filter((s: any) => s.grades && s.grades.length > 0);
  const cumulativeGPA = calculateCumulativeGPA(semesters);
  const totalCompletedCreditHours = studentData?.totalCompletedCreditHours || 0;
  const totalCreditHours = studentData?.totalCreditHours || 0;

  // Prepare chart data
  const chartLabels = completedSemesters.map((s: any) => `Semester ${s.semesterNumber}`);
  const semesterGPAs = completedSemesters.map((s: any) => s.gpa);
  


  const barChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Semester GPA',
        data: semesterGPAs,
        backgroundColor: semesterGPAs.map((gpa: number) => {
          if (gpa >= 3.7) return 'rgba(34, 197, 94, 0.8)'; // green
          if (gpa >= 3.0) return 'rgba(59, 130, 246, 0.8)'; // blue
          if (gpa >= 2.0) return 'rgba(245, 158, 11, 0.8)'; // yellow
          return 'rgba(239, 68, 68, 0.8)'; // red
        }),
        borderColor: semesterGPAs.map((gpa: number) => {
          if (gpa >= 3.7) return 'rgba(34, 197, 94, 1)';
          if (gpa >= 3.0) return 'rgba(59, 130, 246, 1)';
          if (gpa >= 2.0) return 'rgba(245, 158, 11, 1)';
          return 'rgba(239, 68, 68, 1)';
        }),
        borderWidth: 2,
      },
    ],
  };



  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 4.0,
        ticks: {
          stepSize: 0.5,
        },
      },
    },
  };

  const getGPAStatus = (gpa: number) => {
    if (gpa >= 3.7) return { text: 'Excellent', color: 'text-green-600' };
    if (gpa >= 3.0) return { text: 'Good', color: 'text-blue-600' };
    if (gpa >= 2.0) return { text: 'Satisfactory', color: 'text-yellow-600' };
    return { text: 'Needs Improvement', color: 'text-red-600' };
  };

  const status = getGPAStatus(cumulativeGPA);

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
              Cumulative GPA Analysis
            </h1>
            <p className="text-xl text-gray-600">
              Track your overall academic performance and progress over time
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Semesters</h3>
            <p className="text-3xl font-bold text-blue-600">{completedSemesters.length}/10</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Credit Hours</h3>
            <p className="text-3xl font-bold text-green-600">{totalCompletedCreditHours}/{totalCreditHours}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
            <p className="text-3xl font-bold text-purple-600">
              {totalCreditHours > 0 ? Math.round((totalCompletedCreditHours / totalCreditHours) * 100) : 0}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
            <p className={`text-lg font-bold ${status.color}`}>{status.text}</p>
          </div>
        </div>

        {/* Cumulative GPA Display */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Cumulative GPA</h2>
          <div className="flex justify-center">
            <CircularProgress 
              gpa={cumulativeGPA} 
              size={250} 
              strokeWidth={15}
              label="Cumulative GPA"
            />
          </div>
          <div className="mt-6">
            <p className={`text-2xl font-bold ${status.color}`}>
              {status.text}
            </p>
            <p className="text-gray-600 mt-2">
              Based on {completedSemesters.length} completed semester{completedSemesters.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Charts */}
        {completedSemesters.length > 0 && (
          <div className="mb-8">
            {/* Semester GPA Bar Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Semester GPA Comparison</h3>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Semester Details Table */}
        {completedSemesters.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Semester Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester GPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedSemesters.map((semester: any) => (
                    <tr key={semester.semesterNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Semester {semester.semesterNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {semester.grades.length}/{semester.courses.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {semester.completedCreditHours}/{semester.totalCreditHours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getGPAStatus(semester.gpa).color}`}>
                          {semester.gpa.toFixed(3)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <Link
                          href={`/semester/${semester.semesterNumber}`}
                          className="hover:text-blue-700 transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {completedSemesters.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Completed Semesters</h3>
            <p className="text-gray-600 mb-6">
              Start by entering your grades for your first semester to see your cumulative GPA analysis.
            </p>
            <Link
              href="/semester/1"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start with Semester 1
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
