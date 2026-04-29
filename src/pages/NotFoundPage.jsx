import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-soft p-6">
      <div className="bg-white rounded-[22px] shadow-soft border border-slate-100 p-10 max-w-xl text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">404</h1>
        <p className="text-slate-600 mb-6">الصفحة التي تبحث عنها غير موجودة.</p>
        <Link
          to="/dashboard"
          className="bg-brand text-white px-5 py-3 rounded-2xl inline-block"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
}