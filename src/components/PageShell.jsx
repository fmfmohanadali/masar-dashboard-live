export default function PageShell({
  title,
  subtitle,
  children,
  actions = null,
}) {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {title}
          </h2>

          {subtitle ? (
            <p className="text-slate-500 mt-1">
              {subtitle}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>

      {children}
    </section>
  );
}