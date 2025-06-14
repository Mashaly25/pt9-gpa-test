// Types for the GPA Calculator Application

export interface Course {
  id: string;
  name: string;
  creditHours: number;
}

export interface Grade {
  courseId: string;
  percentage: number;
  letterGrade: string;
  gpaPoints: number;
}

export interface SemesterData {
  semesterNumber: number;
  courses: Course[];
  grades: Grade[];
  gpa: number;
  totalCreditHours: number;
  completedCreditHours: number;
}

export interface StudentData {
  semesters: SemesterData[];
  cumulativeGPA: number;
  totalCompletedCreditHours: number;
  totalCreditHours: number;
}

// Grading system constants
export const GRADING_SCALE = [
  { min: 97, max: 100, letter: 'A+', points: 4.00 },
  { min: 93, max: 96.99, letter: 'A', points: 4.00 },
  { min: 89, max: 92.99, letter: 'A-', points: 3.70 },
  { min: 84, max: 88.99, letter: 'B+', points: 3.30 },
  { min: 80, max: 83.99, letter: 'B', points: 3.00 },
  { min: 76, max: 79.99, letter: 'B-', points: 2.70 },
  { min: 73, max: 75.99, letter: 'C+', points: 2.30 },
  { min: 70, max: 72.99, letter: 'C', points: 2.00 },
  { min: 67, max: 69.99, letter: 'C-', points: 1.70 },
  { min: 64, max: 66.99, letter: 'D+', points: 1.30 },
  { min: 60, max: 63.99, letter: 'D', points: 1.00 },
  { min: 0, max: 59.99, letter: 'F', points: 0.00 },
];

