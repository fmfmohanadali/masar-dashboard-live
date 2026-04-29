import PageShell from '../components/PageShell';

export default function SettingsPage({ user }) {
  const apiBase = 'https://masar-backend-oxnm.onrender.com/api';

  function clearSession() {
    localStorage.removeItem('masar_token');
    localStorage.removeItem('masar_user');
    window.location.reload();
  }

  return (
    <PageShell
      title="الإعدادات"
      subtitle="إعدادات النظام والواجهة الحالية"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">رابط الـ API</div>
          <div className="text-lg font-bold text-slate-900 break-all">
            {apiBase}
          </div>
        </div>

        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">المستخدم الحالي</div>
          <div className="text-lg font-bold text-slate-900">
            {user?.username || '-'} / {user?.profile?.role || '-'}
          </div>
        </div>

        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-4">إجراءات الجلسة</div>
          <button
            onClick={clearSession}
            className="bg-rose-600 text-white px-4 py-3 rounded-2xl"
          >
            مسح الجلسة الحالية
          </button>
        </div>

        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-4">إدارة النظام</div>
          https://masar-backend-oxnm.onrender.com/admin/
            فتح لوحة Django Admin
          </a>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-[22px] p-5 text-slate-600 leading-8">
        هذه الصفحة مخصصة حاليًا لإعدادات الواجهة فقط. يمكن لاحقًا إضافة:
        <ul className="list-disc pr-6 mt-2 space-y-1">
          <li>تغيير رابط الـ API من داخل الواجهة</li>
          <li>الوضع الليلي (Dark Mode)</li>
          <li>إعدادات اللغة</li>
          <li>إعدادات التقارير والطباعة</li>
        </ul>
      </div>
    </PageShell>
  );
}