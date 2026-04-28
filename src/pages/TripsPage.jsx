import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

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

      const res = await api.get(`/trips/?${params.toString()}`);
      const data = res.data?.results || res.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر تحميل الرحلات');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const delivered = items.filter(t => t.status === 'DELIVERED').length;
    const inside = items.filter(t => ['ENTERED_PORT', 'AT_BERTH', 'PASSED_CUSTOMS'].includes(t.status)).length;
    const waiting = items.filter(t => ['CREATED', 'BOOKED', 'APPROVED'].includes(t.status)).length;
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
            <option value="CREATED">CREATED</option>
            <option value="BOOKED">BOOKED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="ENTERED_PORT">ENTERED_PORT</option>
            <option value="AT_BERTH">AT_BERTH</option>
            <option value="PASSED_CUSTOMS">PASSED_CUSTOMS</option>
            <option value="EXITED_PORT">EXITED_PORT</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
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
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">كل الرحلات</div>
          <div className="text-4xl font-black text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">في الانتظار</div>
          <div className="text-4xl font-black text-amber-600">{stats.waiting}</div>
        </div>
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">داخل الميناء</div>
          <div className="text-4xl font-black text-blue-600">{stats.inside}</div>
        </div>
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">تم التسليم</div>
          <div className="text-4xl font-black text-emerald-600">{stats.delivered}</div>
        </div>
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
              {items.length ? items.map((t) => (
                <tr key={t.id || t.trip_code} className="border-b last:border-b-0 border-slate-100 text-slate-700">
                  <td className="py-3 px-2">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {t.status || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-2">{t.slot_label || '-'}</td>
                  <td className="py-3 px-2">{t.destination || '-'}</td>
                  <td className="py-3 px-2">{t.driver_name || '-'}</td>
                  <td className="py-3 px-2">{t.truck_plate || '-'}</td>
                  <td className="py-3 px-2">{t.container_no || '-'}</td>
                  <td className="py-3 px-2 font-medium">{t.trip_code || '-'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">لا توجد رحلات.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}