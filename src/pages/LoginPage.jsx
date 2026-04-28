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
    <div className="min-h-screen bg-soft flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-brand to-brand2 rounded-[28px] text-white p-10 shadow-soft min-h-[520px] flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center"><Anchor size={28} /></div>
              <div>
                <div className="text-2xl font-black">مسار داشبورد</div>
                <div className="text-blue-100/80">لوحة تشغيل وإدارة الميناء</div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black leading-tight mb-4">راقب العمليات لحظة بلحظة من مكان واحد</h2>
              <p className="text-blue-100/85 leading-8">
                لوحة تحكم مستقلة تربط الإدارة والتشغيل بالحجوزات والتنبيهات وعمليات المسح ونقاط التفتيش.
              </p>
            </div>
            <div className="text-sm text-blue-100/75">يسمح بالدخول لأدوار: admin / ops</div>
          </div>
        </div>

        <form onSubmit={submit} className="bg-white rounded-[28px] shadow-soft border border-slate-100 p-8 lg:p-10">
          <div className="mb-8 text-center lg:text-right">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-brand mb-4">
              <LogIn size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">تسجيل الدخول</h1>
            <p className="text-slate-500">أدخل بيانات حساب التشغيل أو الإدارة</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-500 mb-2">اسم المستخدم</label>
              <input
                className="w-full border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="admin أو ops"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2">كلمة المرور</label>
              <input
                type="password"
                className="w-full border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full mt-6 bg-brand text-white rounded-2xl px-5 py-4 font-bold hover:bg-brand2 transition disabled:opacity-60"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>

          <div className="mt-6 text-xs text-slate-400 text-center">
            تأكد أن الـ backend يعمل على Render وأن المستخدم بدور admin أو ops.
          </div>
        </form>
      </div>
    </div>
  );
}
