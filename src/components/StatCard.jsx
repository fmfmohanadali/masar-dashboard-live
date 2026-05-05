import {
  Clock3,
  Package,
  CalendarDays,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const icons = {
  clock: Clock3,
  container: Package,
  calendar: CalendarDays,
  dollar: DollarSign,
};

export default function StatCard({
  title,
  value,
  unit,
  trend,
  trendPositive = true,
  color = 'bg-blue-100 text-blue-700',
  icon = 'calendar',
}) {
  const Icon = icons[icon] || CalendarDays;
  const TrendIcon = trendPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500 mb-2">{title}</div>

          <div className="flex items-end gap-2">
            <div className="text-4xl font-black text-slate-900 leading-none">
              {value}
            </div>

            {unit ? (
              <div className="text-sm text-slate-400 mb-1">{unit}</div>
            ) : null}
          </div>
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={23} />
        </div>
      </div>

      {trend ? (
        <div
          className={[
            'mt-4 flex items-center gap-1 text-sm font-semibold',
            trendPositive ? 'text-emerald-600' : 'text-amber-600',
          ].join(' ')}
        >
          <TrendIcon size={16} />
          <span>{trend}</span>
        </div>
      ) : null}
    </div>
  );
}