export default function Breadcrumbs({ items = [] }) {export default function Breadcrumbs({ items =  if (!items.length) return null;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-2">
            <span className={index === items.length - 1 ? 'text-slate-900 font-semibold' : ''}>
              {item}
            </span>
            {index < items.length - 1 ? (
              <span className="text-slate-300">/</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}