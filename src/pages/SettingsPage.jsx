import PageShell from '../components/PageShell';

const apiBase = 'https://masar-backend-oxnm.onrender.com/api';

export default function SettingsPage({ user }) {
  function clearSession() {
    localStorage.removeItem('masar_token');
    localStorage.removeItem('masar_user');
    window.location.reload();
  }

  return (
    <PageShell
      title="الإعدادات"
      subtitle="إعدادات النظام والواجهة الحالية"
      actions={
        <a
          href="https://masar-backend-oxnm.onrender.com/admin/"
          target="_blank"
          rel="noreferrer"
          className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-2xl hover:bg-slate-50 transition font-bold"
        >
          فتح Django Admin
        </a>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">رابط الـ API</div>
          <div className="font-mono text-sm bg-slate-50 border border-slate-100 rounded-2xl p-3 break-all">
            {apiBase}
          </div>
        </div>

        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">المستخدم الحالي</div>
          <div className="text-lg font-bold text-slate-900">
            {user?.username || '-'} / {user?.profile?.role || '-'}
          </div>
        </div>

        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 xl:col-span-2">
          <div className="text-lg font-black text-slate-900 mb-3">
            إجراءات الجلسة
          </div>

          <button
            onClick={clearSession}
            className="bg-red-600 text-white rounded-2xl px-5 py-3 hover:bg-red-700 transition font-bold"
          >
            مسح الجلسة الحالية
          </button>
        </div>

        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 xl:col-span-2">
          <div className="text-lg font-black text-slate-900 mb-3">
            ملاحظات مستقبلية
          </div>

          <ul className="list-disc pr-5 text-slate-600 leading-8">
            <li>تغيير رابط الـ API من داخل الواجهة.</li>
            <li>الوضع الليلي.</li>
            <li>إعدادات اللغة.</li>
            <li>إعدادات التقارير والطباعة.</li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}