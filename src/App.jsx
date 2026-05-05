import { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { logoutRequest } from './api';

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('masar_user');

    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem('masar_user');
      return null;
    }
  });

  const role = useMemo(() => user?.profile?.role || '', [user]);

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('masar_token');
      localStorage.removeItem('masar_user');
      setUser(null);
    }
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const allowedRoles = ['ops', 'port_admin', 'admin'];
  const isAllowed = allowedRoles.includes(role);

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6" dir="rtl">
        <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            غير مسموح بالدخول
          </h1>

          <p className="text-slate-500 mb-6 leading-7">
            هذه اللوحة مخصصة فقط لأدوار الإدارة والتشغيل:
            <br />
            ops / port_admin
          </p>

          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/bookings"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/trips"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/transport-requests"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/containers"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/trucks"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/ships"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/checkpoints"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/reports"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/users"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route
        path="/settings"
        element={<DashboardPage user={user} onLogout={handleLogout} />}
      />

      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}