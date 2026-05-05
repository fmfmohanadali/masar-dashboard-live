export default function Breadcrumbs({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item}-${index}`} className="flex items-center gap-2">
            <span className={isLast ? 'text-slate-700 font-semibold' : ''}>
              {item}
            </span>

            {!isLast ? (
              <span className="text-slate-300">/</span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}