import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function TrucksPage() {
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

        const trips = res.data?.results || res.data || [];
        const truckMap = new Map();

        (Array.isArray(trips) ? trips : []).forEach((trip) => {
          const plate = trip.truck_plate || '-';
          if (!truckMap.has(plate)) {
            truckMap.set(plate, {
              plate_number: plate,
              latest_trip: trip.trip_code || '-',
              latest_status: trip.status || '-',
              driver_name: trip.driver_name || '-',
              destination: trip.destination || '-',
            });
          }
        });

        setItems(Array.from(truckMap.values()));
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || 'تعذر تحميل بيانات الشاحنات');
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((item) =>
      String(item.plate_number).toLowerCase().includes(q) ||
      String(item.latest_trip).toLowerCase().includes(q) ||
      String(item.driver_name).toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <PageShell
      title="الشاحنات"
      subtitle="قائمة الشاحنات المستخرجة من بيانات الرحلات"
      actions={
        <input
          placeholder="ابحث برقم الشاحنة أو السائق أو الرحلة"
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
        <div className="text-sm text-slate-500 mb-2">إجمالي الشاحنات</div>
        <div className="text-4xl font-black text-slate-900">{filtered.length}</div>
      </div>

      {loading ? (
        <LoadingCard text="جاري تحميل بيانات الشاحنات..." />
      ) : (
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="text-right py-3 px-2 font-medium">الحالة الأخيرة</th>
                <th className="text-right py-3 px-2 font-medium">الوجهة</th>
                <th className="text-right py-3 px-2 font-medium">السائق</th>
                <th className="text-right py-3 px-2 font-medium">آخر رحلة</th>
                <th className="text-right py-3 px-2 font-medium">رقم الشاحنة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map((truck) => (
                <tr key={truck.plate_number} className="border-b last:border-b-0 border-slate-100 text-slate-700">
                  <td className="py-3 px-2">{truck.latest_status}</td>
                  <td className="py-3 px-2">{truck.destination}</td>
                  <td className="py-3 px-2">{truck.driver_name}</td>
                  <td className="py-3 px-2">{truck.latest_trip}</td>
                  <td className="py-3 px-2 font-medium">{truck.plate_number}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">لا توجد شاحنات مطابقة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}