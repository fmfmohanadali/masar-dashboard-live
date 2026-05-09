export const sectionMeta = {
  dashboard: {
    title: 'لوحة التحكم الرئيسية',
    subtitle: 'نظرة عامة على عمليات الميناء',
    breadcrumb: ['الرئيسية'],
    browserTitle: 'رصيف | الرئيسية',
  },
  bookings: {
    title: 'الحجوزات',
    subtitle: 'إدارة الفترات الزمنية المتاحة للحجوزات',
    breadcrumb: ['الرئيسية', 'الحجوزات'],
    browserTitle: 'رصيف | الحجوزات',
  },
  trips: {
    title: 'الرحلات',
    subtitle: 'عرض وإدارة الرحلات الحالية',
    breadcrumb: ['الرئيسية', 'الرحلات'],
    browserTitle: 'رصيف | الرحلات',
  },
  'transport-requests': {
  title: 'طلبات النقل',
  subtitle: 'إدارة طلبات النقل من تصريح الإفراج حتى إصدار QR',
  breadcrumb: ['الرئيسية', 'طلبات النقل'],
  browserTitle: 'رصيف | طلبات النقل',
  },
  containers: {
    title: 'الحاويات',
    subtitle: 'عرض الحاويات المشتقة من بيانات الرحلات',
    breadcrumb: ['الرئيسية', 'الحاويات'],
    browserTitle: 'رصيف | الحاويات',
  },
  trucks: {
    title: 'الشاحنات',
    subtitle: 'عرض الشاحنات الفعلية المستخرجة من بيانات الرحلات',
    breadcrumb: ['الرئيسية', 'الشاحنات'],
    browserTitle: 'رصيف | الشاحنات',
  },
  ships: {
    title: 'السفن',
    subtitle: 'مؤشرات تشغيل بحرية مشتقة من بيانات الميناء الحالية',
    breadcrumb: ['الرئيسية', 'السفن'],
    browserTitle: 'رصيف | السفن',
  },
  checkpoints: {
    title: 'نقاط التفتيش',
    subtitle: 'عرض نقاط التفتيش وحالتها التشغيلية',
    breadcrumb: ['الرئيسية', 'نقاط التفتيش'],
    browserTitle: 'رصيف | نقاط التفتيش',
  },
  reports: {
    title: 'التقارير',
    subtitle: 'عرض تقرير الدوران والبيانات التحليلية',
    breadcrumb: ['الرئيسية', 'التقارير'],
    browserTitle: 'رصيف | التقارير',
  },
  users: {
    title: 'المستخدمون',
    subtitle: 'عرض المستخدم الحالي والوصول إلى إدارة المستخدمين',
    breadcrumb: ['الرئيسية', 'المستخدمون'],
    browserTitle: 'رصيف | المستخدمون',
  },
  settings: {
    title: 'الإعدادات',
    subtitle: 'إعدادات النظام والواجهة الحالية',
    breadcrumb: ['الرئيسية', 'الإعدادات'],
    browserTitle: 'رصيف | الإعدادات',
  },
};

export function getSectionMeta(activeSection) {
  return sectionMeta[activeSection] || sectionMeta.dashboard;
}