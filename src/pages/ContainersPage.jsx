import { useEffect, useMemo, useState } from 'react';

import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function ContainersPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const res = await api.get('/trips/');

        if (!mounted) return;

        const trips = Array.isArray(res.data?.results)
          ? res.data.results
          : Array.isArray(res.data)
          ? res.data
          : [];

        const map = new Map();

        trips.forEach((trip) => {
          const key = trip.container_no || `unknown-${trip.id || trip.trip_code}`;

          if (!map.has(key)) {
            map.set(key, {
              container_no: trip.container_no || '-',
              latest_status: trip.status || '-',
              latest_trip: trip.trip_code || '-',
              truck_plate: trip.truck_plate || '-',
              destination: trip.destination || '-',
              slot_label: trip.slot_label || '-',
            });
          }
        });

        setItems(Array.from(map.values()));
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || 'تعذر تحميل الحاويات');
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

  const filtered = useMemo(() => {
    if (!search) return items;

    const q = search.toLowerCase();

    return items.filter((x) =>
      String(x.container_no).toLowerCase().includes(q) ||
      String(x.latest_trip).toLowerCase().includes(q) ||
      String(x.truck_plate).toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <PageShell
      title="الحاويات"
      subtitle="عرض الحاويات المشتقة من بيانات الرحلات"
      hideTitle
      actions={
        <input
          placeholder="ابحث برقم الحاوية أو الرحلة أو الشاحنة"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 rounded-2xl px-4 py-3 bg-white min-w-[280px]"
        />
      }
    >
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
        <div className="text-sm text-slate-500 mb-2">إجمالي الحاويات</div>
        <div className="text-4xl font-black text-slate-900">{filtered.length}</div>
      </div>

      {loading ? (
        <LoadingCard text="جاري تحميل الحاويات..." />
      ) : (
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="text-right py-3 px-2 font-medium">الحالة الأخيرة</th>
                <th className="text-right py-3 px-2 font-medium">آخر موعد</th>
                <th className="text-right py-3 px-2 font-medium">الوجهة</th>
                <th className="text-right py-3 px-2 font-medium">رقم الشاحنة</th>
                <th className="text-right py-3 px-2 font-medium">آخر رحلة</th>
                <th className="text-right py-3 px-2 font-medium">رقم الحاوية</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length ? (
                filtered.map((container) => (
                  <tr key={container.container_no} className="border-b last:border-b-0 border-slate-100 text-slate-700">
                    <td className="py-3 px-2">{container.latest_status}</td>
                    <td className="py-3 px-2">{container.slot_label}</td>
                    <td className="py-3 px-2">{container.destination}</td>
                    <td className="py-3 px-2">{container.truck_plate}</td>
                    <td className="py-3 px-2">{container.latest_trip}</td>
                    <td className="py-3 px-2 font-bold">{container.container_no}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    لا توجد حاويات مطابقة.
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