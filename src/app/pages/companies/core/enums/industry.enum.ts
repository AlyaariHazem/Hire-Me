export type IndustryType =
  | 'technology'
  | 'healthcare'
  | 'education'
  | 'finance'
  | 'construction'
  | 'retail'
  | 'manufacturing'
  | 'telecommunications'
  | 'other';

export const INDUSTRY_TYPES: { value: IndustryType; label: string }[] = [
  { value: 'technology', label: 'تقنية المعلومات' },
  { value: 'healthcare', label: 'الرعاية الصحية' },
  { value: 'education', label: 'التعليم' },
  { value: 'finance', label: 'المالية والمصرفية' },
  { value: 'construction', label: 'البناء والتشييد' },
  { value: 'retail', label: 'التجارة والبيع بالتجزئة' },
  { value: 'manufacturing', label: 'الصناعة' },
  { value: 'telecommunications', label: 'الاتصالات' },
  { value: 'other', label: 'أخرى' },
];
