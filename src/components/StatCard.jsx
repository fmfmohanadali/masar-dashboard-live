import { Clock3, Package, CalendarDays, DollarSign } from 'lucide-react';

const icons = {
  clock: Clock3,
  container: Package,
  calendar: CalendarDays,
  dollar: DollarSign,
};

export default function StatCard({ title, value, unit, trend, trendPositive = true, color, icon }) {
  const Icon = icons[icon] || CalendarDays;

  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500 mb-2">{title}</div>
          <div className="flex items-end gap-2 mb-1">
            <div className="text-4xl font-black text-slate-900 leading-none">{value}</div>
            <div className="text-slate-500 text-sm">{unit}</div>
          </div>
          <div className={['text-sm font-medium', trendPositive ? 'text-emerald-600' : 'text-rose-600'].join(' ')}>{trend}</div>
        </div>

        <div className={['w-16 h-16 rounded-2xl flex items-center justify-center', color].join(' ')}>
          <Icon size={26} />
        </div>
      </div>
    </div>
  );
}
