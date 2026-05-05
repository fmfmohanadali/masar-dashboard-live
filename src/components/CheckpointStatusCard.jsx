export default function CheckpointStatusCard({ points = [] }) {
  const safePoints = Array.isArray(points) ? points : [];
  const activeCount = safePoints.filter((point) => point.is_active).length;

  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 h-full">
      <div className="mb-5">
        <h3 className="text-xl font-black text-slate-900">
          حالة نقاط التفتيش
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          {activeCount} نقطة نشطة من أصل {safePoints.length}
        </p>
      </div>

      <div className="space-y-3">
        {safePoints.length ? (
          safePoints.slice(0, 6).map((point) => (
            <div
              key={point.id || point.point_type || point.name}
              className="flex items-center justify-between gap-3 border border-slate-100 rounded-2xl px-4 py-3"
            >
              <div>
                <div className="font-bold text-slate-800">
                  {point.name || '-'}
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  {point.point_type || '-'}
                </div>
              </div>

              <span
                className={[
                  'inline-flex rounded-full px-3 py-1 text-xs font-bold',
                  point.is_active
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-100 text-slate-500',
                ].join(' ')}
              >
                {point.is_active ? 'نشطة' : 'غير نشطة'}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-400">
            لا توجد بيانات.
          </div>
        )}
      </div>
    </div>
  );
}
