export type JobType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'freelance'
  | 'internship';

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full_time',  label: 'دوام كامل' },
  { value: 'part_time',  label: 'دوام جزئي' },
  { value: 'contract',   label: 'عقد مؤقت' },
  { value: 'freelance',  label: 'عمل حر' },
  { value: 'internship', label: 'تدريب' },
];
