import { useEffect, useState } from 'react';
import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function UsersPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/auth/me/');
        if (!mounted) return;
        setUser(res.data || null);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || 'تعذر تحميل بيانات المستخدم');
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <PageShell
      title="المستخدمون"
      subtitle="عرض المستخدم الحالي والوصول إلى إدارة المستخدمين"
      actions={
        <a
          href="https://masar-backend-oxnm.onrender.com/admin/"
          target="_blank"
          rel="noreferrer"
          className="bg-brand text-white px-4 py-3 rounded-2xl"
        >
          فتح Django Admin
        </a>
      }
    >
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingCard text="جاري تحميل بيانات المستخدم..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
            <div className="text-sm text-slate-500 mb-2">اسم المستخدم</div>
            <div className="text-2xl font-black text-slate-900">{user?.username || '-'}</div>
          </div>

          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
            <div className="text-sm text-slate-500 mb-2">الدور</div>
            <div className="text-2xl font-black text-slate-900">{user?.profile?.role || '-'}</div>
          </div>

          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
            <div className="text-sm text-slate-500 mb-2">البريد الإلكتروني</div>
            <div className="text-xl font-bold text-slate-900">{user?.email || '-'}</div>
          </div>

          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
            <div className="text-sm text-slate-500 mb-2">الاسم الكامل</div>
            <div className="text-xl font-bold text-slate-900">
              {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || '-'}
            </div>
          </div>

          <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-[22px] p-5 text-slate-700">
            إدارة المستخدمين الكاملة (إضافة / حذف / تعديل الأدوار) تتم حاليًا من خلال
            <span className="font-bold"> Django Admin </span>
            إلى أن يتم توفير API خاصة بالمستخدمين داخل الـ Dashboard.
          </div>
        </div>
      )}
    </PageShell>
  );
}