import { useState } from 'react';
import { Anchor, LogIn } from 'lucide-react';
import { loginRequest } from '../api';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('أدخل اسم المستخدم وكلمة المرور');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await loginRequest(username.trim(), password);
      localStorage.setItem('masar_token', data.token);
      localStorage.setItem('masar_user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      if (err?.response?.status === 429) {
        setError('طلبات كثيرة. انتظر دقيقة ثم حاول مجدداً');
      } else {
        setError(err?.response?.data?.detail || err?.response?.data?.message || 'تعذر تسجيل الدخول');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" dir="rtl">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-blue-900 text-white p-12">
        <Anchor size={56} className="mb-6 opacity-90" />
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">مسار داشبورد</h1>
        <p className="text-blue-200 text-lg mb-8">لوحة تشغيل وإدارة الميناء</p>

        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">راقب العمليات لحظة بلحظة من مكان واحد</h2>
          <p className="text-blue-200/80 leading-8">
            لوحة تحكم مستقلة تربط الإدارة والتشغيل بالحجوزات والتنبيهات وعمليات المسح
            ونقاط التفتيش.
          </p>
        </div>
        <p className="mt-10 text-blue-300 text-sm">يسمح بالدخول لأدوار: ops / port_admin</p>
      </div>

      {/* Right panel - login form */}
      <div className="flex flex-col justify-center items-center p-6 lg:p-12 bg-slate-50">
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 w-full max-w-md space-y-5">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">تسجيل الدخول</h2>
            <p className="text-slate-400 text-sm">أدخل بيانات حساب التشغيل أو إدارة الميناء.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">اسم المستخدم</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              placeholder="اسم المستخدم"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">كلمة المرور</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              placeholder="كلمة المرور"
              type="password"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-2xl py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>

          <p className="text-slate-400 text-xs text-center mt-2">
            تأكد أن الـ Backend يعمل وأن المستخدم لديه دور <strong>ops</strong> أو <strong>port_admin</strong>.
          </p>
        </form>
      </div>
    </div>
  );
}
