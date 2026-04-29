import { Outlet } from 'react-router-dom';
import { Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-soft flex flex-row-reverse">
      <Sidebar onLogout={onLogout} />

      <main className="flex-1 p-6 lg:p-8 overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <Topbar user={user} notificationCount={0} />

          <button
            onClick={() => window.print()}
            className="hidden lg:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-soft hover:bg-blue-700 transition"
          >
            <Download size={18} />
            تصدير تقرير
          </button>
        </div>

        <Outlet />
        
        <div className="text-center text-slate-500 text-sm mt-8">
          © تطوير : مهند السعدي — جميع الحقوق محفوظة
        </div>
      </main>
    </div>
  );
}