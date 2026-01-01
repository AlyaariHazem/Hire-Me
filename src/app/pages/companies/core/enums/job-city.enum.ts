export type JobCity =
  | 'abyan'
  | 'aden'
  | 'al_bayda'
  | 'al_hudaydah'
  | 'al_jawf'
  | 'al_maharah'
  | 'al_mahwit'
  | 'amran'
  | 'dhamar'
  | 'hadhramaut'
  | 'hajjah'
  | 'ibb'
  | 'lahij'
  | 'marib'
  | 'raymah'
  | 'remote'
  | 'saada'
  | 'sanaa'
  | 'shabwah'
  | 'socotra'
  | 'taiz';

export const JOB_CITIES: { value: JobCity; label: string }[] = [
  { value: 'sanaa',        label: 'صنعاء' },
  { value: 'aden',         label: 'عدن' },
  { value: 'abyan',        label: 'أبين' },
  { value: 'amran',        label: 'عمران' },
  { value: 'al_bayda',     label: 'البيضاء' },
  { value: 'al_hudaydah',  label: 'الحديدة' },
  { value: 'al_jawf',      label: 'الجوف' },
  { value: 'al_maharah',    label: 'المهرة' },
  { value: 'al_mahwit',    label: 'المحويت' },
  { value: 'dhamar',       label: 'ذمار' },
  { value: 'hadhramaut',   label: 'حضرموت' },
  { value: 'hajjah',       label: 'حجة' },
  { value: 'ibb',          label: 'إب' },
  { value: 'lahij',        label: 'لحج' },
  { value: 'marib',        label: 'مأرب' },
  { value: 'raymah',       label: 'ريمة' },
  { value: 'saada',        label: 'صعدة' },
  { value: 'shabwah',      label: 'شبوة' },
  { value: 'socotra',      label: 'سقطرى' },
  { value: 'taiz',         label: 'تعز' },
  { value: 'remote',       label: 'عمل عن بُعد' },
];
