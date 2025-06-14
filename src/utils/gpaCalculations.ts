import { GRADING_SCALE, Grade, Course, SemesterData } from '@/types';

/**
 * Convert percentage grade to letter grade and GPA points
 */
export function convertPercentageToGrade(percentage: number): { letter: string; points: number } {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }

  const grade = GRADING_SCALE.find(scale => percentage >= scale.min && percentage <= scale.max);
  
  if (!grade) {
    throw new Error('Invalid percentage grade');
  }

  return {
    letter: grade.letter,
    points: grade.points
  };
}

/**
 * Calculate semester GPA
 */
export function calculateSemesterGPA(courses: Course[], grades: Grade[]): number {
  if (grades.length === 0) return 0;

  let totalGradePoints = 0;
  let totalCreditHours = 0;

  grades.forEach(grade => {
    const course = courses.find(c => c.id === grade.courseId);
    if (course) {
      totalGradePoints += grade.gpaPoints * course.creditHours;
      totalCreditHours += course.creditHours;
    }
  });

  return totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0;
}

/**
 * Calculate cumulative GPA across all completed semesters
 */
export function calculateCumulativeGPA(semesters: SemesterData[]): number {
  let totalGradePoints = 0;
  let totalCreditHours = 0;

  semesters.forEach(semester => {
    if (semester.grades.length > 0) {
      semester.grades.forEach(grade => {
        const course = semester.courses.find(c => c.id === grade.courseId);
        if (course) {
          totalGradePoints += grade.gpaPoints * course.creditHours;
          totalCreditHours += course.creditHours;
        }
      });
    }
  });

  return totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0;
}

/**
 * Get completed credit hours for a semester
 */
export function getCompletedCreditHours(courses: Course[], grades: Grade[]): number {
  return grades.reduce((total, grade) => {
    const course = courses.find(c => c.id === grade.courseId);
    return course ? total + course.creditHours : total;
  }, 0);
}

/**
 * Get total credit hours for a semester
 */
export function getTotalCreditHours(courses: Course[]): number {
  return courses.reduce((total, course) => total + course.creditHours, 0);
}

/**
 * Validate percentage input
 */
export function validatePercentage(value: string): { isValid: boolean; error?: string } {
  if (value === '') {
    return { isValid: true }; // Empty is valid (not entered yet)
  }

  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }

  if (num < 0 || num > 100) {
    return { isValid: false, error: 'Percentage must be between 0 and 100' };
  }

  return { isValid: true };
}

/**
 * Format GPA to 3 decimal places
 */
export function formatGPA(gpa: number): string {
  return gpa.toFixed(3);
}

/**
 * Get GPA color based on value for styling
 */
export function getGPAColor(gpa: number): string {
  if (gpa >= 3.7) return 'text-green-600';
  if (gpa >= 3.0) return 'text-blue-600';
  if (gpa >= 2.0) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Get progress percentage for circular progress bar (0-100)
 */
export function getGPAProgress(gpa: number): number {
  return Math.min((gpa / 4.0) * 100, 100);
}
