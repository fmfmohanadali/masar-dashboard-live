import { useEffect, useMemo, useState } from 'react';

import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

const statuses = [
  'CREATED',
  'BOOKED',
  'APPROVED',
  'ARRIVED_GATE',
  'ENTERED_PORT',
  'AT_BERTH',
  'LOADING_COMPLETE',
  'PASSED_CUSTOMS',
  'EXITED_PORT',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
];

export default function TripsPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const query = params.toString();
      const res = await api.get(`/trips/${query ? `?${query}` : ''}`);

      const data = Array.isArray(res.data?.results)
        ? res.data.results
        : Array.isArray(res.data)
        ? res.data
        : [];

      setItems(data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر تحميل الرحلات');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const delivered = items.filter((t) => t.status === 'DELIVERED').length;
    const inside = items.filter((t) =>
      ['ENTERED_PORT', 'AT_BERTH', 'PASSED_CUSTOMS', 'IN_TRANSIT'].includes(t.status)
    ).length;
    const waiting = items.filter((t) =>
      ['CREATED', 'BOOKED', 'APPROVED'].includes(t.status)
    ).length;

    return { total, delivered, inside, waiting };
  }, [items]);

  return (
    <PageShell
      title="الرحلات"
      subtitle="عرض وإدارة الرحلات الحالية"
      actions={
        <>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-2xl px-4 py-3 bg-white"
          >
            <option value="">كل الحالات</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <input
            placeholder="ابحث برقم الحاوية / الشاحنة / السائق"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-2xl px-4 py-3 bg-white min-w-[280px]"
          />

          <button
            onClick={load}
            className="bg-brand text-white px-4 py-3 rounded-2xl"
          >
            تحديث
          </button>
        </>
      }
    >
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <MiniStat label="كل الرحلات" value={stats.total} color="text-slate-900" />
        <MiniStat label="في الانتظار" value={stats.waiting} color="text-amber-600" />
        <MiniStat label="داخل الميناء" value={stats.inside} color="text-blue-600" />
        <MiniStat label="تم التسليم" value={stats.delivered} color="text-emerald-600" />
      </div>

      {loading ? (
        <LoadingCard text="جاري تحميل الرحلات..." />
      ) : (
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="text-right py-3 px-2 font-medium">الحالة</th>
                <th className="text-right py-3 px-2 font-medium">الموعد</th>
                <th className="text-right py-3 px-2 font-medium">الوجهة</th>
                <th className="text-right py-3 px-2 font-medium">السائق</th>
                <th className="text-right py-3 px-2 font-medium">رقم الشاحنة</th>
                <th className="text-right py-3 px-2 font-medium">رقم الحاوية</th>
                <th className="text-right py-3 px-2 font-medium">رمز الرحلة</th>
              </tr>
            </thead>

            <tbody>
              {items.length ? (
                items.map((trip) => (
                  <tr key={trip.id || trip.trip_code} className="border-b last:border-b-0 border-slate-100 text-slate-700">
                    <td className="py-3 px-2">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {trip.status || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-2">{trip.slot_label || '-'}</td>
                    <td className="py-3 px-2">{trip.destination || '-'}</td>
                    <td className="py-3 px-2">{trip.driver_name || '-'}</td>
                    <td className="py-3 px-2">{trip.truck_plate || '-'}</td>
                    <td className="py-3 px-2">{trip.container_no || '-'}</td>
                    <td className="py-3 px-2 font-medium">{trip.trip_code || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">
                    لا توجد رحلات.
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