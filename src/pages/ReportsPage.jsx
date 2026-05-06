import { useEffect, useMemo, useState } from 'react';

import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function ReportsPage() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [mode, setMode] = useState('turnaround');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      setDebugInfo('');
      setRows([]);
      setSummary(null);

      try {
        const res = await api.get('/reports/turnaround/');

        if (!mounted) return;

        const data = Array.isArray(res.data?.results)
          ? res.data.results
          : Array.isArray(res.data)
          ? res.data
          : [];

        setRows(data);
        setMode('turnaround');

        if (!data.length) {
          setDebugInfo('تم الوصول إلى تقرير الدوران لكن لا توجد بيانات حاليًا.');
        }
      } catch (err) {
        if (!mounted) return;

        if (err?.response?.status === 404) {
          try {
            const fallbackRes = await api.get('/dashboard/summary/');

            if (!mounted) return;

            setSummary(fallbackRes.data || null);
            setMode('summary');
            setDebugInfo('تم استخدام ملخص لوحة التحكم كبديل لأن endpoint التقارير غير موجودة.');
          } catch (fallbackErr) {
            if (!mounted) return;

            console.error('Fallback summary error:', fallbackErr);

            setError(
              fallbackErr?.response?.data?.detail ||
                fallbackErr?.response?.statusText ||
                fallbackErr?.message ||
                'تعذر تحميل التقارير والملخص البديل'
            );
          }
        } else {
          console.error('turnaround report error:', err);

          setError(
            err?.response?.data?.detail ||
              err?.response?.statusText ||
              err?.message ||
              'تعذر تحميل التقارير'
          );

          setDebugInfo(`HTTP Status: ${err?.response?.status || 'غير معروف'}`);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const columns = useMemo(() => {
    if (!rows.length || typeof rows[0] !== 'object') return [];
    return Object.keys(rows[0]);
  }, [rows]);

  return (
    <PageShell
      title="التقارير"
      subtitle="عرض تقرير الدوران والبيانات التحليلية"
      hideTitle
      actions={
        <button
          onClick={() => window.print()}
          className="bg-brand text-white px-4 py-3 rounded-2xl"
        >
          طباعة التقرير
        </button>
      }
    >
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {debugInfo ? (
        <div className="bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl px-4 py-3 text-sm">
          {debugInfo}
        </div>
      ) : null}

      {loading ? (
        <LoadingCard text="جاري تحميل التقارير..." />
      ) : mode === 'turnaround' ? (
        <TurnaroundTable rows={rows} columns={columns} />
      ) : (
        <SummaryReport summary={summary} />
      )}
    </PageShell>
  );
}

function TurnaroundTable({ rows, columns }) {
  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
      {rows.length && columns.length ? (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100">
              {columns.map((column) => (
                <th key={column} className="text-right py-3 px-2 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.trip_code || index}
                className="border-b last:border-b-0 border-slate-100 text-slate-700"
              >
                {columns.map((column) => (
                  <td key={column} className="py-3 px-2">
                    {typeof row[column] === 'object'
                      ? JSON.stringify(row[column])
                      : String(row[column] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="py-8 text-center text-slate-400">
          لا توجد بيانات تقارير حاليًا.
        </div>
      )}
    </div>
  );
}

function SummaryReport({ summary }) {
  const recentTrips = Array.isArray(summary?.recent_trips)
    ? summary.recent_trips
    : [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <MiniStat label="إجمالي الرحلات" value={summary?.total_trips ?? '--'} color="text-slate-900" />
        <MiniStat label="في الانتظار" value={summary?.waiting_trips ?? '--'} color="text-amber-600" />
        <MiniStat label="داخل الميناء" value={summary?.inside_port ?? '--'} color="text-blue-600" />
        <MiniStat label="تم التسليم" value={summary?.delivered ?? '--'} color="text-emerald-600" />
      </div>

      <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
        <h3 className="text-xl font-black text-slate-900 mb-4">
          أحدث الرحلات
        </h3>

        {recentTrips.length ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="text-right py-3 px-2 font-medium">الحالة</th>
                <th className="text-right py-3 px-2 font-medium">الموعد</th>
                <th className="text-right py-3 px-2 font-medium">الوجهة</th>
                <th className="text-right py-3 px-2 font-medium">السائق</th>
                <th className="text-right py-3 px-2 font-medium">الشاحنة</th>
                <th className="text-right py-3 px-2 font-medium">الحاوية</th>
                <th className="text-right py-3 px-2 font-medium">الرحلة</th>
              </tr>
            </thead>

            <tbody>
              {recentTrips.map((trip) => (
                <tr
                  key={trip.id || trip.trip_code}
                  className="border-b last:border-b-0 border-slate-100 text-slate-700"
                >
                  <td className="py-3 px-2">{trip.status || '-'}</td>
                  <td className="py-3 px-2">{trip.slot_label || '-'}</td>
                  <td className="py-3 px-2">{trip.destination || '-'}</td>
                  <td className="py-3 px-2">{trip.driver_name || '-'}</td>
                  <td className="py-3 px-2">{trip.truck_plate || '-'}</td>
                  <td className="py-3 px-2">{trip.container_no || '-'}</td>
                  <td className="py-3 px-2 font-medium">{trip.trip_code || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-slate-400">
            لا توجد بيانات رحلات حديثة.
          </div>
        )}
      </div>
    </div>
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