import { useMemo, useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { logoutRequest } from './api';

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('masar_user');
    return raw ? JSON.parse(raw) : null;
  });

  const role = useMemo(() => user?.profile?.role || '', [user]);

  async function handleLogout() {
    await logoutRequest();
    localStorage.removeItem('masar_token');
    localStorage.removeItem('masar_user');
    setUser(null);
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  if (!['admin', 'ops'].includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-soft">
        <div className="bg-white rounded-[22px] shadow-soft border border-slate-100 p-8 max-w-lg text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-3">غير مسموح بالدخول</h1>
          <p className="text-slate-600 mb-6">هذه اللوحة مخصصة فقط لأدوار الإدارة والتشغيل (admin / ops).</p>
          <button onClick={handleLogout} className="bg-brand text-white px-5 py-3 rounded-2xl">تسجيل الخروج</button>
        </div>
      </div>
    );
  }

  return <DashboardPage user={user} onLogout={handleLogout} />;
}
