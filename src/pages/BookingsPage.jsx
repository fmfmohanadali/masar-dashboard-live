import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

function hourLabel(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

export default function BookingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const query = dateFilter ? `?date=${dateFilter}` : '';
        const res = await api.get(`/booking-slots/${query}`);
        if (!mounted) return;
        const data = res.data?.results || res.data || [];
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || 'تعذر تحميل الحجوزات');
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [dateFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const closed = items.filter(x => x.is_closed).length;
    const open = total - closed;
    const availableSum = items.reduce((acc, x) => acc + Number(x.available ?? 0), 0);
    return { total, open, closed, availableSum };
  }, [items]);

  return (
    <PageShell
      title="الحجوزات"
      subtitle="إدارة الفترات الزمنية المتاحة للحجوزات"
      actions={
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-slate-200 rounded-2xl px-4 py-3 bg-white"
        />
      }
    >
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">إجمالي الفترات</div>
          <div className="text-4xl font-black text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">الفترات المفتوحة</div>
          <div className="text-4xl font-black text-emerald-600">{stats.open}</div>
        </div>
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">الفترات المغلقة</div>
          <div className="text-4xl font-black text-rose-600">{stats.closed}</div>
        </div>
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">إجمالي المتاح</div>
          <div className="text-4xl font-black text-brand">{stats.availableSum}</div>
        </div>
      </div>

      {loading ? (
        <LoadingCard text="جاري تحميل الحجوزات..." />
      ) : (
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="text-right py-3 px-2 font-medium">الحالة</th>
                <th className="text-right py-3 px-2 font-medium">المتاح</th>
                <th className="text-right py-3 px-2 font-medium">الساعة</th>
                <th className="text-right py-3 px-2 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? items.map((slot) => (
                <tr key={slot.id || `${slot.date}-${slot.hour}`} className="border-b last:border-b-0 border-slate-100 text-slate-700">
                  <td className="py-3 px-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${slot.is_closed ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {slot.is_closed ? 'مغلقة' : 'مفتوحة'}
                    </span>
                  </td>
                  <td className="py-3 px-2">{slot.available ?? '-'}</td>
                  <td className="py-3 px-2">{hourLabel(slot.hour)}</td>
                  <td className="py-3 px-2">{slot.date}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400">لا توجد فترات مطابقة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}