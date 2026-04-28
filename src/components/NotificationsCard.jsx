import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

function toneFromNotification(n) {
  const text = `${n.title || ''} ${n.message || ''}`.toLowerCase();
  if (text.includes('تجاوز') || text.includes('تحذير') || text.includes('خطأ')) return 'danger';
  if (text.includes('ازدحام') || text.includes('تنبيه')) return 'warning';
  if (text.includes('تم') || text.includes('نجاح')) return 'success';
  return 'info';
}

const toneMap = {
  danger: { box: 'bg-red-50 border-red-100', iconWrap: 'bg-red-100 text-red-600', Icon: AlertTriangle },
  warning: { box: 'bg-amber-50 border-amber-100', iconWrap: 'bg-amber-100 text-amber-600', Icon: AlertTriangle },
  info: { box: 'bg-blue-50 border-blue-100', iconWrap: 'bg-blue-100 text-blue-600', Icon: Info },
  success: { box: 'bg-emerald-50 border-emerald-100', iconWrap: 'bg-emerald-100 text-emerald-600', Icon: CheckCircle2 },
};

export default function NotificationsCard({ notifications = [] }) {
  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">أحدث التنبيهات</h3>
        <button className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-xl">عرض الكل</button>
      </div>

      <div className="space-y-3">
        {notifications.length ? notifications.map((n) => {
          const tone = toneMap[toneFromNotification(n)] || toneMap.info;
          const Icon = tone.Icon;
          return (
            <div key={n.id} className={['border rounded-2xl p-3 flex items-start gap-3', tone.box].join(' ')}>
              <div className={['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', tone.iconWrap].join(' ')}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-800">{n.title || 'تنبيه'}</div>
                  <div className="text-xs text-slate-500 whitespace-nowrap">{n.created_at ? new Date(n.created_at).toLocaleTimeString('ar') : ''}</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">{n.message || ''}</div>
              </div>
            </div>
          );
        }) : <div className="text-slate-400 text-sm">لا توجد إشعارات.</div>}
      </div>
    </div>
  );
}
