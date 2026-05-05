import { CheckCircle2 } from 'lucide-react';

export default function LatestScansTable({ scans = [] }) {
  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 overflow-x-auto">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-xl font-black text-slate-900">
            آخر عمليات المسح
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            أحدث عمليات المرور المسجلة على نقاط التفتيش
          </p>
        </div>

        <button className="text-sm text-blue-600 font-bold hover:text-blue-700">
          عرض الكل
        </button>
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-100">
            <th className="text-right py-3 px-2 font-medium">الحالة</th>
            <th className="text-right py-3 px-2 font-medium">النوع</th>
            <th className="text-right py-3 px-2 font-medium">المستخدم</th>
            <th className="text-right py-3 px-2 font-medium">النقطة</th>
            <th className="text-right py-3 px-2 font-medium">رقم الرحلة</th>
            <th className="text-right py-3 px-2 font-medium">الوقت</th>
          </tr>
        </thead>

        <tbody>
          {scans.length ? (
            scans.map((row) => (
              <tr
                key={row.id || `${row.trip_code}-${row.created_at}`}
                className="border-b last:border-b-0 border-slate-100 text-slate-700"
              >
                <td className="py-3 px-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-bold">
                    <CheckCircle2 size={14} />
                    {row.trip?.status || 'تم'}
                  </span>
                </td>

                <td className="py-3 px-2">
                  {row.scan_point?.point_type || row.point_type || '-'}
                </td>

                <td className="py-3 px-2">
                  {row.scanned_by_name || row.scanned_by?.username || '-'}
                </td>

                <td className="py-3 px-2">
                  {row.scan_point_name || row.scan_point?.name || '-'}
                </td>

                <td className="py-3 px-2 font-medium">
                  {row.trip_code || row.trip?.trip_code || '-'}
                </td>

                <td className="py-3 px-2">
                  {row.created_at
                    ? new Date(row.created_at).toLocaleTimeString('ar')
                    : row.scanned_at
                    ? new Date(row.scanned_at).toLocaleTimeString('ar')
                    : '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-8 text-center text-slate-400">
                لا توجد بيانات مسح.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}