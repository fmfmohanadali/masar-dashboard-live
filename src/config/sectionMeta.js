export const sectionMeta = {
  dashboard: {
    title: 'لوحة التحكم الرئيسية',
    subtitle: 'نظرة عامة على عمليات الميناء',
    breadcrumb: ['الرئيسية'],
    browserTitle: 'مسار | الرئيسية',
  },
  bookings: {
    title: 'الحجوزات',
    subtitle: 'إدارة الفترات الزمنية المتاحة للحجوزات',
    breadcrumb: ['الرئيسية', 'الحجوزات'],
    browserTitle: 'مسار | الحجوزات',
  },
  trips: {
    title: 'الرحلات',
    subtitle: 'عرض وإدارة الرحلات الحالية',
    breadcrumb: ['الرئيسية', 'الرحلات'],
    browserTitle: 'مسار | الرحلات',
  },
  containers: {
    title: 'الحاويات',
    subtitle: 'عرض الحاويات المشتقة من بيانات الرحلات',
    breadcrumb: ['الرئيسية', 'الحاويات'],
    browserTitle: 'مسار | الحاويات',
  },
  trucks: {
    title: 'الشاحنات',
    subtitle: 'عرض الشاحنات الفعلية المستخرجة من بيانات الرحلات',
    breadcrumb: ['الرئيسية', 'الشاحنات'],
    browserTitle: 'مسار | الشاحنات',
  },
  ships: {
    title: 'السفن',
    subtitle: 'مؤشرات تشغيل بحرية مشتقة من بيانات الميناء الحالية',
    breadcrumb: ['الرئيسية', 'السفن'],
    browserTitle: 'مسار | السفن',
  },
  checkpoints: {
    title: 'نقاط التفتيش',
    subtitle: 'عرض نقاط التفتيش وحالتها التشغيلية',
    breadcrumb: ['الرئيسية', 'نقاط التفتيش'],
    browserTitle: 'مسار | نقاط التفتيش',
  },
  reports: {
    title: 'التقارير',
    subtitle: 'عرض تقرير الدوران والبيانات التحليلية',
    breadcrumb: ['الرئيسية', 'التقارير'],
    browserTitle: 'مسار | التقارير',
  },
  users: {
    title: 'المستخدمون',
    subtitle: 'عرض المستخدم الحالي والوصول إلى إدارة المستخدمين',
    breadcrumb: ['الرئيسية', 'المستخدمون'],
    browserTitle: 'مسار | المستخدمون',
  },
  settings: {
    title: 'الإعدادات',
    subtitle: 'إعدادات النظام والواجهة الحالية',
    breadcrumb: ['الرئيسية', 'الإعدادات'],
    browserTitle: 'مسار | الإعدادات',
  },
};

export function getSectionMeta(activeSection) {
  return sectionMeta[activeSection] || sectionMeta.dashboard;
}