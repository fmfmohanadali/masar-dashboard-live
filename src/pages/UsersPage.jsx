import { useEffect, useState } from 'react';

import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function UsersPage({ user: initialUser }) {
  const [user, setUser] = useState(() => {
    if (initialUser) return initialUser;

    const stored = localStorage.getItem('masar_user');

    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('masar_user');
      return null;
    }
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (initialUser) {
        setUser(initialUser);
        setLoading(false);
      }

      try {
        const res = await api.get('/me/');

        if (!mounted) return;

        if (res.data) {
          setUser(res.data);
          localStorage.setItem('masar_user', JSON.stringify(res.data));
          setError('');
        }
      } catch (err) {
        if (!mounted) return;

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
          className="bg-brand text-white px-4 py-3 rounded-2xl inline-flex"
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
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoItem label="اسم المستخدم" value={user?.username || '-'} />
            <InfoItem label="الدور" value={user?.profile?.role || '-'} />
            <InfoItem label="البريد الإلكتروني" value={user?.email || '-'} />
            <InfoItem
              label="الاسم الكامل"
              value={[user?.first_name, user?.last_name].filter(Boolean).join(' ') || '-'}
            />
          </div>

          <div className="mt-5 bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl px-4 py-3 text-sm leading-7">
            إدارة المستخدمين الكاملة، مثل الإضافة والحذف وتعديل الأدوار، تتم حاليًا عبر Django Admin
            إلى أن يتم توفير API مستقلة للمستخدمين داخل الـ Dashboard.
          </div>
        </div>
      )}
    </PageShell>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <div className="text-sm text-slate-500 mb-2">{label}</div>
      <div className="text-lg font-bold text-slate-900">{value}</div>
    </div>
  );
}