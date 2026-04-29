import { useEffect, useState } from 'react';
import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function UsersPage({ user: initialUser }) {
  const [user, setUser] = useState(() => {
    if (initialUser) return initialUser;

    const stored = localStorage.getItem('masar_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    let mounted = true;

    async function load() {
      // إذا عندنا بيانات جاهزة من props لا نظهر خطأ ولا loading قوي
      if (initialUser) {
        setUser(initialUser);
        setLoading(false);
      }

      try {
        const res = await api.get('/auth/me/');
        if (!mounted) return;

        if (res.data) {
          setUser(res.data);
          localStorage.setItem('masar_user', JSON.stringify(res.data));
          setError('');
        }
      } catch (err) {
        if (!mounted) return;

        // لا نعرض خطأ إذا كانت عندنا بيانات محلية جاهزة
        const stored = localStorage.getItem('masar_user');
        if (!initialUser && !stored) {
          setError(err?.response?.data?.detail || 'تعذر تحميل بيانات المستخدم');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [initialUser]);

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
            <div className="text-2xl font-black text-slate-900">
              {user?.username || '-'}
            </div>
          </div>

          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
            <div className="text-sm text-slate-500 mb-2">الدور</div>
            <div className="text-2xl font-black text-slate-900">
              {user?.profile?.role || '-'}
            </div>
          </div>

          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
            <div className="text-sm text-slate-500 mb-2">البريد الإلكتروني</div>
            <div className="text-xl font-bold text-slate-900">
              {user?.email || '-'}
            </div>
          </div>

          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
            <div className="text-sm text-slate-500 mb-2">الاسم الكامل</div>
            <div className="text-xl font-bold text-slate-900">
              {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || '-'}
            </div>
          </div>

          <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-[22px] p-5 text-slate-700">
            إدارة المستخدمين الكاملة (إضافة / حذف / تعديل الأدوار) تتم حاليًا عبر
            <span className="font-bold"> Django Admin </span>
            إلى أن يتم توفير API مستقلة للمستخدمين داخل الـ Dashboard.
          </div>
        </div>
      )}
    </PageShell>
  );
}