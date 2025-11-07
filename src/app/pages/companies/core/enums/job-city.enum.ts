export type JobCity =
  | 'sanaa'
  | 'aden'
  | 'taiz'
  | 'hodeidah'
  | 'ibb'
  | 'dhamar'
  | 'mukalla'
  | 'remote';

export const JOB_CITIES: { value: JobCity; label: string }[] = [
  { value: 'sanaa',     label: 'صنعاء' },
  { value: 'aden',      label: 'عدن' },
  { value: 'taiz',      label: 'تعز' },
  { value: 'hodeidah',  label: 'الحديدة' },
  { value: 'ibb',       label: 'إب' },
  { value: 'dhamar',    label: 'ذمار' },
  { value: 'mukalla',   label: 'المكلا' },
  { value: 'remote',    label: 'عمل عن بُعد' },
];
