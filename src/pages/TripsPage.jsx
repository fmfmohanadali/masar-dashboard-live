import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { api, normalizeList, getErrorMessage } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

// ✅ ترجمة الحالات بالعربي
const statusLabels = {
  CREATED: { label: 'تم الإنشاء', cls: 'bg-slate-100 text-slate-600' },
  BOOKED: { label: 'محجوزة', cls: 'bg-blue-50 text-blue-600' },
  APPROVED: { label: 'معتمدة', cls: 'bg-cyan-50 text-cyan-700' },
  ARRIVED_GATE: { label: 'وصلت البوابة', cls: 'bg-amber-50 text-amber-600' },
  ENTERED_PORT: { label: 'داخل الميناء', cls: 'bg-orange-50 text-orange-600' },
  AT_BERTH: { label: 'في الرصيف', cls: 'bg-purple-50 text-purple-600' },
  LOADING_COMPLETE: { label: 'اكتمل التحميل', cls: 'bg-indigo-50 text-indigo-600' },
  PASSED_CUSTOMS: { label: 'اجتازت الجمارك', cls: 'bg-teal-50 text-teal-600' },
  EXITED_PORT: { label: 'خرجت من الميناء', cls: 'bg-lime-50 text-lime-700' },
  IN_TRANSIT: { label: 'في الطريق', cls: 'bg-yellow-50 text-yellow-700' },
  DELIVERED: { label: 'تم التسليم', cls: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'ملغاة', cls: 'bg-red-50 text-red-600' },
};

const statuses = Object.keys(statusLabels);

function StatusBadge({ status }) {
  const info = statusLabels[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${info.cls}`}>
      {info.label}
    </span>
  );
}

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
      setItems(normalizeList(res.data));
    } catch (err) {
      setError(getErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // ✅ Auto-refresh كل 30 ثانية
  useEffect(() => {
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
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
      stats={[
        { label: 'الكل', value: stats.total, color: 'bg-blue-50 text-blue-600' },
        { label: 'في الانتظار', value: stats.waiting, color: 'bg-amber-50 text-amber-600' },
        { label: 'داخل الميناء', value: stats.inside, color: 'bg-violet-50 text-violet-600' },
        { label: 'تم التسليم', value: stats.delivered, color: 'bg-emerald-50 text-emerald-600' },
      ]}
      actions={
        <>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-2xl px-4 py-3 bg-white"
          >
            <option value="">كل الحالات</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{statusLabels[s].label}</option>
            ))}
          </select>
          <input
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-2xl px-4 py-3 bg-white min-w-[280px]"
          />
          <button
            onClick={load}
            className="bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition flex items-center gap-2"
          >
            <RefreshCw size={16} />
            تحديث
          </button>
        </>
      }
    >
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingCard />
      ) : (
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <th className="px-5 py-4 font-semibold">رمز الرحلة</th>
                <th className="px-5 py-4 font-semibold">رقم الحاوية</th>
                <th className="px-5 py-4 font-semibold">رقم الشاحنة</th>
                <th className="px-5 py-4 font-semibold">السائق</th>
                <th className="px-5 py-4 font-semibold">الوجهة</th>
                <th className="px-5 py-4 font-semibold">الموعد</th>
                <th className="px-5 py-4 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((trip) => (
                  <tr key={trip.id || trip.trip_code} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4 font-mono text-xs text-blue-600">{String(trip.trip_code || '-').slice(0, 8)}...</td>
                    <td className="px-5 py-4 font-semibold">{trip.container_no || '-'}</td>
                    <td className="px-5 py-4">{trip.truck_plate || '-'}</td>
                    <td className="px-5 py-4">{trip.driver_name || '-'}</td>
                    <td className="px-5 py-4">{trip.destination || '-'}</td>
                    <td className="px-5 py-4 text-slate-500">{trip.slot_label || '-'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={trip.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-slate-400 py-12">لا توجد رحلات.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
