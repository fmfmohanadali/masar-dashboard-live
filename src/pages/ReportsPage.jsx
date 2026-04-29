import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

export default function ReportsPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      setDebugInfo('');

      try {
        const res = await api.get('/turnaround-report/');
        if (!mounted) return;

        const data = res.data?.results || res.data || [];
        if (Array.isArray(data)) {
          setRows(data);
          if (!data.length) {
            setDebugInfo('تم الوصول إلى endpoint بنجاح لكن لا توجد بيانات تقرير حالياً.');
          }
        } else {
          setRows([]);
          setDebugInfo('الـ API رجعت بيانات لكن ليست بصيغة قائمة Array.');
        }
      } catch (err) {
        if (!mounted) return;

        console.error('turnaround-report error:', err);

        const detail =
          err?.response?.data?.detail ||
          err?.response?.statusText ||
          err?.message ||
          'تعذر تحميل التقارير';

        setError(detail);
        setRows([]);

        setDebugInfo(
          `HTTP Status: ${err?.response?.status || 'غير معروف'}`
        );
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
      ) : (
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
          {rows.length && columns.length ? (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  {columns.map((col) => (
                    <th key={col} className="text-right py-3 px-2 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-b-0 border-slate-100 text-slate-700"
                  >
                    {columns.map((col) => (
                      <td key={col} className="py-3 px-2">
                        {typeof row[col] === 'object'
                          ? JSON.stringify(row[col])
                          : String(row[col] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-slate-400">
              لا توجد بيانات تقارير حالياً
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}