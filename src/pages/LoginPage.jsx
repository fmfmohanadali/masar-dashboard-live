import { useState } from 'react';
import { Anchor, LogIn } from 'lucide-react';

import { loginRequest } from '../api';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await loginRequest(username, password);

      localStorage.setItem('masar_token', data.token);
      localStorage.setItem('masar_user', JSON.stringify(data.user));

      onLogin(data.user);
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center p-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full">
        <div className="bg-brand text-white rounded-[32px] p-8 lg:p-10 shadow-soft overflow-hidden relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-white text-brand flex items-center justify-center mb-6">
              <Anchor size={34} />
            </div>

            <h1 className="text-4xl font-black mb-3">
              مسار داشبورد
            </h1>

            <p className="text-blue-100 text-lg mb-8">
              لوحة تشغيل وإدارة الميناء
            </p>

            <h2 className="text-2xl font-black mb-3">
              راقب العمليات لحظة بلحظة من مكان واحد
            </h2>

            <p className="text-blue-100 leading-8 max-w-xl">
              لوحة تحكم مستقلة تربط الإدارة والتشغيل بالحجوزات والتنبيهات وعمليات المسح
              ونقاط التفتيش.
            </p>

            <div className="mt-8 inline-flex bg-white/10 rounded-2xl px-4 py-3 text-sm">
              يسمح بالدخول لأدوار: ops / port_admin
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-soft border border-slate-100">
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            تسجيل الدخول
          </h2>

          <p className="text-slate-500 mb-8">
            أدخل بيانات حساب التشغيل أو إدارة الميناء.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                اسم المستخدم
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                كلمة المرور
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                placeholder="Admin@12345"
                type="password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-2xl px-4 py-3 font-bold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LogIn size={19} />
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-500 leading-7">
            تأكد أن الـ Backend يعمل وأن المستخدم لديه دور <b>ops</b> أو <b>port_admin</b>.
          </div>
        </div>
      </div>
    </div>
  );
}