export type EducationLevel =
  | 'high_school'
  | 'diploma'
  | 'bachelor'
  | 'master'
  | 'phd'
  | 'any';

export const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: 'high_school', label: 'ثانوية عامة' },
  { value: 'diploma',     label: 'دبلوم' },
  { value: 'bachelor',    label: 'بكالوريوس' },
  { value: 'master',      label: 'ماجستير' },
  { value: 'phd',         label: 'دكتوراه' },
  { value: 'any',         label: 'غير محدد' },
];
