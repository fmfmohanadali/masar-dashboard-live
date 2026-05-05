import { useEffect, useMemo, useState } from 'react';

import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function CheckpointsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const res = await api.get('/scan-points/');

        if (!mounted) return;

        const data = Array.isArray(res.data?.results)
          ? res.data.results
          : Array.isArray(res.data)
          ? res.data
          : [];

        setItems(data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || 'تعذر تحميل نقاط التفتيش');
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((x) => x.is_active).length;
    const inactive = total - active;

    return { total, active, inactive };
  }, [items]);

  return (
    <PageShell
      title="نقاط التفتيش"
      subtitle="عرض نقاط التفتيش وحالتها التشغيلية"
    >
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MiniStat label="إجمالي النقاط" value={stats.total} color="text-slate-900" />
        <MiniStat label="النقاط النشطة" value={stats.active} color="text-emerald-600" />
        <MiniStat label="النقاط غير النشطة" value={stats.inactive} color="text-amber-600" />
      </div>

      {loading ? (
        <LoadingCard text="جاري تحميل نقاط التفتيش..." />
      ) : (
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="text-right py-3 px-2 font-medium">الحالة</th>
                <th className="text-right py-3 px-2 font-medium">نوع النقطة</th>
                <th className="text-right py-3 px-2 font-medium">الاسم</th>
                <th className="text-right py-3 px-2 font-medium">الوصف</th>
              </tr>
            </thead>

            <tbody>
              {items.length ? (
                items.map((point) => (
                  <tr key={point.id || point.point_type} className="border-b last:border-b-0 border-slate-100 text-slate-700">
                    <td className="py-3 px-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${point.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {point.is_active ? 'نشطة' : 'غير نشطة'}
                      </span>
                    </td>
                    <td className="py-3 px-2">{point.point_type || '-'}</td>
                    <td className="py-3 px-2 font-bold">{point.name || '-'}</td>
                    <td className="py-3 px-2">{point.location_description || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400">
                    لا توجد نقاط تفتيش.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
      <div className="text-sm text-slate-500 mb-2">{label}</div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}