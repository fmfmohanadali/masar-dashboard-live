import { Bell, CalendarDays, ChevronDown } from 'lucide-react';

export default function Topbar({
  user,
  notificationCount = 0,
  title = 'لوحة التحكم الرئيسية',
  subtitle = 'نظرة عامة على عمليات الميناء',
}) {
  const today = new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.username ||
    'المستخدم';

  return (
    <div className="flex-1 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">
          {title}
        </h1>

        <p className="text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-soft text-slate-600">
          <CalendarDays size={18} className="text-blue-600" />
          <span className="text-sm">اليوم</span>
          <span className="font-bold text-slate-800">{today}</span>
        </div>

        <div className="relative bg-white border border-slate-100 rounded-2xl p-3 shadow-soft">
          <Bell size={20} className="text-slate-600" />

          {notificationCount > 0 ? (
            <span className="absolute -top-1 -left-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {notificationCount}
            </span>
          ) : null}
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            {displayName.charAt(0)}
          </div>

          <div className="hidden sm:block">
            <div className="font-bold text-slate-900">{displayName}</div>
            <div className="text-xs text-slate-500">
              {user?.profile?.role || '—'}
            </div>
          </div>

          <ChevronDown size={18} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}