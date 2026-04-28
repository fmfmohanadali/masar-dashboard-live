import {
  Home,
  CalendarDays,
  Route,
  Package,
  Truck,
  Ship,
  ShieldCheck,
  BarChart3,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

const sidebarItems = [
  'الرئيسية',
  'الحجوزات',
  'الرحلات',
  'الحاويات',
  'الشاحنات',
  'السفن',
  'نقاط التفتيش',
  'التقارير',
  'المستخدمون',
  'الإعدادات',
];

const iconMap = {
  'الرئيسية': Home,
  'الحجوزات': CalendarDays,
  'الرحلات': Route,
  'الحاويات': Package,
  'الشاحنات': Truck,
  'السفن': Ship,
  'نقاط التفتيش': ShieldCheck,
  'التقارير': BarChart3,
  'المستخدمون': Users,
  'الإعدادات': Settings,
};

export default function Sidebar({ onLogout }) {
  return (
    <aside className="w-72 shrink-0 bg-[#08203d] text-white min-h-screen p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-black">م</div>
        <div>
          <div className="font-bold text-lg">رصيف بلس</div>
          <div className="text-xs text-blue-100/70">إدارة الميناء</div>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {sidebarItems.map((item, index) => {
          const Icon = iconMap[item] || Home;
          const active = index === 0;
          return (
            <button
              key={item}
              className={[
                'w-full flex items-center justify-between rounded-2xl px-4 py-3 transition',
                active ? 'bg-blue-600 shadow-soft' : 'hover:bg-white/5 text-blue-50/90'
              ].join(' ')}
            >
              <span className="font-medium">{item}</span>
              <Icon size={18} />
            </button>
          );
        })}
      </nav>

      <button onClick={onLogout} className="mt-6 flex items-center justify-between rounded-2xl px-4 py-3 text-blue-50/90 hover:bg-white/5 transition">
        <span className="font-medium">تسجيل الخروج</span>
        <LogOut size={18} />
      </button>
    </aside>
  );
}
