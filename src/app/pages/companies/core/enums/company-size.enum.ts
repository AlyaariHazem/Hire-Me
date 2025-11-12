export type CompanySize =
  | 'startup'
  | 'small'
  | 'medium'
  | 'large'
  | 'enterprise';

export const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: 'startup', label: 'ناشئة (1-10 موظفين)' },
  { value: 'small', label: 'صغيرة (11-50 موظفًا)' },
  { value: 'medium', label: 'متوسطة (51-200 موظف)' },
  { value: 'large', label: 'كبيرة (201-1000 موظف)' },
  { value: 'enterprise', label: 'مؤسسة (+1000 موظف)' },
];
