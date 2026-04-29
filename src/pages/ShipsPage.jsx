import PageShell from '../components/PageShell';

export default function ShipsPage() {
  return (
    <PageShell
      title="السفن"
      subtitle="إدارة السفن والرحلات البحرية"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">السفن الحالية</div>
          <div className="text-4xl font-black text-slate-900">--</div>
        </div>

        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">السفن القادمة</div>
          <div className="text-4xl font-black text-slate-900">--</div>
        </div>

        <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">المغادرة اليوم</div>
          <div className="text-4xl font-black text-slate-900">--</div>
        </div>
      </div>

      <div className="bg-white rounded-[22px] p-10 shadow-soft border border-slate-100 text-center">
        <h3 className="text-2xl font-black text-slate-900 mb-3">صفحة السفن جاهزة للربط</h3>
        <p className="text-slate-500 leading-8 max-w-2xl mx-auto">
          هذه الصفحة مجهزة من جهة الواجهة، لكن تحتاج API خاصة بالسفن في الـ backend
          مثل: جدول السفن، وقت الوصول، وقت المغادرة، الرصيف، الحالة.
        </p>
      </div>
    </PageShell>
  );
}