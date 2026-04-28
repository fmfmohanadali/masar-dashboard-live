export default function CheckpointStatusCard({ points = [] }) {
  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 h-[330px] overflow-hidden">
      <div className="text-lg font-bold text-slate-900 mb-4">حالة نقاط التفتيش</div>
      <div className="grid grid-cols-[1fr_auto] text-sm text-slate-400 pb-2 border-b border-slate-100 mb-2">
        <div>النقطة</div>
        <div>الحالة</div>
      </div>
      <div className="space-y-3">
        {points.length ? points.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_auto] items-center bg-slate-50 rounded-2xl px-4 py-3">
            <div className="font-medium text-slate-700">{item.name}</div>
            <div className={`flex items-center gap-2 text-sm font-medium ${item.is_active ? 'text-emerald-600' : 'text-slate-500'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              <span>{item.is_active ? 'نشطة' : 'غير نشطة'}</span>
            </div>
          </div>
        )) : <div className="text-slate-400 text-sm">لا توجد بيانات.</div>}
      </div>
    </div>
  );
}
