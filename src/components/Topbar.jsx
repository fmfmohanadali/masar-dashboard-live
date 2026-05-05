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

  return (
    <div className="flex-1 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900">{title}</h1>
        <p className="text-slate-500 mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-soft flex items-center gap-3 text-slate-700">
          <ChevronDown size={16} />
          <span>اليوم</span>
          <span className="text-slate-300">|</span>
          <span>{today}</span>
          <CalendarDays size={18} className="text-slate-500" />
        </button>

        <button className="relative bg-white w-14 h-14 rounded-2xl shadow-soft border border-slate-200 flex items-center justify-center text-slate-700">
          <Bell size={20} />
          {notificationCount > 0 ? (
            <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          ) : null}
        </button>

        <div className="bg-white rounded-2xl px-4 py-3 shadow-soft border border-slate-200 flex items-center gap-3 min-w-[220px]">
          <div className="w-12 h-12 rounded-full bg-slate-200"></div>
          <div>
            <div className="font-bold text-slate-900">
              {user?.first_name || user?.username || 'المستخدم'}
            </div>
            <div className="text-sm text-slate-500">{user?.profile?.role || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}