export default function LoadingCard({ text = 'جاري التحميل...' }) {
  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 text-slate-500 text-sm">
      {text}
    </div>
  );
}
