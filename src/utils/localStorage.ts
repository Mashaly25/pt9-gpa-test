echo "# pt9-gpa-test" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Mashaly25/pt9-gpa-test.git
git push -u origin mainimport { Grade, SemesterData, StudentData } from '@/types';

const STORAGE_KEY = 'pt9-gpa-calculator-data';

/**
 * Save grade data to local storage
 */
export function saveGradeToStorage(semesterNumber: number, grade: Grade): void {
  if (!isClientSide()) return;

  try {
    const existingData = getStudentDataFromStorage();

    // Find or create semester data
    let semesterData = existingData.semesters.find(s => s.semesterNumber === semesterNumber);
    if (!semesterData) {
      console.error('Semester data not found for semester:', semesterNumber);
      return;
    }

    // Ensure grades array exists
    if (!Array.isArray(semesterData.grades)) {
      semesterData.grades = [];
    }

    // Update or add the grade
    const existingGradeIndex = semesterData.grades.findIndex(g => g.courseId === grade.courseId);
    if (existingGradeIndex >= 0) {
      semesterData.grades[existingGradeIndex] = grade;
    } else {
      semesterData.grades.push(grade);
    }

    // Save back to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    console.log('Grade saved successfully:', grade, 'for semester:', semesterNumber);
  } catch (error) {
    console.error('Error saving grade to storage:', error);
  }
}

/**
 * Remove grade from local storage
 */
export function removeGradeFromStorage(semesterNumber: number, courseId: string): void {
  if (!isClientSide()) return;

  try {
    const existingData = getStudentDataFromStorage();

    const semesterData = existingData.semesters.find(s => s.semesterNumber === semesterNumber);
    if (semesterData && Array.isArray(semesterData.grades)) {
      semesterData.grades = semesterData.grades.filter(g => g.courseId !== courseId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
      console.log('Grade removed successfully for course:', courseId, 'in semester:', semesterNumber);
    }
  } catch (error) {
    console.error('Error removing grade from storage:', error);
  }
}

/**
 * Get all student data from local storage
 */
export function getStudentDataFromStorage(): StudentData {
  if (!isClientSide()) {
    return {
      semesters: [],
      cumulativeGPA: 0,
      totalCompletedCreditHours: 0,
      totalCreditHours: 0,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure semesters is always an array
      if (data && typeof data === 'object') {
        data.semesters = Array.isArray(data.semesters) ? data.semesters : [];
        // Ensure each semester has grades array
        data.semesters.forEach((semester: any) => {
          if (!Array.isArray(semester.grades)) {
            semester.grades = [];
          }
        });
        console.log('Loaded student data from storage:', data);
        return data;
      }
    }
  } catch (error) {
    console.error('Error reading from storage:', error);
  }

  // Return default empty data structure
  return {
    semesters: [],
    cumulativeGPA: 0,
    totalCompletedCreditHours: 0,
    totalCreditHours: 0,
  };
}

/**
 * Get grades for a specific semester
 */
export function getSemesterGradesFromStorage(semesterNumber: number): Grade[] {
  try {
    const studentData = getStudentDataFromStorage();
    const semesterData = studentData.semesters.find(s => s.semesterNumber === semesterNumber);
    return semesterData?.grades || [];
  } catch (error) {
    console.error('Error getting semester grades from storage:', error);
    return [];
  }
}

/**
 * Initialize storage with empty semester data if not exists
 */
export function initializeStorageIfNeeded(semesterData: SemesterData[]): void {
  if (!isClientSide()) return;

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      const initialData: StudentData = {
        semesters: semesterData.map(semester => ({
          ...semester,
          grades: [], // Start with empty grades
          gpa: 0,
          completedCreditHours: 0,
        })),
        cumulativeGPA: 0,
        totalCompletedCreditHours: 0,
        totalCreditHours: semesterData.reduce((total, sem) => total + sem.totalCreditHours, 0),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      console.log('Initialized storage with data:', initialData);
    } else {
      // Ensure existing data has proper structure
      const existingData = JSON.parse(existing);
      let needsUpdate = false;

      if (!Array.isArray(existingData.semesters)) {
        existingData.semesters = semesterData.map(semester => ({
          ...semester,
          grades: [],
          gpa: 0,
          completedCreditHours: 0,
        }));
        needsUpdate = true;
      } else {
        // Ensure all semesters exist and have proper structure
        semesterData.forEach(semester => {
          const existingSemester = existingData.semesters.find((s: any) => s.semesterNumber === semester.semesterNumber);
          if (!existingSemester) {
            existingData.semesters.push({
              ...semester,
              grades: [],
              gpa: 0,
              completedCreditHours: 0,
            });
            needsUpdate = true;
          } else if (!Array.isArray(existingSemester.grades)) {
            existingSemester.grades = [];
            needsUpdate = true;
          }
        });
      }

      if (needsUpdate) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
        console.log('Updated storage structure:', existingData);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

/**
 * Update semester GPA in storage
 */
export function updateSemesterGPAInStorage(semesterNumber: number, gpa: number, completedCreditHours: number): void {
  try {
    const existingData = getStudentDataFromStorage();
    const semesterData = existingData.semesters.find(s => s.semesterNumber === semesterNumber);
    
    if (semesterData) {
      semesterData.gpa = gpa;
      semesterData.completedCreditHours = completedCreditHours;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    }
  } catch (error) {
    console.error('Error updating semester GPA in storage:', error);
  }
}

/**
 * Update cumulative GPA in storage
 */
export function updateCumulativeGPAInStorage(cumulativeGPA: number, totalCompletedCreditHours: number): void {
  try {
    const existingData = getStudentDataFromStorage();
    existingData.cumulativeGPA = cumulativeGPA;
    existingData.totalCompletedCreditHours = totalCompletedCreditHours;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.error('Error updating cumulative GPA in storage:', error);
  }
}

/**
 * Clear all data from storage
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

/**
 * Check if running in browser environment
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Debug function to check storage contents
 */
export function debugStorage(): void {
  if (!isClientSide()) return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('Storage contents:', stored ? JSON.parse(stored) : 'No data');
  } catch (error) {
    console.error('Error reading storage for debug:', error);
  }
}
