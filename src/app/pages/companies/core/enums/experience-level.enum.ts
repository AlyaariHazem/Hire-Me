export type ExperienceLevel =
  | 'entry'
  | 'junior'
  | 'mid'
  | 'senior'
  | 'expert';

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry',  label: 'مبتدئ (0-2 سنة)' },
  { value: 'junior', label: 'مبتدئ متقدم (2-4 سنوات)' },
  { value: 'mid',    label: 'متوسط (4-7 سنوات)' },
  { value: 'senior', label: 'خبير (7-10 سنوات)' },
  { value: 'expert', label: 'خبير متقدم (10+ سنوات)' },
];
