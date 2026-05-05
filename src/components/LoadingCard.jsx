export default function LoadingCard({ text = 'جاري التحميل...' }) {
  return (
    <div className="bg-white rounded-[22px] p-6 shadow-soft border border-slate-100">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="w-5 h-5 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
        <span className="font-medium">{text}</span>
      </div>
    </div>
  );
}