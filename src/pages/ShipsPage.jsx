import { useEffect, useState } from 'react';

import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function ShipsPage() {
  const [summary, setSummary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const [summaryRes, tripsRes] = await Promise.all([
          api.get('/dashboard/summary/'),
          api.get('/trips/'),
        ]);

        if (!mounted) return;

        setSummary(summaryRes.data || null);

        const tripData = Array.isArray(tripsRes.data?.results)
          ? tripsRes.data.results
          : Array.isArray(tripsRes.data)
          ? tripsRes.data
          : [];

        setTrips(tripData.slice(0, 8));
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || 'تعذر تحميل مؤشرات السفن');
        setSummary(null);
        setTrips([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageShell
      title="السفن"
      subtitle="مؤشرات تشغيل بحرية مشتقة من بيانات الميناء الحالية"
    >
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingCard text="جاري تحميل مؤشرات السفن..." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MiniStat label="الرحلات داخل الميناء" value={summary?.inside_port ?? '--'} color="text-blue-600" />
            <MiniStat label="الرحلات في الانتظار" value={summary?.waiting_trips ?? '--'} color="text-amber-600" />
            <MiniStat label="الرحلات المسلمة" value={summary?.delivered ?? '--'} color="text-emerald-600" />
          </div>

          <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
            <h3 className="text-xl font-black text-slate-900 mb-4">
              أحدث الحركة المرتبطة بالميناء
            </h3>

            {trips.length ? (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="text-right py-3 px-2 font-medium">الحالة</th>
                    <th className="text-right py-3 px-2 font-medium">الموعد</th>
                    <th className="text-right py-3 px-2 font-medium">الوجهة</th>
                    <th className="text-right py-3 px-2 font-medium">الشاحنة</th>
                    <th className="text-right py-3 px-2 font-medium">الحاوية</th>
                    <th className="text-right py-3 px-2 font-medium">الرحلة</th>
                  </tr>
                </thead>

                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id || trip.trip_code} className="border-b last:border-b-0 border-slate-100 text-slate-700">
                      <td className="py-3 px-2">{trip.status || '-'}</td>
                      <td className="py-3 px-2">{trip.slot_label || '-'}</td>
                      <td className="py-3 px-2">{trip.destination || '-'}</td>
                      <td className="py-3 px-2">{trip.truck_plate || '-'}</td>
                      <td className="py-3 px-2">{trip.container_no || '-'}</td>
                      <td className="py-3 px-2 font-medium">{trip.trip_code || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-slate-400">
                لا توجد بيانات حركة مرتبطة بالميناء حاليًا.
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl px-4 py-3 text-sm leading-7">
            هذه الصفحة تعرض مؤشرات بحرية تشغيلية مشتقة من البيانات الحالية، ولا تعرض سجل سفن فعلي بالأسماء إلا بعد إضافة API خاصة بالسفن في الـ Backend.
          </div>
        </>
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