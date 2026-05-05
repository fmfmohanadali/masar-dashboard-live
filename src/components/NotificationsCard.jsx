import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

function toneFromNotification(notification) {
  const text = `${notification?.title || ''} ${notification?.message || ''}`.toLowerCase();

  if (
    text.includes('تجاوز') ||
    text.includes('تحذير') ||
    text.includes('خطأ')
  ) {
    return 'danger';
  }

  if (
    text.includes('ازدحام') ||
    text.includes('تنبيه')
  ) {
    return 'warning';
  }

  if (
    text.includes('تم') ||
    text.includes('نجاح')
  ) {
    return 'success';
  }

  return 'info';
}

const toneMap = {
  danger: {
    box: 'bg-red-50 border-red-100',
    iconWrap: 'bg-red-100 text-red-600',
    title: 'text-red-800',
    Icon: AlertTriangle,
  },
  warning: {
    box: 'bg-amber-50 border-amber-100',
    iconWrap: 'bg-amber-100 text-amber-600',
    title: 'text-amber-800',
    Icon: AlertTriangle,
  },
  info: {
    box: 'bg-blue-50 border-blue-100',
    iconWrap: 'bg-blue-100 text-blue-600',
    title: 'text-blue-800',
    Icon: Info,
  },
  success: {
    box: 'bg-emerald-50 border-emerald-100',
    iconWrap: 'bg-emerald-100 text-emerald-600',
    title: 'text-emerald-800',
    Icon: CheckCircle2,
  },
};

export default function NotificationsCard({ notifications = [] }) {
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 h-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-xl font-black text-slate-900">
            أحدث التنبيهات
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            آخر الإشعارات المرتبطة بحسابك
          </p>
        </div>

        <button
          type="button"
          className="text-sm text-blue-600 font-bold hover:text-blue-700"
        >
          عرض الكل
        </button>
      </div>

      <div className="space-y-3">
        {safeNotifications.length ? (
          safeNotifications.map((notification) => {
            const tone =
              toneMap[toneFromNotification(notification)] || toneMap.info;

            const Icon = tone.Icon;

            return (
              <div
                key={
                  notification.id ||
                  `${notification.title || 'notification'}-${notification.created_at || Math.random()}`
                }
                className={`border rounded-2xl p-4 ${tone.box}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tone.iconWrap}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex-1">
                    <div className={`font-bold ${tone.title}`}>
                      {notification.title || 'تنبيه'}
                    </div>

                    <div className="text-sm text-slate-600 mt-1 leading-6">
                      {notification.message || '-'}
                    </div>

                    <div className="text-xs text-slate-400 mt-2">
                      {notification.created_at
                        ? new Date(notification.created_at).toLocaleString('ar')
                        : ''}
                    </div>
                  </div>

                  {!notification.is_read ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2" />
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center text-slate-400">
            لا توجد إشعارات.
          </div>
        )}
      </div>
    </div>
  );
}