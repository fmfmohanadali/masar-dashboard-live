import {
  Home,
  CalendarDays,
  Route,
  ClipboardList,
  Package,
  Truck,
  Ship,
  ShieldCheck,
  BarChart3,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { to: '/dashboard', label: 'الرئيسية', icon: Home },
  { to: '/bookings', label: 'الحجوزات', icon: CalendarDays },
  { to: '/trips', label: 'الرحلات', icon: Route },
  { to: '/transport-requests', label: 'طلبات النقل', icon: ClipboardList },
  { to: '/containers', label: 'الحاويات', icon: Package },
  { to: '/trucks', label: 'الشاحنات', icon: Truck },
  { to: '/ships', label: 'السفن', icon: Ship },
  { to: '/checkpoints', label: 'نقاط التفتيش', icon: ShieldCheck },
  { to: '/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/users', label: 'المستخدمون', icon: Users },
  { to: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar({ onLogout }) {
  return (
    <aside className="w-[280px] min-h-screen bg-brand text-white p-5 hidden lg:flex flex-col sticky top-0">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-brand flex items-center justify-center font-black text-xl shadow-soft">
            م
          </div>

          <div>
            <div className="text-xl font-black">مسار بلس</div>
            <div className="text-blue-100 text-sm">إدارة الميناء</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'w-full flex items-center justify-between rounded-2xl px-4 py-3 transition',
                  isActive
                    ? 'bg-blue-600 shadow-soft text-white'
                    : 'hover:bg-white/5 text-blue-50/90',
                ].join(' ')
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </span>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white px-4 py-3 transition"
      >
        <LogOut size={19} />
        تسجيل الخروج
      </button>
    </aside>
  );
}