// Semester courses data
export const SEMESTER_COURSES: Record<number, Course[]> = {
  1: [
    { id: 's1-anatomy1', name: 'Human Anatomy I', creditHours: 3 },
    { id: 's1-physiology1', name: 'Physiology I', creditHours: 3 },
    { id: 's1-histology1', name: 'Histology I', creditHours: 3 },
    { id: 's1-psychology', name: 'Psychology of Handicapped', creditHours: 2 },
    { id: 's1-english', name: 'English', creditHours: 2 },
    { id: 's1-human-rights', name: 'Human Rights and Citizenship', creditHours: 2 },
    { id: 's1-biophysics', name: 'Biophysics', creditHours: 4 },
    { id: 's1-elective', name: 'University Elective Course', creditHours: 2 },
  ],
  2: [
    { id: 's2-anatomy2', name: 'Human Anatomy II', creditHours: 3 },
    { id: 's2-physiology2', name: 'Physiology II', creditHours: 3 },
    { id: 's2-biochemistry1', name: 'Biochemistry I', creditHours: 3 },
    { id: 's2-histology2', name: 'Histology II', creditHours: 2 },
    { id: 's2-pathology1', name: 'Pathology I', creditHours: 3 },
    { id: 's2-kinesiology', name: 'Kinesiology', creditHours: 2 },
    { id: 's2-molecular', name: 'Molecular Biology', creditHours: 1 },
    { id: 's2-elective1', name: 'University Elective Course', creditHours: 2 },
    { id: 's2-elective2', name: 'University Elective Course', creditHours: 2 },
  ],
  3: [
    { id: 's3-neuroanatomy', name: 'Neuroanatomy', creditHours: 3 },
    { id: 's3-physiology3', name: 'Physiology III', creditHours: 3 },
    { id: 's3-biochemistry2', name: 'Biochemistry II', creditHours: 3 },
    { id: 's3-tests1', name: 'Tests and Measurements I', creditHours: 3 },
    { id: 's3-hydrotherapy', name: 'Hydrotherapy', creditHours: 2 },
    { id: 's3-biomechanics1', name: 'Biomechanics I', creditHours: 3 },
    { id: 's3-electrotherapy1', name: 'Electrotherapy I', creditHours: 3 },
    { id: 's3-public-health', name: 'Public Health', creditHours: 1 },
  ],
  4: [
    { id: 's4-anatomy3', name: 'Human Anatomy III', creditHours: 3 },
    { id: 's4-exercise-physiology', name: 'Exercise Physiology', creditHours: 2 },
    { id: 's4-physiology4', name: 'Physiology IV', creditHours: 2 },
    { id: 's4-tests2', name: 'Tests and Measurements II', creditHours: 3 },
    { id: 's4-electrotherapy2', name: 'Electrotherapy II', creditHours: 3 },
    { id: 's4-therapeutic1', name: 'Therapeutic Exercises I', creditHours: 3 },
    { id: 's4-manual', name: 'Manual Therapy', creditHours: 2 },
    { id: 's4-biomechanics2', name: 'Biomechanics II', creditHours: 3 },
  ],
  5: [
    { id: 's5-radiology', name: 'Radiology and Imaging', creditHours: 2 },
    { id: 's5-pathology2', name: 'Pathology II', creditHours: 2 },
    { id: 's5-cardiovascular', name: 'Cardiovascular Pulmonary', creditHours: 2 },
    { id: 's5-cardiovascular-pt', name: 'Cardiovascular Pulmonary PT', creditHours: 4 },
    { id: 's5-immunology', name: 'Immunology', creditHours: 1 },
    { id: 's5-therapeutic2', name: 'Therapeutic Exercises II', creditHours: 3 },
    { id: 's5-rehabilitation', name: 'Principles of Rehabilitation', creditHours: 1 },
    { id: 's5-nutrition', name: 'Nutrition', creditHours: 1 },
    { id: 's5-quality', name: 'Quality Principles', creditHours: 2 },
    { id: 's5-ergonomics', name: 'Ergonomics', creditHours: 2 },
  ],
  6: [
    { id: 's6-pharmacology', name: 'Pharmacology', creditHours: 2 },
    { id: 's6-intensive-care', name: 'Intensive Care', creditHours: 1 },
    { id: 's6-intensive-pt', name: 'Intensive Care Physical Therapy', creditHours: 3 },
    { id: 's6-organization', name: 'Physical Therapy Organization and Management', creditHours: 1 },
    { id: 's6-obstetric', name: 'Obstetric & Gynecology', creditHours: 2 },
    { id: 's6-woman-health', name: 'Woman Health Physical Therapy', creditHours: 6 },
    { id: 's6-obesity', name: 'Obesity Management', creditHours: 1 },
    { id: 's6-university-elective', name: 'University Elective Course', creditHours: 2 },
    { id: 's6-faculty-elective', name: 'Faculty Elective Course', creditHours: 2 },
  ],
  7: [
    { id: 's7-traumatology', name: 'Traumatology', creditHours: 2 },
    { id: 's7-orthopedics', name: 'Orthopedics and its Surgery', creditHours: 2 },
    { id: 's7-musculoskeletal1', name: 'Musculoskeletal Physical Therapy I', creditHours: 4 },
    { id: 's7-orthotics', name: 'Orthotics and Prosthesis', creditHours: 1 },
    { id: 's7-sports', name: 'Physical Therapy for Sports Injury', creditHours: 3 },
    { id: 's7-biostatistics', name: 'Biostatistics', creditHours: 1 },
    { id: 's7-community', name: 'Community Medicine', creditHours: 1 },
    { id: 's7-communication', name: 'Communication Skills for Physical Therapy', creditHours: 2 },
    { id: 's7-faculty-elective1', name: 'Faculty Elective Course', creditHours: 2 },
    { id: 's7-faculty-elective2', name: 'Faculty Elective Course', creditHours: 2 },
  ],
  8: [
    { id: 's8-musculoskeletal2', name: 'Musculoskeletal Physical Therapy II', creditHours: 4 },
    { id: 's8-clinical-reasoning', name: 'Clinical Reasoning in Orthopedics', creditHours: 1 },
    { id: 's8-dermatology', name: 'Dermatology', creditHours: 1 },
    { id: 's8-burn-surgery', name: 'Burn and Plastic Surgery', creditHours: 1 },
    { id: 's8-burn-pt', name: 'Physical Therapy for Burn and Plastic Surgery', creditHours: 4 },
    { id: 's8-integumentary', name: 'Integumentary Physical Therapy', creditHours: 2 },
    { id: 's8-research', name: 'Research and Evidence Based Practice', creditHours: 2 },
    { id: 's8-faculty-elective1', name: 'Faculty Elective Course', creditHours: 2 },
    { id: 's8-faculty-elective2', name: 'Faculty Elective Course', creditHours: 2 },
  ],
  9: [
    { id: 's9-neurology', name: 'Neurology and Neurosurgery', creditHours: 2 },
    { id: 's9-neuromuscular', name: 'Physical Therapy for Neuromuscular disorders', creditHours: 5 },
    { id: 's9-electrodiagnosis', name: 'Electrodiagnosis', creditHours: 3 },
    { id: 's9-psychiatry', name: 'Psychiatry', creditHours: 2 },
    { id: 's9-neurological', name: 'Neurological Rehabilitation', creditHours: 4 },
    { id: 's9-motor-control', name: 'Motor Control', creditHours: 2 },
    { id: 's9-capstone', name: 'Scientific Writing and Capstone Project', creditHours: 2 },
  ],
  10: [
    { id: 's10-pediatric-surgery', name: 'Pediatric and its Surgery', creditHours: 2 },
    { id: 's10-motor-development', name: 'Motor Development', creditHours: 1 },
    { id: 's10-pediatric-pt', name: 'Pediatrics Physical Therapy And Its Surgery', creditHours: 6 },
    { id: 's10-pediatric-rehab', name: 'Pediatrics Rehabilitation', creditHours: 4 },
    { id: 's10-geriatric', name: 'Geriatric', creditHours: 1 },
    { id: 's10-geriatric-rehab', name: 'Geriatric Rehabilitation', creditHours: 3 },
    { id: 's10-differential', name: 'Differential Diagnosis in Physical Therapy', creditHours: 1 },
    { id: 's10-pediatric-ot', name: 'Pediatric Occupational Therapy', creditHours: 2 },
    { id: 's10-capstone-final', name: 'Scientific Writing and Capstone Project', creditHours: 1 },
  ],
};
